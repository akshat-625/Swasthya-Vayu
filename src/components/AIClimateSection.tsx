import React from "react";
import { Brain, TrendingUp, Shield, Sparkles } from "lucide-react";

const AIClimateSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary">AI-Powered Intelligence</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
              AI for Climate Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leveraging artificial intelligence and machine learning to combat air pollution and protect public health
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Predictive Health Analytics</h3>
                  <p className="text-muted-foreground text-sm">
                    Our ML model analyzes AQI levels, PM2.5/PM10 concentrations, and personal health profiles to predict health risks and provide personalized safety recommendations in real-time.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Intelligent Conversational AI</h3>
                  <p className="text-muted-foreground text-sm">
                    VayuBot uses NLP to understand air quality queries, provides city-specific AQI data, health impacts, and actionable advice—making environmental data accessible to everyone.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Climate Impact Quantification</h3>
                  <p className="text-muted-foreground text-sm">
                    AI algorithms calculate the equivalent cigarette consumption from air pollution exposure and estimate health impacts in life-minutes lost, helping users understand the real cost of poor air quality.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Adaptive Health Advisory System</h3>
                  <p className="text-muted-foreground text-sm">
                    Machine learning models consider age, pre-existing conditions (asthma, heart disease), and local AQI to generate adaptive health advisories, empowering vulnerable populations to take preventive action.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Brain className="h-16 w-16 flex-shrink-0 opacity-90" />
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">Climate Action Through Technology</h3>
                <p className="opacity-90">
                  By democratizing access to air quality data and empowering citizens with AI-driven insights, 
                  Swasthya Vayu contributes to climate resilience, reduces health inequalities, and supports 
                  evidence-based policy-making for a sustainable future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIClimateSection;
