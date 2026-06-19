"""
Terra Intelligence — FastAPI Backend
Main application entry point
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from api.routers import weather, crop_recommend, disease_scan, fertilizer, chat

app = FastAPI(
    title="Terra Intelligence API",
    description="Agricultural AI Backend for Terra Intelligence Platform",
    version="1.0.0",
)

# CORS: allow localhost for dev + all vercel.app domains for production
# When frontend and API are co-hosted on Vercel, same-origin requests skip CORS anyway.
_extra_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "https://*.vercel.app",
] + [o.strip() for o in _extra_origins if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])
app.include_router(crop_recommend.router, prefix="/api/crop-recommend", tags=["Crop Recommendation"])
app.include_router(disease_scan.router, prefix="/api/disease-scan", tags=["Disease Detection"])
app.include_router(fertilizer.router, prefix="/api/fertilizer", tags=["Fertilizer"])
app.include_router(chat.router, prefix="/api/chat", tags=["AI Chat"])


@app.get("/api/health")
async def health_check():
    return {"status": "operational", "system": "Terra Intelligence v1.0"}

