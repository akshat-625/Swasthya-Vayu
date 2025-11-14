import { AlertTriangle, Users, MapPin } from "lucide-react";

const About = () => {
  const stats = [
    { icon: AlertTriangle, value: "2.4M", label: "Deaths Annually", color: "text-destructive" },
    { icon: MapPin, value: "21", label: "Most Polluted Cities", color: "text-primary" },
    { icon: Users, value: "1.4B", label: "People Affected", color: "text-secondary" },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            India's Air Quality Crisis
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Air pollution is one of the leading health risks in India, affecting millions of lives every day
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <stat.icon className={`h-12 w-12 ${stat.color} mb-4 mx-auto`} />
              <p className="text-4xl font-bold mb-2 text-center">{stat.value}</p>
              <p className="text-muted-foreground text-center">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl p-8 shadow-[var(--shadow-soft)] max-w-4xl mx-auto">
          <p className="text-lg text-foreground leading-relaxed">
            India is home to <span className="font-bold text-primary">21 of the world's 30 most polluted cities</span>. 
            Every year, air pollution contributes to approximately{" "}
            <span className="font-bold text-destructive">2.4 million premature deaths</span> across the country. 
            Vulnerable populations including children, elderly, and those with respiratory conditions face the highest risks.
            <br /><br />
            <span className="text-primary font-semibold">Swasthya Vayu</span> leverages AI technology to provide 
            real-time, hyperlocal air quality data and personalized health recommendations, empowering communities 
            to make informed decisions and take proactive measures for their wellbeing.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
