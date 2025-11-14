import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Cigarette, Clock, AlertCircle, Search, Loader2 } from "lucide-react";
import { useAQI } from "@/contexts/AQIContext";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AQIWidget = () => {
  const { aqiData, isLoading, fetchAQI, getUserLocation } = useAQI();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    // For simplicity, using a geocoding approach
    // In production, integrate Google Places API or similar
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const { latitude, longitude, name } = data.results[0];
        await fetchAQI(latitude, longitude, name);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Good':
        return 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50';
      case 'Moderate':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50';
      case 'Unhealthy for Sensitive Groups':
        return 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/50';
      case 'Unhealthy':
        return 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50';
      case 'Very Unhealthy':
        return 'bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/50';
      default:
        return 'bg-destructive/20 text-destructive border-destructive/50';
    }
  };

  return (
    <section id="aqi-widget" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Live Air Quality Monitor
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time AQI data with personalized health insights for your location
          </p>
        </div>

        {/* Location Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2">
            <Input
              placeholder="Search for a city or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" onClick={getUserLocation} disabled={isLoading}>
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && aqiData && (
          <div className="space-y-8 animate-fade-in">
            {/* Main AQI Card */}
            <Card className="max-w-4xl mx-auto shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {aqiData.location?.name || "Current Location"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* AQI Value */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Air Quality Index</p>
                    <p className="text-6xl font-bold text-primary mb-2">{aqiData.aqi}</p>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getCategoryStyles(aqiData.category)}`}>
                      {aqiData.category}
                    </span>
                  </div>

                  {/* Health Impact */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Cigarette className="h-5 w-5 text-destructive mt-1" />
                      <div>
                        <p className="text-sm font-semibold">Cigarette Equivalent</p>
                        <p className="text-2xl font-bold text-destructive">
                          {aqiData.cigarettesPerDay} per day
                        </p>
                        <p className="text-xs text-muted-foreground">Based on PM2.5: {aqiData.pm25} µg/m³</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Clock className="h-5 w-5 text-destructive mt-1" />
                      <div>
                        <p className="text-sm font-semibold">Life Expectancy</p>
                        <p className="text-2xl font-bold text-destructive">
                          -{aqiData.minutesLost} min
                        </p>
                        <p className="text-xs text-muted-foreground">Lost per day at this AQI</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Alert */}
                  <div className={`p-4 rounded-lg border-2 ${getCategoryStyles(aqiData.category)}`}>
                    <AlertCircle className="h-6 w-6 mb-2" />
                    <p className="font-semibold mb-2">General Advice</p>
                    <p className="text-sm">{aqiData.healthAdvice.adults}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 24-Hour Forecast */}
            <Card className="max-w-4xl mx-auto shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle>24-Hour AQI Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={aqiData.hourlyForecast}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'Hours from now', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'AQI', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="aqi" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Age-Wise Health Advice */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-center">Personalized Health Advice</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">👶</span>
                      Children
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{aqiData.healthAdvice.children}</p>
                  </CardContent>
                </Card>

                <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">🧑</span>
                      Adults
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{aqiData.healthAdvice.adults}</p>
                  </CardContent>
                </Card>

                <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">👵</span>
                      Elderly / At-Risk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{aqiData.healthAdvice.elderly}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AQIWidget;
