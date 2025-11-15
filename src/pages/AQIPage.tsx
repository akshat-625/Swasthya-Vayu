import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, Cigarette, Clock, AlertCircle, Activity } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Footer from "@/components/Footer";

type AqiResponse = {
  city: string;
  aqi: number;
  pm2_5?: number;
  pm10?: number;
  main?: string;
  note?: string;
};

type HealthPrediction = {
  advisory: {
    code: number;
    text: string;
  };
};

const AQIPage = () => {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AqiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoDetecting, setAutoDetecting] = useState(false);
  
  // City autocomplete
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingCities, setSearchingCities] = useState(false);
  
  // Health prediction form
  const [age, setAge] = useState("30");
  const [hasAsthma, setHasAsthma] = useState(false);
  const [prediction, setPrediction] = useState<HealthPrediction | null>(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    detectLocationAndFetchAQI();
  }, []);

  // Search for cities as user types
  useEffect(() => {
    const searchCities = async () => {
      if (city.length < 2) {
        setCitySuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSearchingCities(true);
      try {
        const response = await axios.get(`https://swasthya-vayu-backend.onrender.com/search_cities?keyword=${encodeURIComponent(city)}`);
        if (response.data.cities) {
          setCitySuggestions(response.data.cities.slice(0, 8)); // Show max 8 suggestions
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("City search error:", err);
      } finally {
        setSearchingCities(false);
      }
    };

    const debounceTimer = setTimeout(searchCities, 300);
    return () => clearTimeout(debounceTimer);
  }, [city]);

  async function detectLocationAndFetchAQI() {
    setAutoDetecting(true);
    setError(null);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            
            const detectedCity = response.data.address.city || 
                                response.data.address.town || 
                                response.data.address.village || 
                                "Mumbai";
            
            setCity(detectedCity);
            await fetchAQI(detectedCity);
          } catch (err) {
            console.error("Geocoding error:", err);
            setCity("Mumbai");
            await fetchAQI("Mumbai");
          } finally {
            setAutoDetecting(false);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          setCity("Mumbai");
          fetchAQI("Mumbai");
          setAutoDetecting(false);
        }
      );
    } else {
      setCity("Mumbai");
      fetchAQI("Mumbai");
      setAutoDetecting(false);
    }
  }

  function selectCity(cityName: string) {
    setCity(cityName);
    setShowSuggestions(false);
    setCitySuggestions([]); // Clear suggestions immediately
    fetchAQI(cityName);
  }

  async function fetchAQI(cityName?: string) {
    const targetCity = cityName || city;
    if (!targetCity) return;
    
    setLoading(true);
    setError(null);
    setData(null);
    setPrediction(null);
    try {
      const res = await axios.get(`https://swasthya-vayu-backend.onrender.com/aqi`, { params: { city: targetCity } });
      setData(res.data);
      // Auto-fetch health prediction when AQI data is loaded
      if (res.data) {
        await fetchHealthPrediction(res.data);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Failed to fetch AQI");
    } finally {
      setLoading(false);
    }
  }

  async function fetchHealthPrediction(aqiData?: AqiResponse) {
    const targetData = aqiData || data;
    if (!targetData) return;

    setPredicting(true);
    try {
      // Get enhanced health advisory from the AQI data itself
      if (targetData.healthAdvice && targetData.healthAdvice.general) {
        // Use the enhanced advisory data from backend
        const userAge = parseInt(age) || 30;
        let personalizedAdvice = targetData.healthAdvice.general;
        let precautions = targetData.healthAdvice.precautions || [];
        
        // Add personalized recommendations based on user profile
        const savedProfile = localStorage.getItem("vayu_profile");
        if (savedProfile) {
          try {
            const profile = JSON.parse(savedProfile);
            const additionalAdvice = [];
            
            if (targetData.aqi > 100) {
              if (hasAsthma || profile.healthConditions?.asthma || profile.healthConditions?.lungDisease) {
                additionalAdvice.push("🫁 Keep your inhaler handy at all times");
                additionalAdvice.push("🚫 Avoid all outdoor activities");
              }
              if (profile.healthConditions?.smoker && targetData.aqi > 150) {
                additionalAdvice.push("🚬 URGENT: Your smoking + pollution is highly dangerous");
              }
              if (profile.healthConditions?.allergies && targetData.aqi > 100) {
                additionalAdvice.push("🤧 Take allergy medication preventively");
              }
              if (userAge < 12 || userAge > 60) {
                additionalAdvice.push("👨‍👩‍👧 Extra precautions needed for your age group");
              }
              if (profile.activityLevel === "high" && targetData.aqi > 100) {
                additionalAdvice.push("🏃 Switch to indoor exercise today");
              }
            }
            
            if (additionalAdvice.length > 0) {
              precautions = [...precautions, ...additionalAdvice];
            }
          } catch (e) {
            console.error("Error parsing profile:", e);
          }
        }
        
        setPrediction({
          advisory: {
            code: targetData.aqi <= 100 ? 0 : targetData.aqi <= 150 ? 1 : 2,
            text: personalizedAdvice,
            precautions: precautions,
            emoji: targetData.healthAdvice.emoji || ""
          }
        });
      } else {
        // Fallback to old predict endpoint if needed
        const res = await axios.post(`https://swasthya-vayu-backend.onrender.com/predict`, {
          aqi: targetData.aqi,
          pm2_5: targetData.pm2_5 || targetData.aqi * 0.5,
          temp: 25,
          age: parseInt(age) || 30,
          asthma: hasAsthma ? 1 : 0,
        });
        setPrediction(res.data);
      }
    } catch (err: any) {
      console.error("Prediction error:", err);
    } finally {
      setPredicting(false);
    }
  }

  const calculateCigarettes = (pm25: number) => {
    // 1 cigarette ≈ 22 µg/m³ PM2.5
    return Math.round(pm25 / 22 * 10) / 10;
  };

  const calculateMinutesLost = (aqi: number) => {
    // Rough estimate: higher AQI = more life minutes lost per day
    if (aqi <= 50) return 0;
    if (aqi <= 100) return Math.round((aqi - 50) * 0.5);
    if (aqi <= 150) return Math.round(25 + (aqi - 100) * 1);
    if (aqi <= 200) return Math.round(75 + (aqi - 150) * 2);
    return Math.round(175 + (aqi - 200) * 3);
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

  const getAdvisoryColor = (code: number) => {
    if (code === 0) return "bg-green-100 border-green-500 text-green-900";
    if (code === 1) return "bg-orange-100 border-orange-500 text-orange-900";
    return "bg-red-100 border-red-500 text-red-900";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Live Air Quality Monitor
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {autoDetecting ? "Detecting your location..." : "Real-time air quality data with personalized health insights"}
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Check Air Quality
              </CardTitle>
              <CardDescription>
                Search for any city or use detected location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4 relative">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      // Only show suggestions if user is typing (length > 0)
                      if (e.target.value.length > 0) {
                        setShowSuggestions(true);
                      } else {
                        setShowSuggestions(false);
                      }
                    }}
                    placeholder="Enter city (e.g., Mumbai, Delhi, Bangalore)"
                    className="w-full"
                    onFocus={() => {
                      // Only show suggestions on focus if there are suggestions AND user is typing
                      if (citySuggestions.length > 0 && city.length > 1) {
                        setShowSuggestions(true);
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && city.trim()) {
                        setShowSuggestions(false);
                        setCitySuggestions([]);
                        fetchAQI();
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  {searchingCities && (
                    <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3 text-gray-400" />
                  )}
                  
                  {/* City Suggestions Dropdown */}
                  {showSuggestions && citySuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      {citySuggestions.map((suggestion, index) => (
                        <button
                          key={suggestion.uid || index}
                          onClick={() => selectCity(suggestion.name)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {suggestion.name}
                              </div>
                              {suggestion.time && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Last updated: {suggestion.time}
                                </div>
                              )}
                            </div>
                            {suggestion.aqi && suggestion.aqi !== "N/A" && (
                              <div className={`ml-3 px-3 py-1 rounded-full text-sm font-semibold ${getAQIColor(suggestion.aqi)}`}>
                                AQI {suggestion.aqi}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Button 
                  onClick={() => {
                    setShowSuggestions(false);
                    fetchAQI();
                  }} 
                  disabled={loading || !city.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get AQI"}
                </Button>
              </div>
              <Button 
                onClick={detectLocationAndFetchAQI} 
                disabled={autoDetecting}
                variant="outline"
                className="w-full"
              >
                {autoDetecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Detecting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Use My Current Location
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {data && (
            <div className="space-y-6">
              {/* Main AQI Card with Health Impact */}
              <Card className={`border-2 ${getAQIColor(data.aqi)}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <MapPin className="h-6 w-6" />
                    {data.city}
                  </CardTitle>
                  <CardDescription className="text-lg font-semibold">
                    {getAQILabel(data.aqi)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* AQI Value */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Air Quality Index</p>
                      <p className="text-6xl font-bold mb-2">{data.aqi}</p>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>PM2.5: {data.pm2_5 ?? "N/A"} μg/m³</div>
                        <div>PM10: {data.pm10 ?? "N/A"} μg/m³</div>
                      </div>
                    </div>

                    {/* Health Impact Stats */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <Cigarette className="h-5 w-5 text-red-600 mt-1" />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Cigarette Equivalent</p>
                          <p className="text-2xl font-bold text-red-600">
                            {calculateCigarettes(data.pm2_5 || data.aqi * 0.5)} per day
                          </p>
                          <p className="text-xs text-gray-500">Based on PM2.5 exposure</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <Clock className="h-5 w-5 text-orange-600 mt-1" />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Life Expectancy</p>
                          <p className="text-2xl font-bold text-orange-600">
                            -{calculateMinutesLost(data.aqi)} min
                          </p>
                          <p className="text-xs text-gray-500">Lost per day at this AQI</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="space-y-3">
                      {data.main && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm font-semibold text-gray-700">Main Pollutant</p>
                          <p className="text-lg font-bold text-blue-600">{data.main}</p>
                        </div>
                      )}
                      {data.note && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{data.note}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personalized Health Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Personalized Health Advisory
                  </CardTitle>
                  <CardDescription>
                    Get customized health recommendations based on your profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Your Age</Label>
                      <Input
                        id="age"
                        type="number"
                        min="1"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Enter your age"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Checkbox
                        id="asthma"
                        checked={hasAsthma}
                        onCheckedChange={(checked) => setHasAsthma(checked as boolean)}
                      />
                      <Label htmlFor="asthma" className="cursor-pointer">
                        I have asthma or respiratory conditions
                      </Label>
                    </div>
                  </div>

                  <Button 
                    onClick={() => fetchHealthPrediction()}
                    disabled={predicting || !data}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {predicting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      "Get Health Advisory"
                    )}
                  </Button>

                  {prediction && (
                    <Alert className={`border-2 ${getAdvisoryColor(prediction.advisory.code)}`}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            {prediction.advisory.emoji && (
                              <span className="text-2xl">{prediction.advisory.emoji}</span>
                            )}
                            <p className="font-semibold">{prediction.advisory.text}</p>
                          </div>
                          {prediction.advisory.precautions && prediction.advisory.precautions.length > 0 && (
                            <ul className="space-y-2 mt-3">
                              {prediction.advisory.precautions.map((precaution: string, index: number) => (
                                <li key={index} className="text-sm flex items-start gap-2">
                                  <span className="mt-0.5">•</span>
                                  <span>{precaution}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AQIPage;
