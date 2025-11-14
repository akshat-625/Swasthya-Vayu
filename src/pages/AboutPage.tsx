import React from "react";
import About from "@/components/About";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 animate-fade-in">
      <div className="container mx-auto px-4 py-12">
        <About />
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
