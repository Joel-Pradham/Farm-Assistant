# 🦇 Terra Intelligence

### *Precision AI Agricultural Ecosystem*

Built for modern farming, **Terra Intelligence** is a high-performance command center that transforms environmental and biological data into mission-critical insights. Designed with a tactical "Batman-inspired" HUD, the platform prioritizes speed, precision, and actionable intelligence.

---

## 🚀 Core Features

### 🔍 AI Disease Scanner
- **Computer Vision:** Powered by OpenAI GPT-4o Vision.
- **Function:** Real-time diagnostic scanning of crop images to identify pathogens, nutrient deficiencies, and environmental stress.

### 🌾 Smart Crop Advisor
- **Intelligence:** Multi-variate recommendation engine.
- **Function:** Optimizes crop selection by analyzing soil pH, nutrient levels (NPK), and local climate data.

### ☁️ Weather Intelligence (Intel)
- **Integration:** Real-time data via OpenWeatherMap API.
- **Function:** Hyper-local forecasts, environmental tracking, and severe weather alerts integrated into the HUD.

### 🧪 Precision Fertilizer Engine
- **Calculations:** Automated NPK ratio computations.
- **Function:** Minimizes chemical runoff and maximizes yield by calculating exact plant requirements.

### 🤖 Interactive AI Assistant
- **Expertise:** 24/7 expert agricultural consultation.
- **Function:** An LLM-powered interface for troubleshooting, agronomic advice, and rapid system queries.

### 🛰️ Mission Command Dashboard
- **HUD:** Centralized real-time hub.
- **Function:** Displays system health, live weather stats, and rapid module shortcuts in a unified tactical dashboard.

---

## 🛠️ Technology Stack

### **Frontend (The HUD)**
- **Core:** React 19, Vite v8
- **Styling:** TailwindCSS v3.4 (Utility-first tactical design)
- **Animations:** Framer Motion (Fluid "Spring" physics for micro-interactions)
- **Icons:** Lucide-React (Technical glyphs)
- **Navigation:** React Router DOM v7

### **Backend (The Core)**
- **Architecture:** FastAPI (Python 3.11)
- **Server:** Uvicorn (Asynchronous high-performance ASGI)
- **Protocols:** RESTful API with modular routing system
- **Dependency Management:** pip (`requirements.txt`)

### **AI & Services**
- **Primary Vision AI:** Groq Vision — `meta-llama/llama-4-scout-17b-16e-instruct` (ultra-fast inference)
- **Fallback LLM:** OpenAI GPT-4o-mini
- **Weather Data:** OpenWeatherMap API
- **Knowledge Base:** 20+ Kerala crop disease encyclopedia (offline fallback)

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (3.11+)
- **API Keys:** Groq API Key (free at [console.groq.com](https://console.groq.com)) & OpenWeatherMap API Key

### 2. Clone and Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration
Copy the example env file and fill in your keys:
```bash
cp .env.example .env
```
```env
GROQ_API_KEY=your_groq_key_here
OPENAI_API_KEY=your_openai_key_here        # optional fallback
OPENWEATHERMAP_API_KEY=your_key_here
DEFAULT_CITY=Ernakulam
DEFAULT_COUNTRY=IN
```
> **Note:** `.env` is gitignored — never commit real API keys. See `.env.example` for the template.


---

## ⚡ Running the Application

### Start the Backend
```bash
# Direct command
python -m uvicorn api.main:app --port 8000 --reload

# Or use the provided PowerShell script
./run_backend.ps1
```

### Start the Frontend
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173` (Frontend) and `http://localhost:8000/docs` (API Docs).

---

## 📐 Design Philosophy
- **Tactical Aesthetics:** Deep Blacks (`#020617`) and Tactical Cyan highlights.
- **High Performance:** Minimized latency through asynchronous API handling and Vite's HMR.
- **Outdoor Optimized:** High-contrast monochromatic UI designed for field visibility.

---

## 🌑 Maintainers
Building at the intersection of Agriculture and Artificial Intelligence.
