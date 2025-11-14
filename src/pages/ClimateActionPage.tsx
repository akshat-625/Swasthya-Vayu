import React from "react";
import ClimateAction from "@/components/ClimateAction";
import Footer from "@/components/Footer";

const ClimateActionPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 animate-fade-in">
      <div className="container mx-auto px-4 py-12">
        <ClimateAction />
        <Footer />
      </div>
    </div>
  );
};

export default ClimateActionPage;
