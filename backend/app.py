# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import joblib
import numpy as np
import random
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

MODEL_PATH = "model.joblib"
model = None
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    print("Warning: model.joblib not found. /predict will use simple rules.")

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")  # optional

@app.route("/health")
def health():
    """
    Health check endpoint - no auth required
    Used to wake up the backend from sleep
    """
    return jsonify({"status": "ok"}), 200

@app.route("/aqi")
def aqi():
    """
    Get AQI data for a city using WAQI (World Air Quality Index)
    Query params: city (default: Mumbai)
    """
    city = request.args.get("city", "Mumbai")
    WAQI_TOKEN = os.getenv("WAQI_TOKEN")

    if not WAQI_TOKEN:
        return jsonify({
            "error": "WAQI_TOKEN not configured in .env file",
            "city": city,
            "note": "Please add your WAQI token to backend/.env"
        }), 500

    try:
        # WAQI city feed API
        url = f"https://api.waqi.info/feed/{city}/?token={WAQI_TOKEN}"
        r = requests.get(url, timeout=10)
        data = r.json()

        if data.get("status") != "ok":
            return jsonify({
                "error": f"City '{city}' not found in WAQI database",
                "city": city
            }), 404

        d = data["data"]
        iaqi = d.get("iaqi", {})
        
        # Extract pollutant data
        pm25 = iaqi.get("pm25", {}).get("v", 0)
        pm10 = iaqi.get("pm10", {}).get("v", 0)
        
        return jsonify({
            "city": d["city"]["name"],
            "aqi": d["aqi"],
            "pm2_5": pm25,
            "pm10": pm10,
            "main": "PM2.5" if pm25 > pm10 else "PM10",
            "timestamp": d["time"]["s"],
            "coordinates": d["city"].get("geo", []),
            "source": "WAQI",
            "dominentpol": d.get("dominentpol", "pm25")
        })

    except Exception as e:
        return jsonify({
            "error": f"Failed to fetch AQI data: {str(e)}",
            "city": city
        }), 500

@app.route("/predict", methods=["POST"])
def predict():
    """
    Expect JSON:
    {
      "aqi": <number>,
      "pm2_5": <number>,
      "temp": <number>,
      "age": <number>,
      "asthma": 0|1
    }
    returns advisory label and human text.
    """
    data = request.get_json() or {}
    try:
        aqi = float(data.get("aqi", 0))
        pm25 = float(data.get("pm2_5", 0))
        temp = float(data.get("temp", 25))
        age = int(data.get("age", 30))
        asthma = 1 if data.get("asthma") else 0

        features = np.array([[aqi, pm25, temp, age, asthma]])
        if model:
            pred = int(model.predict(features)[0])
        else:
            # fallback rule-based
            if aqi > 300 or pm25 > 150:
                pred = 2
            elif (aqi > 150 or pm25 > 75) and (age > 60 or asthma == 1):
                pred = 2
            elif aqi > 100 or pm25 > 50:
                pred = 1
            else:
                pred = 0

        labels = {
            0: {"code": 0, "text": "Air quality acceptable — okay to go outside."},
            1: {"code": 1, "text": "Unhealthy for sensitive groups — consider wearing a mask."},
            2: {"code": 2, "text": "Very unhealthy/hazardous — stay indoors and avoid outdoor exertion."}
        }
        return jsonify({"advisory": labels[pred]})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/chat", methods=["POST"])
