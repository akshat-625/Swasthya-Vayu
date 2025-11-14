import { Brain, MapPinned, TrendingUp, Users, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Driven Advisories",
      description: "Personalized health recommendations based on your location, health profile, and real-time AQI data",
      gradient: "from-primary to-accent",
    },
    {
      icon: MapPinned,
      title: "Hyperlocal Precision",
      description: "Block-level air quality monitoring using advanced sensors and satellite data integration",
      gradient: "from-accent to-secondary",
    },
    {
      icon: TrendingUp,
      title: "Predictive Forecasting",
      description: "24-hour AQI predictions powered by machine learning to help you plan your day",
      gradient: "from-secondary to-primary",
    },
    {
      icon: Users,
      title: "Community Reporting",
      description: "Crowdsourced data validation and real-time updates from local communities",
      gradient: "from-primary to-secondary",
    },
    {
      icon: Shield,
      title: "Vulnerable Population Alerts",
      description: "Priority notifications for children, elderly, and individuals with respiratory conditions",
      gradient: "from-accent to-primary",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced technology for comprehensive air quality monitoring and health protection
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card rounded-xl p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`bg-gradient-to-br ${feature.gradient} rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
