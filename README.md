# Farm Intel — AI-Powered Agricultural Decision System

Farm Intel is a full-stack platform that provides data-driven insights for modern agriculture. It combines computer vision, environmental data, and rule-based analysis to assist in crop health monitoring, fertilizer planning, and decision-making.

---

## Overview

The system is designed to help farmers and agronomists make informed decisions using real-time data and AI-assisted analysis.

It provides:

* Crop disease detection from images
* Soil-based crop recommendations
* Weather-aware decision support
* Fertilizer requirement calculations
* Interactive AI-based assistance

---

## Features

### Disease Detection

* Image-based crop analysis using vision models
* Identifies possible diseases, nutrient deficiencies, and stress factors

### Crop Recommendation System

* Suggests suitable crops based on:

  * Soil pH
  * NPK values
  * Environmental conditions

### Weather Integration

* Real-time weather data integration
* Forecast-based recommendations and alerts

### Fertilizer Optimization

* Computes required NPK ratios
* Helps reduce overuse of fertilizers

### AI Assistant

* Provides agricultural guidance and troubleshooting
* Handles user queries related to crops, soil, and environment

### Dashboard

* Centralized interface displaying:

  * Weather data
  * System modules
  * Quick access tools

---

## Tech Stack

### Frontend

* React (SPA architecture)
* Vite (build tool)
* Tailwind CSS (styling)
* Framer Motion (animations)
* React Router (navigation)

### Backend

* FastAPI (Python)
* Uvicorn (ASGI server)
* REST API architecture

### AI & External Services

* OpenAI (vision + language models)
* OpenWeatherMap API (weather data)

---

## System Workflow

1. User inputs data (image, soil values, or query)
2. Backend processes input through appropriate module:

   * Vision model → disease detection
   * Rule-based logic → crop/fertilizer recommendation
   * API → weather data
3. Results are returned via API
4. Frontend displays actionable insights

---

## Installation

### Prerequisites

* Node.js (v18+)
* Python (3.11+)
* API keys (OpenAI, OpenWeatherMap)

---

### Clone the repository

```bash
git clone https://github.com/your-username/terra-intelligence.git
cd terra-intelligence
```

---

### Backend setup

```bash
pip install -r requirements.txt
python -m uvicorn api.main:app --reload --port 8000
```

---

### Frontend setup

```bash
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file:

```env
OPENAI_API_KEY=your_key_here
OPENWEATHERMAP_API_KEY=your_key_here
DEFAULT_CITY=Ernakulam
DEFAULT_COUNTRY=IN
```

---

## API Documentation

Available at:

```
http://localhost:8000/docs
```

---

## Project Structure

```
terra-intelligence/
├── api/
├── frontend/
├── models/
├── utils/
├── requirements.txt
└── README.md
```

---

## Future Improvements

* Improve accuracy of disease detection models
* Add satellite or drone-based monitoring
* Offline support for low-connectivity areas
* Expand dataset for region-specific recommendations

---

## Author

Joel Pradham
AI/ML Engineer | Full-Stack Developer

---

## License

MIT License
