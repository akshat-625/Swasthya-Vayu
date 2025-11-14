import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, Wind, AlertCircle, Droplet } from "lucide-react";
import Footer from "@/components/Footer";

interface Station {
  uid: string;
  name: string;
  lat: number;
  lon: number;
  aqi: number | string;
}

interface StationDetails {
  station: string;
  aqi: number;
  time: string;
  pollutants: {
    pm25?: { v: number };
    pm10?: { v: number };
    no2?: { v: number };
    o3?: { v: number };
    co?: { v: number };
  };
  coordinates: number[];
  dominentpol?: string;
}

const StationAQIPage = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stationDetails, setStationDetails] = useState<StationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStations, setLoadingStations] = useState(true);

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStations(stations);
    } else {
      const filtered = stations.filter((station) =>
        station.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStations(filtered);
    }
  }, [searchTerm, stations]);

  const fetchStations = async () => {
    setLoadingStations(true);
    setError(null);
    try {
      const response = await axios.get("/api/stations");
      setStations(response.data);
      setFilteredStations(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load stations");
    } finally {
      setLoadingStations(false);
    }
  };

  const fetchStationDetails = async (uid: string) => {
    setLoading(true);
    setError(null);
    setStationDetails(null);
    try {
      const response = await axios.get(`/api/aqi_station?uid=${uid}`);
      setStationDetails(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load station details");
    } finally {
      setLoading(false);
    }
  };

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    fetchStationDetails(station.uid);
  };

  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return { label: "Good", color: "bg-green-500", text: "Air quality is satisfactory" };
    if (aqi <= 100) return { label: "Moderate", color: "bg-yellow-500", text: "Acceptable for most people" };
    if (aqi <= 150) return { label: "Unhealthy for Sensitive Groups", color: "bg-orange-500", text: "Sensitive groups should limit outdoor activity" };
    if (aqi <= 200) return { label: "Unhealthy", color: "bg-red-500", text: "Everyone should reduce outdoor activity" };
    if (aqi <= 300) return { label: "Very Unhealthy", color: "bg-purple-500", text: "Health alert: everyone may experience effects" };
    return { label: "Hazardous", color: "bg-maroon-800", text: "Health warning of emergency conditions" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 mb-2">
              Station-Level AQI Monitor
            </h1>
            <p className="text-muted-foreground">
              Real-time air quality data from monitoring stations across India
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Station Selection */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Select Monitoring Station
                </CardTitle>
                <CardDescription>
                  Search and select from {stations.length} active stations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search station by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                  />
                </div>

                {loadingStations ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {filteredStations.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        No stations found
                      </p>
                    ) : (
                      filteredStations.map((station) => (
                        <button
                          key={station.uid}
                          onClick={() => handleStationSelect(station)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            selectedStation?.uid === station.uid
                              ? "border-primary bg-primary/10"
                              : "border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-muted"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{station.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Lat: {station.lat.toFixed(2)}, Lon: {station.lon.toFixed(2)}
                              </p>
                            </div>
                            {station.aqi !== "-" && (
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                getAQICategory(Number(station.aqi)).color
                              } text-white`}>
                                {station.aqi}
                              </span>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Station Details */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-primary" />
                  Station Details
                </CardTitle>
                <CardDescription>
                  Live air quality measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedStation && !loading && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Select a station to view details
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}

                {stationDetails && !loading && (
                  <div className="space-y-6">
                    {/* AQI Display */}
                    <div className={`p-6 rounded-lg ${getAQICategory(stationDetails.aqi).color} text-white`}>
                      <div className="text-center">
                        <p className="text-sm opacity-90 mb-2">Air Quality Index</p>
                        <p className="text-5xl font-bold mb-2">{stationDetails.aqi}</p>
                        <p className="text-lg font-semibold">{getAQICategory(stationDetails.aqi).label}</p>
                        <p className="text-sm opacity-90 mt-2">
                          {getAQICategory(stationDetails.aqi).text}
                        </p>
                      </div>
                    </div>

                    {/* Station Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{stationDetails.station}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Updated: {stationDetails.time}
                        </span>
                      </div>
                      {stationDetails.dominentpol && (
                        <div className="flex items-center gap-2">
                          <Wind className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Dominant pollutant: {stationDetails.dominentpol.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Pollutants */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Droplet className="h-4 w-4" />
                        Pollutant Levels
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {stationDetails.pollutants.pm25 && (
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground">PM2.5</p>
                            <p className="text-xl font-bold">{stationDetails.pollutants.pm25.v}</p>
                            <p className="text-xs">µg/m³</p>
                          </div>
                        )}
                        {stationDetails.pollutants.pm10 && (
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground">PM10</p>
                            <p className="text-xl font-bold">{stationDetails.pollutants.pm10.v}</p>
                            <p className="text-xs">µg/m³</p>
                          </div>
                        )}
                        {stationDetails.pollutants.no2 && (
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground">NO₂</p>
                            <p className="text-xl font-bold">{stationDetails.pollutants.no2.v}</p>
                            <p className="text-xs">µg/m³</p>
                          </div>
                        )}
                        {stationDetails.pollutants.o3 && (
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground">O₃</p>
                            <p className="text-xl font-bold">{stationDetails.pollutants.o3.v}</p>
                            <p className="text-xs">µg/m³</p>
                          </div>
                        )}
                        {stationDetails.pollutants.co && (
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground">CO</p>
                            <p className="text-xl font-bold">{stationDetails.pollutants.co.v}</p>
                            <p className="text-xs">µg/m³</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => fetchStationDetails(selectedStation!.uid)}
                      variant="outline"
                      className="w-full"
                      disabled={loading}
                    >
                      Refresh Data
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StationAQIPage;
