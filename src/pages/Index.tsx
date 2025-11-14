import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import AQIWidget from "@/components/AQIWidget";
import ClimateAction from "@/components/ClimateAction";
import ChatBot from "@/components/ChatBot";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { AQIProvider } from "@/contexts/AQIContext";

const Index = () => {
  return (
    <AQIProvider>
      <div className="min-h-screen">
        <Navigation />
        <Hero />
        <About />
        <HowItWorks />
        <Features />
        <AQIWidget />
        <ClimateAction />
        <Contact />
        <Footer />
        <ChatBot />
      </div>
    </AQIProvider>
  );
};

export default Index;
