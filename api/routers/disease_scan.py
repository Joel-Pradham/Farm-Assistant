"""
Terra Intelligence — Disease Detection Router
Uses OpenAI Vision (gpt-4o-mini) if key is set.
Falls back to a diagnostic knowledge base mock.
"""
import os
import base64
from fastapi import APIRouter, UploadFile, File
from openai import AsyncOpenAI

router = APIRouter()
GROQ_KEY = os.getenv("GROQ_API_KEY", "")
OPENAI_KEY = os.getenv("OPENAI_API_KEY", "")
API_KEY = GROQ_KEY or OPENAI_KEY

# Disease knowledge base for mock/fallback
DISEASE_DB = {
    "rice_leaf_blight": {
        "name": "Bacterial Leaf Blight",
        "crop": "Rice",
        "confidence": 91,
        "severity": "High",
        "cause": "Xanthomonas oryzae pv. oryzae — a bacterium that enters through leaf stomata and water pores during warm, humid conditions.",
        "symptoms": ["Water-soaked lesions on leaf margins", "Yellow to white stripes along veins", "Wilting of whole tillers in severe cases"],
        "treatment": [
            "Remove and burn infected plant parts immediately",
            "Apply Copper Oxychloride 50% WP at 3g/litre as foliar spray",
            "Drain and re-flood field after 5 days",
            "Use resistant varieties: Jyothi, Aiswarya"
        ],
        "prevention": "Avoid excess nitrogen. Ensure proper field drainage. Use certified seeds.",
        "urgency": "Act within 48 hours to prevent spread.",
    },
    "coconut_leaf_yellowing": {
        "name": "Root (Wilt) Disease",
        "crop": "Coconut",
        "confidence": 87,
        "severity": "Critical",
        "cause": "Phytoplasma — a bacterial pathogen transmitted by planthopper (Proutista moesta). Unique to Kerala's coconut belt.",
        "symptoms": ["Progressive yellowing from older fronds", "Reduction in leaf size", "Flaccidity of spear leaf", "Poor nut formation"],
        "treatment": [
            "No complete cure exists — management focused",
            "Inject 15ml Oxytetracycline (1000 ppm) into stem using trunk injection technique",
            "Apply 200g Neem cake to root-zone quarterly",
            "Control vector with Monocrotophos 36 SL spray"
        ],
        "prevention": "Inoculate resistant seedlings from KAU. Maintain field hygiene. Remove dead palms.",
        "urgency": "Chronic — begin management protocol within 2 weeks.",
    },
    "pepper_phytophthora": {
        "name": "Quick Wilt (Phytophthora)",
        "crop": "Black Pepper",
        "confidence": 94,
        "severity": "Critical",
        "cause": "Phytophthora capsici — a water mold thriving in waterlogged conditions. Most devastating pepper disease in Kerala.",
        "symptoms": ["Sudden wilting of runner shoots", "Dark green water-soaked stem lesions", "Berries drop before maturity"],
        "treatment": [
            "Drench soil around base with Metalaxyl MZ 72 WP (2.5g/litre)",
            "Apply Trichoderma viride (5g/litre) as bio-control",
            "Remove infected vines and standard trees immediately",
            "Spray Bordeaux Mixture 1% as preventive after rains"
        ],
        "prevention": "Improve drainage. Avoid water stagnation. Use grafted plants on resistant rootstocks.",
        "urgency": "Emergency — respond within 24 hours, disease is extremely virulent.",
    },
    "banana_panama_wilt": {
        "name": "Panama Wilt (Fusarium Wilt)",
        "crop": "Banana",
        "confidence": 89,
        "severity": "High",
        "cause": "Fusarium oxysporum — soil-borne fungus that attacks the banana corm, blocking water transport vessels.",
        "symptoms": ["Lower leaves turn yellow, then brown from margin", "Brown discoloration in cross-section of pseudostem", "Plant wilts suddenly"],
        "treatment": [
            "No chemical cure — remove and destroy entire affected plant",
            "Drench soil with Carbendazim 1g/litre around healthy plants",
            "Apply 500g Pseudomonas fluorescens to each plant hole",
            "Leave field fallow for 1–2 seasons"
        ],
        "prevention": "Use tissue-cultured plants. Avoid soil from infected farms. Maintain soil pH above 6.5.",
        "urgency": "Act within 24 hours. Disease spreads through soil and irrigation water.",
    },
}

