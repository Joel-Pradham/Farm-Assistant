"""
Terra Intelligence — Crop Recommendation Router
Expert system based on Kerala agricultural data.
Uses pH ranges, rainfall, temperature bands for region-accurate results.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class CropInput(BaseModel):
    soil_ph: float
    temperature: float       # Celsius
    humidity: float          # Percentage
    rainfall: float          # mm/year
    soil_type: str           # clay, loam, sandy, red, laterite, alluvial
    nitrogen: Optional[int] = 50
    phosphorus: Optional[int] = 30
    potassium: Optional[int] = 40


# Kerala-specific crop knowledge base
CROP_DB = [
    {
        "name": "Rice (Paddy)",
        "malayalam": "നെല്ല്",
        "ph_range": (5.5, 7.0),
        "temp_range": (20, 37),
        "humidity_range": (60, 100),
        "rainfall_range": (1200, 3000),
        "soil_types": ["clay", "loam", "alluvial"],
        "duration": "120–150 days",
        "yield": "3–5 tonnes/hectare",
        "season": "Kharif (June–Nov), Rabi (Nov–Mar)",
        "description": "Primary staple crop of Kerala. Thrives in the high-humidity monsoon climate. Backwater plains are ideal.",
        "tips": ["Maintain standing water of 5–10 cm", "Apply 40–30–30 NPK per hectare", "Monitor for brown planthopper"],
        "image_hint": "rice",
    },
    {
        "name": "Coconut",
        "malayalam": "തെങ്ങ്",
        "ph_range": (5.5, 8.0),
        "temp_range": (20, 35),
        "humidity_range": (60, 90),
        "rainfall_range": (1000, 2500),
        "soil_types": ["loam", "sandy", "laterite", "red"],
        "duration": "Perennial (7–10 yrs to first yield)",
        "yield": "80–120 nuts/palm/year",
        "season": "Year-round (2 harvests/year)",
        "description": "The 'Kalpavriksha' of Kerala. Highly adaptable and drought-tolerant once established. State tree of Kerala.",
        "tips": ["Circular basin irrigation", "Intercrop with banana or pepper", "Apply sea shell lime to correct pH"],
        "image_hint": "coconut",
    },
    {
        "name": "Rubber",
        "malayalam": "റബ്ബർ",
        "ph_range": (4.5, 6.5),
        "temp_range": (25, 34),
        "humidity_range": (70, 90),
        "rainfall_range": (1500, 2500),
        "soil_types": ["laterite", "loam", "red"],
        "duration": "Perennial (6–7 yrs to tapping)",
        "yield": "1.5–2 kg dry rubber/tree/year",
        "season": "Tapping: Jan–May, Oct–Dec",
        "description": "Dominant plantation crop of midland Kerala. Thrives in deep, well-drained laterite soil with high rainfall.",
        "tips": ["Panel tapping at 45° angle", "Shield budding for high-yield clones", "Avoid tapping in monsoon"],
        "image_hint": "rubber",
    },
    {
        "name": "Banana (Nendran)",
        "malayalam": "നേന്ത്രക്കായ",
        "ph_range": (5.5, 7.5),
        "temp_range": (20, 35),
        "humidity_range": (50, 90),
        "rainfall_range": (900, 2200),
        "soil_types": ["loam", "alluvial", "clay"],
        "duration": "10–12 months",
        "yield": "20–35 kg/bunch",
        "season": "Harvested year-round",
        "description": "King variety of Kerala. Nendran commands premium prices. Suited to well-drained alluvial and loam soils.",
        "tips": ["Remove dry leaves regularly", "Prop stems before flowering", "Apply potash for bunch development"],
        "image_hint": "banana",
    },
    {
        "name": "Black Pepper",
        "malayalam": "കുരുമുളക്",
        "ph_range": (5.0, 7.0),
        "temp_range": (20, 35),
        "humidity_range": (60, 95),
        "rainfall_range": (1500, 2500),
        "soil_types": ["loam", "red", "laterite"],
        "duration": "Perennial (3 yrs to first yield)",
        "yield": "2–4 kg dry pepper/vine/year",
        "season": "Harvest: Nov–Jan",
        "description": "'Black Gold' of Kerala. Shade-loving vine requiring living standards. High value export crop.",
        "tips": ["Train on Erythrina or Garuga standards", "Heavy mulching required", "Spray Bordeaux mixture for Phytophthora"],
        "image_hint": "pepper",
    },
    {
        "name": "Tapioca (Cassava)",
        "malayalam": "കപ്പ",
        "ph_range": (5.0, 7.5),
        "temp_range": (20, 35),
        "humidity_range": (50, 90),
        "rainfall_range": (500, 1800),
        "soil_types": ["sandy", "loam", "laterite", "red"],
        "duration": "7–11 months",
        "yield": "25–40 tonnes/hectare",
        "season": "Harvest: April–August",
        "description": "Hardy drought-resistant crop. A food security staple. Grows well in poor soils where other crops fail.",
        "tips": ["Plant stakes 30cm deep", "Inter-crop with cowpea for nitrogen", "Harvest before woody stem sets"],
        "image_hint": "cassava",
    },
    {
        "name": "Cardamom",
        "malayalam": "ഏലക്ക",
        "ph_range": (5.0, 6.5),
        "temp_range": (10, 30),
        "humidity_range": (70, 90),
        "rainfall_range": (1500, 4000),
        "soil_types": ["loam", "red"],
        "duration": "Perennial (2–3 yrs to yield)",
        "yield": "150–200 kg dry/hectare",
        "season": "Harvest: Sep–Feb",
        "description": "'Queen of Spices'. High-altitude Wayanad/Idukki crop. Extreme value, shade-dependent, high fragrance.",
        "tips": ["Shade canopy 50–60% essential", "Mulch with cardamom leaf litter", "Irrigate with micro-sprinklers"],
        "image_hint": "cardamom",
    },
    {
        "name": "Sugarcane",
        "malayalam": "കരിമ്പ്",
        "ph_range": (6.0, 8.0),
        "temp_range": (20, 40),
        "humidity_range": (50, 80),
        "rainfall_range": (750, 2000),
        "soil_types": ["loam", "alluvial", "clay"],
        "duration": "12–18 months",
        "yield": "70–90 tonnes/hectare",
        "season": "Harvest: Jan–Apr",
        "description": "Strong cash crop for flat river plains. Grows best in deep alluvial with good water retention.",
        "tips": ["Furrow irrigation efficient", "Ratoon crop for 2nd season", "Apply trash mulching post-harvest"],
        "image_hint": "sugarcane",
    }
]


def score_crop(crop: dict, inp: CropInput) -> float:
    score = 0.0
    # pH score (0–30)
    ph_min, ph_max = crop["ph_range"]
    if ph_min <= inp.soil_ph <= ph_max:
        score += 30
    elif abs(inp.soil_ph - ph_min) < 0.5 or abs(inp.soil_ph - ph_max) < 0.5:
        score += 15

    # Temperature score (0–25)
    t_min, t_max = crop["temp_range"]
    if t_min <= inp.temperature <= t_max:
        score += 25
    elif abs(inp.temperature - t_min) < 3 or abs(inp.temperature - t_max) < 3:
        score += 12

    # Rainfall score (0–25)
    r_min, r_max = crop["rainfall_range"]
    if r_min <= inp.rainfall <= r_max:
        score += 25
    elif abs(inp.rainfall - r_min) < 200 or abs(inp.rainfall - r_max) < 200:
        score += 12

    # Humidity score (0–10)
    h_min, h_max = crop["humidity_range"]
    if h_min <= inp.humidity <= h_max:
        score += 10

    # Soil type score (0–10)
    if inp.soil_type.lower() in crop["soil_types"]:
        score += 10

    return score


@router.post("")
async def recommend_crops(inp: CropInput):
    scored = []
    for crop in CROP_DB:
        s = score_crop(crop, inp)
        if s > 0:
            scored.append({"score": s, "crop": crop})

    scored.sort(key=lambda x: x["score"], reverse=True)
    top3 = scored[:3]

    results = []
    max_score = top3[0]["score"] if top3 else 1
    for item in top3:
        crop = item["crop"]
        match_pct = round((item["score"] / 95) * 100)
        results.append({
            "name": crop["name"],
            "malayalam": crop["malayalam"],
            "match_percent": min(match_pct, 98),
            "duration": crop["duration"],
            "yield": crop["yield"],
            "season": crop["season"],
            "description": crop["description"],
            "tips": crop["tips"],
            "image_hint": crop["image_hint"],
        })

    warnings = []
    if inp.soil_ph < 5.0:
        warnings.append("Soil is highly acidic. Apply agricultural lime at 2–4 tonnes/ha before planting.")
    if inp.soil_ph > 7.5:
        warnings.append("Alkaline soil detected. Incorporate gypsum or sulfur to correct pH.")
    if inp.rainfall < 600:
        warnings.append("Low rainfall zone. Install drip irrigation infrastructure before planting.")
    if inp.nitrogen < 20:
        warnings.append("Nitrogen deficiency detected. Apply urea or green manure immediately.")

    return {
        "recommendations": results,
        "warnings": warnings,
        "input_summary": {
            "ph": inp.soil_ph,
            "temp": inp.temperature,
            "humidity": inp.humidity,
            "rainfall": inp.rainfall,
            "soil": inp.soil_type,
        }
    }
