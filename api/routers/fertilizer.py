"""
Terra Intelligence — Fertilizer Recommendation Router
NPK gap analysis against standard crop requirements.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class FertilizerInput(BaseModel):
    crop: str
    nitrogen: float       # kg/ha current
    phosphorus: float     # kg/ha current
    potassium: float      # kg/ha current
    soil_type: str        # clay, loam, sandy, laterite, red, alluvial
    area_hectares: Optional[float] = 1.0
    growth_stage: Optional[str] = "vegetative"  # vegetative, flowering, fruiting


# Standard NPK requirements (kg/ha) for major Kerala crops
CROP_NPK = {
    "rice": {"N": 90, "P": 45, "K": 45, "name": "Rice (Paddy)"},
    "paddy": {"N": 90, "P": 45, "K": 45, "name": "Rice (Paddy)"},
    "coconut": {"N": 500, "P": 320, "K": 1200, "name": "Coconut"},
    "rubber": {"N": 150, "P": 60, "K": 120, "name": "Rubber"},
    "banana": {"N": 200, "P": 60, "K": 300, "name": "Banana (Nendran)"},
    "nendran": {"N": 200, "P": 60, "K": 300, "name": "Banana (Nendran)"},
    "pepper": {"N": 100, "P": 45, "K": 140, "name": "Black Pepper"},
    "cardamom": {"N": 75, "P": 75, "K": 150, "name": "Cardamom"},
    "tapioca": {"N": 100, "P": 50, "K": 100, "name": "Tapioca (Cassava)"},
    "cassava": {"N": 100, "P": 50, "K": 100, "name": "Tapioca (Cassava)"},
    "sugarcane": {"N": 250, "P": 100, "K": 165, "name": "Sugarcane"},
}

# Fertilizer reference table
FERTILIZERS = {
    "N": [
        {"product": "Urea (46-0-0)", "n_content": 0.46, "note": "Fast-release nitrogen. Apply split doses."},
        {"product": "Ammonium Sulphate (21-0-0)", "n_content": 0.21, "note": "Acidifying effect — good for high-pH soils."},
    ],
    "P": [
        {"product": "Single Super Phosphate (0-16-0)", "p_content": 0.16, "note": "Also supplies Calcium and Sulphur."},
        {"product": "Di-ammonium Phosphate (18-46-0)", "p_content": 0.46, "note": "Also contributes nitrogen. Blend carefully."},
    ],
    "K": [
        {"product": "Muriate of Potash (0-0-60)", "k_content": 0.60, "note": "Standard potash. Most cost-effective."},
        {"product": "Sulphate of Potash (0-0-50)", "k_content": 0.50, "note": "Chloride-free — preferred for pepper & coconut."},
    ],
    "organic": [
        {"product": "Vermicompost", "note": "Apply 5 tonnes/ha. Improves soil structure and water retention."},
        {"product": "Neem Cake", "note": "Apply 500 kg/ha. Supplies NPK + acts as organic pesticide."},
        {"product": "Bone Meal", "note": "Slow-release phosphorus and calcium. Good basal application."},
    ]
}


def get_crop_data(crop_name: str):
    key = crop_name.lower().strip()
    if key in CROP_NPK:
        return CROP_NPK[key]
    # Fuzzy match
    for k, v in CROP_NPK.items():
        if k in key or key in k:
            return v
    return None


@router.post("")
async def recommend_fertilizer(inp: FertilizerInput):
    crop_data = get_crop_data(inp.crop)
    if not crop_data:
        return {
            "error": f"Crop '{inp.crop}' not found in database",
            "supported_crops": list(set(v["name"] for v in CROP_NPK.values()))
        }

    required_N = crop_data["N"]
    required_P = crop_data["P"]
    required_K = crop_data["K"]

    gap_N = max(0, required_N - inp.nitrogen)
    gap_P = max(0, required_P - inp.phosphorus)
    gap_K = max(0, required_K - inp.potassium)
    area = inp.area_hectares or 1.0

    # Calculate fertilizer quantities
    schedule = []

    # Nitrogen
    if gap_N > 0:
        urea_kg = round((gap_N / 0.46) * area, 1)
        schedule.append({
            "nutrient": "Nitrogen (N)",
            "deficiency": round(gap_N, 1),
            "status": "Deficient" if gap_N > 20 else "Low",
            "color": "red" if gap_N > 40 else "amber",
            "product": "Urea (46-0-0)",
            "quantity_kg": urea_kg,
            "application": f"Split into 3 doses over growing season. Avoid application before heavy rain.",
            "timing": "Basal + 30 days + 60 days after transplant"
        })
    else:
        schedule.append({
            "nutrient": "Nitrogen (N)",
            "deficiency": 0,
            "status": "Adequate",
            "color": "green",
            "product": "None required",
            "quantity_kg": 0,
            "application": "Current nitrogen levels are sufficient.",
            "timing": "Monitor at next crop stage"
        })

    # Phosphorus
    if gap_P > 0:
        ssp_kg = round((gap_P / 0.16) * area, 1)
        schedule.append({
            "nutrient": "Phosphorus (P)",
            "deficiency": round(gap_P, 1),
            "status": "Deficient" if gap_P > 15 else "Low",
            "color": "red" if gap_P > 30 else "amber",
            "product": "Single Super Phosphate (16%)",
            "quantity_kg": ssp_kg,
            "application": "Apply as basal dose, incorporate into soil before planting.",
            "timing": "Full dose at planting/transplanting"
        })
    else:
        schedule.append({
            "nutrient": "Phosphorus (P)",
            "deficiency": 0,
            "status": "Adequate",
            "color": "green",
            "product": "None required",
            "quantity_kg": 0,
            "application": "Phosphorus levels are sufficient.",
            "timing": "Reassess after harvest"
        })

    # Potassium
    if gap_K > 0:
        mop_kg = round((gap_K / 0.60) * area, 1)
        schedule.append({
            "nutrient": "Potassium (K)",
            "deficiency": round(gap_K, 1),
            "status": "Deficient" if gap_K > 30 else "Low",
            "color": "red" if gap_K > 60 else "amber",
            "product": "Muriate of Potash (60%)",
            "quantity_kg": mop_kg,
            "application": "Split equally between basal and top-dress at flowering.",
            "timing": "50% at planting + 50% at flower initiation"
        })
    else:
        schedule.append({
            "nutrient": "Potassium (K)",
            "deficiency": 0,
            "status": "Adequate",
            "color": "green",
            "product": "None required",
            "quantity_kg": 0,
            "application": "Potassium levels are sufficient.",
            "timing": "Monitor at fruiting stage"
        })

    # Soil-type specific advice
    soil_tips = {
        "laterite": "Laterite soils have high iron/aluminium. Phosphorus gets fixed — apply extra 20% P and use VAM inoculant.",
        "clay": "Clay soils have good nutrient retention but poor drainage. Avoid nitrogen during waterlogging.",
        "sandy": "Sandy soils leach nutrients rapidly. Use split doses for all nutrients every 2 weeks.",
        "loam": "Ideal soil type. Standard schedule applies. Maintain organic matter > 1.5%.",
        "red": "Red soils are acidic and iron-rich. Apply lime to correct pH before fertilizing.",
        "alluvial": "Alluvial soils are fertile. Balanced NPK sufficient. Excellent for rice and banana.",
    }
    soil_key = inp.soil_type.lower()
    soil_advice = soil_tips.get(soil_key, "Apply standard schedule. Test soil annually.")

    organic_recs = [
        FERTILIZERS["organic"][0],  # Vermicompost always recommended
    ]
    if "laterite" in soil_key or "red" in soil_key:
        organic_recs.append(FERTILIZERS["organic"][2])  # Bone meal for acidic soils

    return {
        "crop": crop_data["name"],
        "area_hectares": area,
        "growth_stage": inp.growth_stage,
        "npk_schedule": schedule,
        "organic_recommendations": organic_recs,
        "soil_advice": soil_advice,
        "total_cost_estimate": f"₹{int((gap_N * 25 + gap_P * 35 + gap_K * 20) * area):,} – ₹{int((gap_N * 30 + gap_P * 40 + gap_K * 25) * area):,} approx.",
        "required_npk": {"N": required_N, "P": required_P, "K": required_K},
        "current_npk": {"N": inp.nitrogen, "P": inp.phosphorus, "K": inp.potassium},
    }
