# Swasthya Vayu - Air Quality Intelligence Platform

A comprehensive air quality monitoring and health advisory platform with real-time AQI tracking, personalized health recommendations, and AI-powered chatbot assistance.

## 🌟 Features

- **Real-time AQI Monitoring** - Track air quality across Indian cities
- **VayuBot AI Assistant** - Chat with AI for AQI queries and health advice
- **Station-wise AQI Data** - View multiple monitoring stations in any city
- **Health Profiles** - Personalized recommendations based on health conditions
- **Climate Action Initiatives** - UN SDG aligned environmental goals
- **Join the Movement** - Community engagement for cleaner air

## 🚀 Live Demo

- **Frontend:** [https://swasthya-vayu-ipmvuhl21-akshat-jhanwars-projects.vercel.app](https://swasthya-vayu-ipmvuhl21-akshat-jhanwars-projects.vercel.app)
- **Backend API:** [https://swasthya-vayu-backend.onrender.com](https://swasthya-vayu-backend.onrender.com)

## 🛠️ Tech Stack

**Frontend:**
- React 18.3.1 + TypeScript
- Vite 5.4.19
- Tailwind CSS + Shadcn UI
- React Router DOM
- Axios

**Backend:**
- Flask 3.1.2 (Python)
- Gunicorn
- Scikit-learn (ML models)
- WAQI API integration

**Database:**
- Supabase (PostgreSQL)

**Deployment:**
- Vercel (Frontend)
- Render (Backend)

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/akshat-625/Swasthya-Vayu.git
cd Swasthya-Vayu

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your Supabase credentials

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\Activate.ps1

# Activate virtual environment (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train ML model
python train_model.py

# Start Flask server
python app.py
```

## 🔑 Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (backend/.env)
```env
WAQI_TOKEN=your_waqi_api_token
```

## 🌐 API Endpoints

- `GET /aqi?city=CityName` - Get AQI data for a city
- `POST /predict` - ML-based health advisory
- `POST /chat` - VayuBot chatbot
- `GET /search-city?query=city` - Search for cities

## 📱 Pages

- `/` - Home with hero section
- `/aqi` - Live AQI tracking
- `/station-aqi` - Station-wise data
- `/vayubot` - AI chatbot
- `/how-it-works` - Platform explanation
- `/join-movement` - Community signup
- `/climate-action` - Environmental initiatives
- `/about` - About the project
- `/contact` - Contact form
- `/settings` - User profile & preferences

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Akshat Jhanwar**
- GitHub: [@akshat-625](https://github.com/akshat-625)

## 🙏 Acknowledgments

- World Air Quality Index (WAQI) for AQI data
- Supabase for database hosting
- Shadcn UI for beautiful components
- Vercel & Render for hosting

---

**Built with ❤️ for cleaner air and healthier communities**
