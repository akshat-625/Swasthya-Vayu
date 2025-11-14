import { Leaf, Target, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const ClimateAction = () => {
  return (
    <section id="climate" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex justify-center mb-6">
              <Globe className="h-16 w-16 text-secondary animate-pulse-glow" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Climate Action
            </h2>
            <p className="text-xl text-muted-foreground">
              Contributing to UN Sustainable Development Goal 13
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card rounded-xl p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 animate-fade-in">
              <Target className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
              <p className="text-muted-foreground">
                Empower individuals and communities with data-driven insights to reduce air pollution exposure 
                and promote sustainable lifestyle choices that benefit both health and environment.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Leaf className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Sustainable Impact</h3>
              <p className="text-muted-foreground">
                By providing real-time air quality data and behavioral recommendations, we help reduce individual 
                carbon footprints and advocate for policy changes that prioritize clean air.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-center text-white shadow-[var(--shadow-glow)] animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-bold mb-4">Join the Movement</h3>
            <p className="mb-6 text-white/90">
              Every action counts. Together, we can create cleaner air and healthier communities for future generations.
            </p>
            <a href="/join-movement">
              <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90">
                Get Started Today
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClimateAction;
