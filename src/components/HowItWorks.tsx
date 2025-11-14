import { MapPin, Database, Brain, Bell } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Location Detection",
      description: "Share your location or search for any area to get hyperlocal air quality data",
    },
    {
      icon: Database,
      title: "Data Collection",
      description: "Real-time aggregation from government sensors, satellites, and community reports",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Advanced algorithms process data and generate personalized health advisories",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Receive timely notifications with actionable recommendations for your health",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground">
            AI-powered insights in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-105 relative z-10">
                <div className="bg-gradient-to-br from-primary to-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">{step.title}</h3>
                <p className="text-muted-foreground text-center text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