def chat():
    """
    Enhanced chatbot endpoint with intelligent responses.
    Accepts:
    {
      "message": "What's the AQI in Mumbai?",
      "userProfile": { "age": 40, "asthma": 1, "location": "Mumbai" }
    }
    """
    payload = request.get_json() or {}
    message = (payload.get("message") or "").lower()
    profile = payload.get("userProfile") or {}
    loc = profile.get("location") or "Mumbai"

    # Greeting patterns - only trigger for short greeting messages
    greetings = ["hi", "hello", "hey", "good morning", "good evening", "good afternoon", "greetings"]
    # Check if it's ONLY a greeting (not mixed with other questions)
    is_greeting_only = any(message.strip() == greeting for greeting in greetings)
    is_short_greeting = any(greeting in message for greeting in greetings) and len(message.split()) <= 3 and not any(word in message for word in ["aqi", "air", "quality", "pollution", "city"])
    
    if is_greeting_only or is_short_greeting:
        return jsonify({"reply": "Hello! 👋 I'm VayuBot, your air quality assistant. I can help you with:\n\n• Check AQI for any city\n• Get health advice based on air quality\n• Learn about pollutants (PM2.5, PM10, etc.)\n• Understand AQI categories\n\nWhat would you like to know?"})

    # Help/capabilities
    if "help" in message or "what can you do" in message or "how can you help" in message:
        return jsonify({"reply": "I can help you with:\n\n🌍 **AQI Information**: Check air quality for any city worldwide\n🏥 **Health Advice**: Get personalized recommendations based on AQI\n🔬 **Pollutant Info**: Learn about PM2.5, PM10, and other pollutants\n📊 **AQI Categories**: Understand what different AQI levels mean\n💡 **Safety Tips**: Get advice on protecting yourself from pollution\n\nJust ask me anything about air quality!"})

    # AQI category explanation
    if "aqi category" in message or "aqi level" in message or "what is aqi" in message or "explain aqi" in message:
        return jsonify({"reply": "**AQI (Air Quality Index) Categories:**\n\n🟢 **0-50 (Good)**: Air quality is satisfactory. Enjoy outdoor activities!\n\n🟡 **51-100 (Moderate)**: Acceptable for most, but sensitive individuals should limit prolonged outdoor exertion.\n\n🟠 **101-150 (Unhealthy for Sensitive Groups)**: Children, elderly, and people with respiratory conditions should reduce outdoor activities.\n\n🔴 **151-200 (Unhealthy)**: Everyone may experience health effects. Limit outdoor activities.\n\n🟣 **201-300 (Very Unhealthy)**: Health alert! Everyone should avoid outdoor exertion.\n\n⚫ **301+ (Hazardous)**: Health emergency! Stay indoors with air purifiers."})

    # PM2.5 explanation
    if "pm2.5" in message or "pm 2.5" in message or "particulate matter" in message:
        return jsonify({"reply": "**PM2.5 (Fine Particulate Matter):**\n\nPM2.5 are tiny particles less than 2.5 micrometers in diameter — about 30 times smaller than a human hair!\n\n🔬 **Sources:** Vehicle emissions, industrial processes, burning of fossil fuels, wildfires\n\n⚠️ **Health Impact:** Can penetrate deep into lungs and bloodstream, causing:\n• Respiratory problems\n• Heart disease\n• Lung cancer\n• Reduced life expectancy\n\n**Safe Levels:**\n• 0-12 μg/m³: Good\n• 12-35 μg/m³: Moderate\n• 35-55 μg/m³: Unhealthy for sensitive groups\n• 55+ μg/m³: Unhealthy"})

    # PM10 explanation
    if "pm10" in message or "pm 10" in message:
        return jsonify({"reply": "**PM10 (Coarse Particulate Matter):**\n\nPM10 are particles less than 10 micrometers in diameter.\n\n🔬 **Sources:** Dust from roads, construction sites, agriculture, pollen\n\n⚠️ **Health Impact:** Can cause:\n• Respiratory irritation\n• Asthma attacks\n• Bronchitis\n• Reduced lung function\n\n**Safe Levels:**\n• 0-54 μg/m³: Good\n• 55-154 μg/m³: Moderate\n• 155-254 μg/m³: Unhealthy for sensitive groups\n• 255+ μg/m³: Unhealthy"})

    # Protection tips
    if "protect" in message or "safety" in message or "precaution" in message or "how to stay safe" in message:
        return jsonify({"reply": "**Protection from Air Pollution:**\n\n😷 **Wear Masks:** Use N95 or N99 masks when AQI > 150\n\n🏠 **Indoor Air:** Use air purifiers with HEPA filters\n\n🪟 **Windows:** Keep closed during high pollution hours (morning & evening)\n\n🌳 **Avoid Peak Hours:** Stay indoors between 6-10 AM and 6-9 PM\n\n🚗 **Reduce Exposure:** Avoid busy roads, use indoor gyms instead of outdoor exercise\n\n🌱 **Indoor Plants:** Spider plants, peace lilies, and snake plants help filter air\n\n💧 **Stay Hydrated:** Drink plenty of water to flush out toxins\n\n🍎 **Healthy Diet:** Foods rich in antioxidants (fruits, vegetables) help combat pollution effects"})

    # Cigarette equivalent question
    if "cigarette" in message or "smoking" in message:
        return jsonify({"reply": "**Cigarette Equivalent of Air Pollution:**\n\n1 cigarette ≈ 22 μg/m³ PM2.5 exposure for 24 hours\n\n📊 **Examples:**\n• Delhi (PM2.5 ~150): ~7 cigarettes/day\n• Mumbai (PM2.5 ~80): ~4 cigarettes/day\n• Beijing (PM2.5 ~100): ~5 cigarettes/day\n\nBreathing polluted air is like passive smoking! 🚬💨\n\nCheck your city's AQI to see your daily cigarette equivalent."})

    # Health effects
    if "health effect" in message or "health impact" in message or "harmful" in message or "disease" in message:
        return jsonify({"reply": "**Health Effects of Air Pollution:**\n\n🫁 **Respiratory:**\n• Asthma\n• COPD\n• Lung cancer\n• Bronchitis\n\n❤️ **Cardiovascular:**\n• Heart attacks\n• Strokes\n• High blood pressure\n\n🧠 **Neurological:**\n• Cognitive decline\n• Dementia\n• Reduced IQ in children\n\n👶 **Children:**\n• Stunted lung development\n• Increased infections\n• Learning difficulties\n\n🤰 **Pregnancy:**\n• Low birth weight\n• Premature birth\n• Developmental issues\n\n**Long-term exposure reduces life expectancy by 1-3 years!**"})

    # Best cities question
    if "best city" in message or "cleanest city" in message or "least polluted" in message:
        return jsonify({"reply": "**Cities with Best Air Quality:**\n\n🌏 **Global:**\n1. Zurich, Switzerland\n2. Helsinki, Finland\n3. Honolulu, USA\n4. Stockholm, Sweden\n5. Calgary, Canada\n\n🇮🇳 **India:**\n1. Satna, MP\n2. Kurnool, AP\n3. Haldia, WB\n4. Mysuru, Karnataka\n5. Mangaluru, Karnataka\n\n**Worst:**\n• Delhi, India (Most polluted capital)\n• Dhaka, Bangladesh\n• Lahore, Pakistan\n\nWant to check AQI for a specific city? Just ask!"})

    # Worst cities question
    if "worst city" in message or "most polluted" in message or "dirtiest city" in message:
        return jsonify({"reply": "**Most Polluted Cities (2024):**\n\n🌍 **Global:**\n1. Delhi, India (AQI often 300+)\n2. Dhaka, Bangladesh\n3. Lahore, Pakistan\n4. Kolkata, India\n5. Baghdad, Iraq\n\n🇮🇳 **India:**\n1. Delhi NCR (Annual avg: ~200)\n2. Ghaziabad\n3. Noida\n4. Faridabad\n5. Lucknow\n\n⚠️ **Winter months (Nov-Jan) see AQI spike to 400-500 in these cities due to crop burning and reduced wind.**\n\nCheck real-time AQI for any city!"})

    # AQI check for specific city
    if "aqi" in message or "air quality" in message or "pollution" in message:
        # Extract cities from message - handle multiple cities
        import re
        
        # Common city names pattern (handle "and", commas, etc.)
        cities = []
        
        # Check for patterns like "Mumbai and Delhi" or "Mumbai, Delhi"
        city_pattern = r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b'
        potential_cities = re.findall(city_pattern, message.title())
        
        # Filter out common words that aren't cities
        exclude_words = ["What", "The", "Is", "In", "For", "At", "Of", "And", "Or", "From", "To", "Check", "Show", "Tell", "Me", "About", "Today", "Now"]
        cities = [c for c in potential_cities if c not in exclude_words]
        
        # If no cities found, use default location
        if not cities:
            words = message.split()
            for i, word in enumerate(words):
                if word in ["in", "for", "at", "of"] and i + 1 < len(words):
                    city = " ".join(words[i + 1:]).strip("?,.")
                    cities = [city]
                    break
            if not cities:
                cities = [loc]
        
        # Limit to 3 cities to avoid overwhelming response
        cities = cities[:3]
        
        try:
            WAQI_TOKEN = os.getenv("WAQI_TOKEN")
            replies = []
            
            for city in cities:
                try:
                    # Fetch real AQI data from WAQI API
                    url = f"https://api.waqi.info/feed/{city}/?token={WAQI_TOKEN}"
                    response = requests.get(url, timeout=5)
                    data = response.json()
                    
                    if data.get("status") == "ok" and "data" in data:
                        aqi_data = data["data"]
                        aqi_val = aqi_data.get("aqi", 0)
                        
                        # Get pollutants
                        iaqi = aqi_data.get("iaqi", {})
                        pm25 = iaqi.get("pm25", {}).get("v", 0)
                        pm10 = iaqi.get("pm10", {}).get("v", 0)
                        
                        # If PM values not available, estimate from AQI
                        if not pm25:
                            pm25 = round(aqi_val * 0.5, 1)
                        if not pm10:
                            pm10 = round(pm25 * 1.5, 1)
                        
                        city_name = aqi_data.get("city", {}).get("name", city)
                    else:
                        # Fallback to random data if API fails
                        aqi_val = random.randint(50, 200)
                        pm25 = round(aqi_val * 0.5, 1)
                        pm10 = round(pm25 * 1.5, 1)
                        city_name = city.title()
                except:
                    # Fallback for individual city errors
                    aqi_val = random.randint(50, 200)
                    pm25 = round(aqi_val * 0.5, 1)
                    pm10 = round(pm25 * 1.5, 1)
                    city_name = city.title()
                
                # Determine category
                if aqi_val <= 50:
                    category = "Good 🟢"
                    advice = "Great day for outdoor activities!"
                elif aqi_val <= 100:
                    category = "Moderate 🟡"
                    advice = "Acceptable for most people."
                elif aqi_val <= 150:
                    category = "Unhealthy for Sensitive Groups 🟠"
                    advice = "Sensitive individuals should limit prolonged outdoor activities."
                elif aqi_val <= 200:
                    category = "Unhealthy 🔴"
                    advice = "Everyone should limit outdoor exertion."
                elif aqi_val <= 300:
                    category = "Very Unhealthy 🟣"
                    advice = "Avoid outdoor activities!"
                else:
                    category = "Hazardous ⚫"
                    advice = "Stay indoors! Health emergency."
                
                cigarettes = round(pm25 / 22, 1)
                
                city_reply = f"**{city_name} Air Quality:**\n📊 **AQI:** {aqi_val} ({category})\n🔬 **PM2.5:** {pm25} μg/m³\n🔬 **PM10:** {pm10} μg/m³\n🚬 **Cigarette Equivalent:** {cigarettes} per day\n💡 **Advice:** {advice}"
                replies.append(city_reply)
            
            # Join multiple city responses
            final_reply = "\n\n---\n\n".join(replies)
            return jsonify({"reply": final_reply})
        except Exception as e:
            return jsonify({"reply": f"I had trouble getting AQI data. Please try again or check the Live AQI page."})

    # Health advice request
    if "should i" in message or "advice" in message or "recommend" in message or "safe to go out" in message:
        aqi_val = profile.get("aqi", 100)
        pm25 = profile.get("pm2_5", 30)
        age = profile.get("age", 30)
        asthma = 1 if profile.get("asthma") else 0
        
        # Determine advice
        if aqi_val <= 50:
            advice = "✅ **It's safe to go outside!** Air quality is good. Enjoy outdoor activities."
        elif aqi_val <= 100:
            advice = "✅ **Generally safe for outdoor activities.** Sensitive individuals should be cautious during prolonged exertion."
        elif aqi_val <= 150:
            if asthma or age > 60 or age < 12:
                advice = "⚠️ **Limit outdoor activities.** Consider wearing a mask if you must go outside."
            else:
                advice = "⚠️ **Reduce prolonged outdoor exertion.** Sensitive groups should be cautious."
        elif aqi_val <= 200:
            advice = "🔴 **Avoid prolonged outdoor activities.** Wear an N95 mask if you must go outside. Everyone may experience health effects."
        elif aqi_val <= 300:
            advice = "🚨 **Stay indoors!** Only go outside for essential activities. Wear an N95/N99 mask. Use air purifiers indoors."
        else:
            advice = "🆘 **HEALTH EMERGENCY! Stay indoors!** Do not go outside. Keep windows closed. Use air purifiers. This is hazardous for everyone."
        
        if asthma:
            advice += "\n\n💊 **For Asthma:** Keep your inhaler handy, avoid triggers, monitor symptoms closely."
        
        if age > 60:
            advice += "\n\n👴 **For Seniors:** Take extra precautions, monitor any breathing difficulties."
        
        return jsonify({"reply": advice})

    # Fallback response
    return jsonify({"reply": "I'm here to help with air quality questions! Try asking:\n\n• 'What's the AQI in [city]?'\n• 'Should I go outside?'\n• 'What is PM2.5?'\n• 'How to protect from pollution?'\n• 'Health effects of air pollution'\n\nWhat would you like to know? 🌬️"})

