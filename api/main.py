"""
Terra Intelligence — FastAPI Backend
Main application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routers import weather, crop_recommend, disease_scan, fertilizer, chat

app = FastAPI(
    title="Terra Intelligence API",
    description="Agricultural AI Backend for Terra Intelligence Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"],
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
