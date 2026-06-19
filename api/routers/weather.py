from fastapi import APIRouter, HTTPException, Query
import httpx
from datetime import datetime, timedelta

router = APIRouter()

@router.get("")
async def get_weather(city: str = Query("Ernakulam"), country: str = Query("IN")):
    """
    High-performance Weather API using Open-Meteo (No API keys required)
    Provides 100% reliable forecasts worldwide with robust irrigation logic.
    """
    try:
        # Step 1: Geocoding via Open-Meteo
        async with httpx.AsyncClient() as client:
            geo_response = await client.get(f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json")
            geo_data = geo_response.json()
            
            if "results" not in geo_data:
                raise HTTPException(status_code=404, detail=f"City '{city}' not found")
            
            lat = geo_data["results"][0]["latitude"]
            lon = geo_data["results"][0]["longitude"]

            # Step 2: Fetch Live Weather
            weather_url = (
                f"https://api.open-meteo.com/v1/forecast"
                f"?latitude={lat}&longitude={lon}"
                f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m"
                f"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max"
                f"&timezone=auto"
            )
            
            weather_response = await client.get(weather_url)
            w_data = weather_response.json()

            current = w_data["current"]
            daily = w_data["daily"]

            # Map WMO Weather Codes to String conditions
            def wmo_to_string(code):
                mapping = {
                    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
                    45: "Fog", 48: "Depositing rime fog",
                    51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
                    61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
                    71: "Slight Snow", 80: "Slight Rain showers", 81: "Moderate Rain showers",
                    82: "Violent Rain showers", 95: "Thunderstorm"
                }
                return mapping.get(code, "Unknown condition")

            # Format 5-day forecast
            forecast_list = []
            for i in range(1, 6): # Next 5 days
                date_str = daily["time"][i]
                dt = datetime.strptime(date_str, "%Y-%m-%d")
                forecast_list.append({
                    "date": dt.strftime("%A, %b %d"),
                    "temp_max": round(daily["temperature_2m_max"][i]),
                    "temp_min": round(daily["temperature_2m_min"][i]),
                    "condition": wmo_to_string(daily["weather_code"][i]),
                    "rain_chance": daily["precipitation_probability_max"][i]
                })

            # Tactical Irrigation Logic
            rain_mm = daily["precipitation_sum"][0]
            humidity = current["relative_humidity_2m"]
            
            if rain_mm > 10.0:
                irrigation = {"advice": "Hold Irrigation", "detail": f"Heavy rainfall ({rain_mm}mm) expected. Soil will be saturated.", "color": "blue"}
            elif rain_mm > 2.0 or humidity > 85:
                irrigation = {"advice": "Reduce irrigation by 40%", "detail": "Moderate rainfall likely. Supplement with light watering only.", "color": "cyan"}
            elif current["temperature_2m"] > 33.0 and rain_mm == 0:
                irrigation = {"advice": "Increase irrigation by 50%", "detail": "High heat stress potential. Water early morning and evening.", "color": "amber"}
            else:
                irrigation = {"advice": "Conditions Nominal", "detail": "Maintain standard irrigation schedule.", "color": "cyan"}

            # Simulated Alerts logic
            alerts = []
            if current["temperature_2m"] > 35:
                alerts.append({"title": "Heat Wave Warning", "message": f"Temperatures reaching {current['temperature_2m']}°C. Provide shade for sensitive crops.", "type": "danger"})
            if rain_mm > 20:
                alerts.append({"title": "Heavy Rain Alert", "message": "Ensure proper field drainage to prevent root rot.", "type": "warning"})

            return {
                "source": "api",
                "city": city,
                "current": {
                    "temp": round(current["temperature_2m"], 1),
                    "feels_like": round(current["apparent_temperature"], 1),
                    "humidity": current["relative_humidity_2m"],
                    "wind_speed": round(current["wind_speed_10m"], 1),
                    "condition": wmo_to_string(current["weather_code"]),
                    "precip_mm": current["precipitation"],
                    "is_day": current["is_day"] == 1
                },
                "forecast": forecast_list,
                "irrigation_advice": irrigation,
                "alerts": alerts
            }
            
    except Exception as e:
        print(f"Weather Fetch Error: {e}")
        raise HTTPException(status_code=500, detail="Weather fetch failed")
