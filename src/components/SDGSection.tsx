import React from "react";
import { Heart, Leaf, Users, Target } from "lucide-react";

const SDGSection = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">Global Impact</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Aligned with UN Sustainable Development Goals
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our mission directly supports global efforts to improve health and combat climate change
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* SDG 3 */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-8 rounded-2xl border-2 border-red-200 dark:border-red-800 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-red-600 dark:text-red-400">SDG 3</div>
                  <h3 className="text-xl font-bold">Good Health & Well-being</h3>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Air pollution is one of the leading environmental health risks globally. Swasthya Vayu empowers 
                citizens with real-time AQI data, personalized health advisories, and predictive analytics to 
                reduce exposure to harmful pollutants.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                  <p className="text-sm">Reduces respiratory and cardiovascular health risks</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                  <p className="text-sm">Protects vulnerable populations (children, elderly, asthma patients)</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                  <p className="text-sm">Promotes preventive healthcare through data-driven insights</p>
                </div>
              </div>
            </div>

            {/* SDG 13 */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-8 rounded-2xl border-2 border-green-200 dark:border-green-800 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">SDG 13</div>
                  <h3 className="text-xl font-bold">Climate Action</h3>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                By raising awareness about air quality and its climate implications, we drive behavioral change 
                and support evidence-based environmental policies. Our platform connects citizens with actionable 
                climate data.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></div>
                  <p className="text-sm">Increases public awareness of pollution and climate linkage</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></div>
                  <p className="text-sm">Supports data-driven policy-making for cleaner air initiatives</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></div>
                  <p className="text-sm">Empowers communities to advocate for environmental action</p>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Statement */}
          <div className="bg-gradient-to-r from-primary to-blue-600 p-8 rounded-2xl text-white text-center">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-3">Creating Healthier, Sustainable Communities</h3>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Swasthya Vayu bridges the gap between complex environmental data and actionable citizen engagement, 
              contributing to both immediate health protection and long-term climate resilience—one community at a time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SDGSection;
