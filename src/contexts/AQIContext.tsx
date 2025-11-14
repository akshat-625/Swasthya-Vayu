import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AQIData {
  aqi: number;
  category: string;
  categoryColor: string;
  pm25: number;
  cigarettesPerDay: number;
  minutesLost: number;
  healthAdvice: {
    children: string;
    adults: string;
    elderly: string;
  };
  timestamp: string;
  hourlyForecast: Array<{ hour: number; aqi: number }>;
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
}

interface AQIContextType {
  aqiData: AQIData | null;
  isLoading: boolean;
  fetchAQI: (latitude: number, longitude: number, locationName?: string) => Promise<void>;
  getUserLocation: () => void;
}

const AQIContext = createContext<AQIContextType | undefined>(undefined);

export const AQIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchAQI = async (latitude: number, longitude: number, locationName?: string) => {
    setIsLoading(true);
    try {
      // First, get city name from coordinates if not provided
      let cityName = locationName;
      if (!cityName) {
        try {
          const geoResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const geoData = await geoResponse.json();
          cityName = geoData.city || geoData.locality || geoData.principalSubdivision || "Your Location";
        } catch {
          cityName = "Your Location";
        }
      }

      // Call Flask backend with city name
      const response = await fetch(`http://localhost:5000/aqi?city=${encodeURIComponent(cityName)}`);
      
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();

      setAqiData({
        ...data,
        location: { latitude, longitude, name: data.city || cityName }
      });

      toast({
        title: "AQI Updated",
        description: `Current AQI: ${data.aqi} (${data.category})`,
      });
    } catch (error) {
      console.error('Error fetching AQI:', error);
      toast({
        title: "Error",
        description: "Failed to fetch air quality data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await fetchAQI(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: "Location Access Denied",
          description: "Please enable location access or search manually.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <AQIContext.Provider value={{ aqiData, isLoading, fetchAQI, getUserLocation }}>
      {children}
    </AQIContext.Provider>
  );
};

export const useAQI = () => {
  const context = useContext(AQIContext);
  if (context === undefined) {
    throw new Error('useAQI must be used within an AQIProvider');
  }
  return context;
};
