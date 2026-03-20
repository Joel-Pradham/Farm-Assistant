# 📜 Project Schema (Gemini Law)

## 📡 Output / Input Payload Shapes
- **Architecture Type:** Full-Stack Web Application
- **Frontend:** React 18, Vite v5, TailwindCSS v3.4, React Router DOM
- **Backend:** Python 3.11, FastAPI, Uvicorn (Port 8000)
- **Output:** HTML/CSS/JS compiled to `/web/dist`, served statically or alongside the FastAPI backend.
- **Aesthetic Core:** Monochromatic Batman UI (Deep Blacks, Tactical Cyan, Inter/Outfit typography, Fluid Spring animations)
- **Integrations:**
    - OpenWeatherMap API (Weather Module)
    - OpenAI GPT-4o-mini (Vision for Disease Scan, Text for Chat Assistant / Crop Rules)
- **Source of Truth:** Dual-layer. Static UI on frontend, AI logic + deterministic mock fallbacks on backend.
- **Delivery Payload:** Visual HUD for Terra Intelligence linked to 6 core functional modules.

## 🛠️ Maintenance Log
- **Build Engine:** Vite v5 + React 18 + TailwindCSS v3.4.
- **Backend Engine:** FastAPI + Uvicorn + Python 3.11
- **Iconography:** Lucide-React.
- **Animation Engine:** Framer Motion (Optimized for `type: "spring"`).
- **Deployment Trigger:** Frontend compiled via `cd web && npm run build`. FastAPI backend deployed via ASGI server (e.g. gunicorn or standard uvicorn).

## 🚀 Active Modules
1. **Disease Scanner**: Handles image upload, passes to FastAPI `/api/disease-scan` for OpenAI Vision or rule-based diagnosis.
2. **Crop Advisor**: Submits soil/climate data to `/api/crop-recommend`.
3. **Weather Intel**: Live OpenWeatherMap data via `/api/weather`.
4. **Fertilizer Engine**: NPK ratio calculations via `/api/fertilizer`.
5. **AI Chat**: Interactive assistant via `/api/chat`.
6. **Command Dashboard**: Central hub displaying system status and live weather.
