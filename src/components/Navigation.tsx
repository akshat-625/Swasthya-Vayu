import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wind, MapPin, Loader2, Cigarette, Clock, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

type AqiData = {
  city: string;
  aqi: number;
  pm2_5?: number;
  pm10?: number;
  main?: string;
  note?: string;
};

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showAQIDialog, setShowAQIDialog] = useState(false);
  const [aqiData, setAqiData] = useState<AqiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCheckAQI = async () => {
    setShowAQIDialog(true);
    setLoading(true);
    setError(null);
    setAqiData(null);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const geoResponse = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            
            const detectedCity = geoResponse.data.address.city || 
                                geoResponse.data.address.town || 
                                geoResponse.data.address.village || 
                                "Mumbai";
            
            const aqiResponse = await axios.get(`/api/aqi`, { params: { city: detectedCity } });
            setAqiData(aqiResponse.data);
          } catch (err: any) {
            setError(err?.response?.data?.error || "Failed to fetch AQI data");
          } finally {
            setLoading(false);
          }
        },
        async (err) => {
          console.error("Geolocation error:", err);
          try {
            const aqiResponse = await axios.get(`/api/aqi`, { params: { city: "Mumbai" } });
            setAqiData(aqiResponse.data);
          } catch (err: any) {
            setError("Failed to fetch AQI data");
          } finally {
            setLoading(false);
          }
        }
      );
    } else {
      try {
        const aqiResponse = await axios.get(`/api/aqi`, { params: { city: "Mumbai" } });
        setAqiData(aqiResponse.data);
      } catch (err: any) {
        setError("Failed to fetch AQI data");
      } finally {
        setLoading(false);
      }
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "bg-green-100 border-green-500 text-green-900";
    if (aqi <= 100) return "bg-yellow-100 border-yellow-500 text-yellow-900";
    if (aqi <= 150) return "bg-orange-100 border-orange-500 text-orange-900";
    if (aqi <= 200) return "bg-red-100 border-red-500 text-red-900";
    if (aqi <= 300) return "bg-purple-100 border-purple-500 text-purple-900";
    return "bg-rose-100 border-rose-500 text-rose-900";
  };

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const calculateCigarettes = (pm25: number) => {
    return Math.round(pm25 / 22 * 10) / 10;
  };

  const calculateMinutesLost = (aqi: number) => {
    if (aqi <= 50) return 0;
    if (aqi <= 100) return Math.round((aqi - 50) * 0.5);
    if (aqi <= 150) return Math.round(25 + (aqi - 100) * 1);
    if (aqi <= 200) return Math.round(75 + (aqi - 150) * 2);
    return Math.round(175 + (aqi - 200) * 3);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <Wind className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Swasthya Vayu
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Home
          </Link>
          <Link 
            to="/aqi" 
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Live AQI
          </Link>
          <Link 
            to="/how-it-works" 
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            How It Works
          </Link>
          <Link 
            to="/join-movement" 
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Join Movement
          </Link>
          <Link 
            to="/climate-action" 
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Climate Action
          </Link>
          <Link 
            to="/about" 
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Contact
          </Link>
          <Link 
            to="/settings" 
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Settings
          </Link>
          <Button variant="hero" size="sm" onClick={handleCheckAQI}>
            Check AQI
          </Button>
        </div>
      </div>

      {/* AQI Popup Dialog */}
      <Dialog open={showAQIDialog} onOpenChange={setShowAQIDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Wind className="h-6 w-6 text-primary" />
              Current Air Quality
            </DialogTitle>
            <DialogDescription>
              Real-time air quality data for your location
            </DialogDescription>
          </DialogHeader>

          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Detecting your location and fetching AQI...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="h-5 w-5 inline mr-2" />
              {error}
            </div>
          )}

          {!loading && aqiData && (
            <div className="space-y-4">
              <Card className={`border-2 ${getAQIColor(aqiData.aqi)}`}>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <MapPin className="h-5 w-5" />
                      <h3 className="text-xl font-bold">{aqiData.city}</h3>
                    </div>
                    <p className="text-lg font-semibold mb-4">{getAQILabel(aqiData.aqi)}</p>
                    <div className="text-6xl font-bold mb-2">{aqiData.aqi}</div>
                    <div className="text-sm text-gray-600">Air Quality Index</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                    <div className="text-center p-3 bg-white/50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">PM2.5</div>
                      <div className="text-lg font-semibold">{aqiData.pm2_5 ?? "N/A"}</div>
                      <div className="text-xs text-gray-500">μg/m³</div>
                    </div>
                    <div className="text-center p-3 bg-white/50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">PM10</div>
                      <div className="text-lg font-semibold">{aqiData.pm10 ?? "N/A"}</div>
                      <div className="text-xs text-gray-500">μg/m³</div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <Cigarette className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-700">Cigarette Equivalent</p>
                        <p className="text-lg font-bold text-red-600">
                          {calculateCigarettes(aqiData.pm2_5 || aqiData.aqi * 0.5)} per day
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <Clock className="h-5 w-5 text-orange-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-700">Life Expectancy Impact</p>
                        <p className="text-lg font-bold text-orange-600">
                          -{calculateMinutesLost(aqiData.aqi)} min/day
                        </p>
                      </div>
                    </div>
                  </div>

                  {aqiData.main && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs font-semibold text-gray-700">Main Pollutant</p>
                      <p className="text-sm font-bold text-blue-600">{aqiData.main}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Link to="/aqi" onClick={() => setShowAQIDialog(false)} className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    View Detailed Analysis
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navigation;
