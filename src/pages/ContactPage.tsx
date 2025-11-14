import React from "react";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 animate-fade-in">
      <div className="container mx-auto px-4 py-12">
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

export default ContactPage;
