import { Button } from "@/components/ui/button";
import { Wind, Play } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useAQI } from "@/contexts/AQIContext";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { aqiData, isLoading } = useAQI();
  const navigate = useNavigate();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Good':
        return 'text-green-600 dark:text-green-400';
      case 'Moderate':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Unhealthy for Sensitive Groups':
        return 'text-orange-600 dark:text-orange-400';
      case 'Unhealthy':
        return 'text-red-600 dark:text-red-400';
      case 'Very Unhealthy':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-destructive';
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background"></div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/20 animate-float"
            style={{
              width: `${Math.random() * 30 + 10}px`,
              height: `${Math.random() * 30 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <Wind className="h-20 w-20 text-primary animate-pulse-glow" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Breathe Smart, Live Healthy
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
          AI-powered air quality monitoring and personalized health advisories for a cleaner tomorrow
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="hero" size="lg" onClick={() => navigate("/aqi")}>
            Check My Air Quality
          </Button>
          <Button variant="outline" size="lg" onClick={() => scrollToSection("climate")}>
            <Play className="mr-2 h-5 w-5" />
            Join the Movement
          </Button>
        </div>

        {/* AQI Widget Preview */}
        <div className="mt-12 inline-block bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-[var(--shadow-soft)] min-w-[300px]">
          {isLoading ? (
            <div className="flex items-center gap-4">
              <div className="animate-pulse text-muted-foreground">Loading AQI data...</div>
            </div>
          ) : aqiData ? (
            <div className="flex items-center gap-4">
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Current AQI</p>
                <p className="text-4xl font-bold text-primary">{aqiData.aqi}</p>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">{aqiData.location?.name || "Your Location"}</p>
                <p className={`text-lg font-semibold ${getCategoryColor(aqiData.category)}`}>
                  {aqiData.category}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">
              Enable location to see real-time AQI
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