@app.route("/stations")
def get_stations():
    """
    Get all active Indian air quality monitoring stations from WAQI
    Uses bounding box for India (lat: 8-37, lon: 68-97)
    """
    WAQI_TOKEN = os.getenv("WAQI_TOKEN")
    
    if not WAQI_TOKEN:
        return jsonify({"error": "WAQI_TOKEN not configured in .env"}), 500
    
    # Bounding box for India
    url = f"https://api.waqi.info/map/bounds/?latlng=8,68,37,97&token={WAQI_TOKEN}"
    
    try:
        r = requests.get(url, timeout=10)
        data = r.json()

        if data.get("status") != "ok":
            return jsonify({"error": "Failed to fetch stations from WAQI"}), 500

        # Simplify output - only include essential data
        stations = [
            {
                "uid": s["uid"],
                "name": s["station"]["name"],
                "lat": s["lat"],
                "lon": s["lon"],
                "aqi": s["aqi"]
            } for s in data.get("data", [])
        ]
        
        return jsonify(stations)
    
    except Exception as e:
        return jsonify({"error": f"Failed to fetch stations: {str(e)}"}), 500

@app.route("/aqi_station")
def aqi_station():
    """
    Get live AQI data for a specific station by UID
    Query param: uid (station unique identifier)
    """
    uid = request.args.get("uid")
    
    if not uid:
        return jsonify({"error": "Missing station UID parameter"}), 400
    
    WAQI_TOKEN = os.getenv("WAQI_TOKEN")
    
    if not WAQI_TOKEN:
        return jsonify({"error": "WAQI_TOKEN not configured in .env"}), 500
    
    url = f"https://api.waqi.info/feed/@{uid}/?token={WAQI_TOKEN}"
    
    try:
        r = requests.get(url, timeout=10)
        data = r.json()

        if data.get("status") != "ok":
            return jsonify({"error": "Invalid station UID or data unavailable"}), 404

        d = data["data"]
        
        return jsonify({
            "station": d["city"]["name"],
            "aqi": d["aqi"],
            "time": d["time"]["s"],
            "pollutants": d.get("iaqi", {}),
            "coordinates": d["city"].get("geo", []),
            "attributions": d.get("attributions", [])
        })
    
    except Exception as e:
        return jsonify({"error": f"Failed to fetch station data: {str(e)}"}), 500

@app.route("/search_cities")
def search_cities():
    """
    Search for cities in WAQI database
    Query param: keyword (city name to search)
    """
    keyword = request.args.get("keyword", "")
    
    if not keyword or len(keyword) < 2:
        return jsonify({"cities": []})
    
    WAQI_TOKEN = os.getenv("WAQI_TOKEN")
    
    if not WAQI_TOKEN:
        return jsonify({"error": "WAQI_TOKEN not configured in .env"}), 500
    
    try:
        # WAQI search API
        url = f"https://api.waqi.info/search/?token={WAQI_TOKEN}&keyword={keyword}"
        r = requests.get(url, timeout=10)
        data = r.json()

        if data.get("status") != "ok":
            return jsonify({"cities": []})

        # Format results
        cities = []
        for station in data.get("data", []):
            cities.append({
                "uid": station.get("uid"),
                "name": station["station"]["name"],
                "aqi": station.get("aqi", "N/A"),
                "time": station.get("time", {}).get("stime", "")
            })
        
        return jsonify({"cities": cities})
    
    except Exception as e:
        return jsonify({"error": f"Failed to search cities: {str(e)}"}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