MOCK_KEYS = list(DISEASE_DB.keys())


async def _analyze_with_openai(image_bytes: bytes, filename: str) -> dict:
    is_groq = API_KEY.startswith("gsk_")
    base_url = "https://api.groq.com/openai/v1" if is_groq else None
    model_name = "meta-llama/llama-4-scout-17b-16e-instruct" if is_groq else "gpt-4o-mini"

    client = AsyncOpenAI(api_key=API_KEY, base_url=base_url)
    b64 = base64.standard_b64encode(image_bytes).decode("utf-8")
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "jpeg"
    mime = f"image/{ext}" if ext in ["jpeg", "jpg", "png", "webp"] else "image/jpeg"

    response = await client.chat.completions.create(
        model=model_name,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an agricultural plant pathologist AI specializing in Kerala, India crops "
                    "(rice, coconut, rubber, banana, pepper, cardamom, tapioca). "
                    "Analyze the plant image and return ONLY a JSON object with these exact fields: "
                    "name (disease name), crop (affected crop), confidence (0–100 integer), severity (Low/Medium/High/Critical), "
                    "cause (pathogen and conditions), symptoms (array of 3 strings), "
                    "treatment (array of 4 action strings), prevention (one string), urgency (one string). "
                    "If the image is not a plant, set name to 'No Plant Detected' and all other fields appropriately. "
                    "Return ONLY the JSON. No markdown."
                )
            },
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{b64}"}},
                    {"type": "text", "text": "Analyze this crop image for diseases. Return JSON only."}
                ]
            }
        ],
        max_tokens=600,
    )
    import json
    text = response.choices[0].message.content.strip()
    # Strip markdown code blocks if present
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())


def _mock_disease_analysis(filename: str) -> dict:
    """Deterministic mock — rotates through diseases based on filename hash."""
    idx = hash(filename) % len(MOCK_KEYS)
    key = MOCK_KEYS[idx]
    return DISEASE_DB[key]


@router.post("")
async def scan_disease(file: UploadFile = File(...)):
    contents = await file.read()
    filename = file.filename or "upload.jpg"

    if API_KEY and API_KEY not in ["your_openai_key_here", ""]:
        try:
            result = await _analyze_with_openai(contents, filename)
            result["source"] = "groq_vision" if API_KEY.startswith("gsk_") else "openai_vision"
            return result
        except Exception as e:
            print(f"OpenAI vision error: {e}")
            if 'insufficient_quota' in str(e):
                return {
                    "name": "API Quota Exceeded",
                    "crop": "Unknown",
                    "confidence": 0,
                    "severity": "Critical",
                    "cause": "Your API key has insufficient quota (out of credits). Please add funds.",
                    "symptoms": ["API Error: Insufficient Quota"],
                    "treatment": ["Add funds to your API account"],
                    "prevention": "Ensure billing is active",
                    "urgency": "Immediate",
                    "source": "quota_error"
                }
            else:
                return {
                    "name": "AI Service Unavailable",
                    "crop": "Unknown",
                    "confidence": 0,
                    "severity": "Critical",
                    "cause": f"The AI analysis service failed: {str(e)}",
                    "symptoms": ["API Error"],
                    "treatment": ["Try again later", "Check API keys and model availability"],
                    "prevention": "Monitor AI service status",
                    "urgency": "Immediate",
                    "source": "api_error"
                }

    # If no API key is provided at all
    return {
        "name": "Demo Mode: No API Key Configured",
        "crop": "Unknown",
        "confidence": 0,
        "severity": "Low",
        "cause": "No Groq or OpenAI API key found in backend configuration.",
        "symptoms": ["Missing API Key"],
        "treatment": ["Add GROQ_API_KEY to .env"],
        "prevention": "Configure environment variables properly",
        "urgency": "Low",
        "source": "demo_mode"
    }
