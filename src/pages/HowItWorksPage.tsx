import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, Database, Server, Globe, Smartphone, Brain, BarChart3 } from "lucide-react";
import Footer from "@/components/Footer";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 animate-fade-in">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Technical Architecture</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">How It Works</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A seamless data pipeline from global air quality networks to your fingertips, 
              powered by AI and modern web technologies
            </p>
          </div>

          {/* Architecture Diagram */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">System Architecture</h2>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Data Source */}
                <div className="flex flex-col items-center">
                  <Card className="p-6 w-full bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <Database className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-bold text-center text-sm">WAQI API</h3>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      Global Air Quality Data
                    </p>
                  </Card>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-8 w-8 text-primary rotate-90 md:rotate-0" />
                </div>

                {/* Backend */}
                <div className="flex flex-col items-center">
                  <Card className="p-6 w-full bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <Server className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="font-bold text-center text-sm">Flask Backend</h3>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      Python REST API
                    </p>
                  </Card>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-8 w-8 text-primary rotate-90 md:rotate-0" />
                </div>

                {/* Frontend */}
                <div className="flex flex-col items-center">
                  <Card className="p-6 w-full bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                    <Globe className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-bold text-center text-sm">React Frontend</h3>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      TypeScript + Vite
                    </p>
                  </Card>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <ArrowRight className="h-8 w-8 text-primary rotate-90" />
              </div>

              <div className="mt-4 flex justify-center">
                <Card className="p-6 w-64 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                  <Smartphone className="h-12 w-12 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-bold text-center text-sm">User Interface</h3>
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    Mobile & Desktop
                  </p>
                </Card>
              </div>
            </div>
          </div>

          {/* Data Flow */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Data Flow Process</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Data Collection</h3>
                <p className="text-sm text-muted-foreground">
                  WAQI aggregates real-time air quality data from 12,000+ monitoring stations across India and globally
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-bold text-lg mb-2">API Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Flask backend fetches data via WAQI API, processes pollutant levels (PM2.5, PM10, NO₂, O₃, CO), and formats responses
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-bold text-lg mb-2">AI Enhancement</h3>
                <p className="text-sm text-muted-foreground">
                  Machine learning models predict health risks, calculate cigarette equivalents, and generate personalized advisories
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-orange-600">4</span>
                </div>
                <h3 className="font-bold text-lg mb-2">User Display</h3>
                <p className="text-sm text-muted-foreground">
                  React frontend renders interactive dashboards, maps, and visualizations with real-time updates and responsive design
                </p>
              </Card>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Frontend */}
              <Card className="p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Globe className="h-6 w-6 text-primary" />
                  Frontend Technologies
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-semibold">React 18 + TypeScript</p>
                      <p className="text-sm text-muted-foreground">Modern component-based UI framework with type safety</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-semibold">Vite</p>
                      <p className="text-sm text-muted-foreground">Lightning-fast build tool and dev server</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-semibold">Tailwind CSS + Shadcn UI</p>
                      <p className="text-sm text-muted-foreground">Utility-first styling with accessible components</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-semibold">React Router v6</p>
                      <p className="text-sm text-muted-foreground">Client-side routing with lazy loading</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-semibold">Axios</p>
                      <p className="text-sm text-muted-foreground">Promise-based HTTP client for API requests</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Backend */}
              <Card className="p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Server className="h-6 w-6 text-green-600" />
                  Backend Technologies
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                    <div>
                      <p className="font-semibold">Flask 3.1.2</p>
                      <p className="text-sm text-muted-foreground">Lightweight Python web framework for REST APIs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                    <div>
                      <p className="font-semibold">WAQI API</p>
                      <p className="text-sm text-muted-foreground">World Air Quality Index data provider</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                    <div>
                      <p className="font-semibold">Flask-CORS</p>
                      <p className="text-sm text-muted-foreground">Cross-origin resource sharing support</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                    <div>
                      <p className="font-semibold">Python Requests</p>
                      <p className="text-sm text-muted-foreground">HTTP library for external API calls</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                    <div>
                      <p className="font-semibold">Python-dotenv</p>
                      <p className="text-sm text-muted-foreground">Environment variable management</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* AI/ML Features */}
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="h-10 w-10 text-purple-600" />
              <h2 className="text-2xl font-bold">AI/ML Integration</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Predictive Analytics</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Health risk prediction based on AQI and user profile</li>
                  <li>• Cigarette equivalent calculations from PM2.5 exposure</li>
                  <li>• Life-minutes lost estimation from pollution levels</li>
                  <li>• Personalized safety recommendations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Natural Language Processing</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• VayuBot conversational AI for air quality queries</li>
                  <li>• Context-aware responses with city-specific data</li>
                  <li>• Profile-integrated health advisory generation</li>
                  <li>• Multi-language support for accessibility</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* API Endpoints */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">API Endpoints</h2>
            <Card className="p-8">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <code className="text-sm font-mono text-blue-600 dark:text-blue-400">GET /api/aqi?city=Mumbai</code>
                  <p className="text-sm text-muted-foreground mt-1">Fetch current AQI for a specific city</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <code className="text-sm font-mono text-green-600 dark:text-green-400">GET /api/stations</code>
                  <p className="text-sm text-muted-foreground mt-1">List all monitoring stations in India</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <code className="text-sm font-mono text-purple-600 dark:text-purple-400">GET /api/aqi_station?uid=5323</code>
                  <p className="text-sm text-muted-foreground mt-1">Get detailed station data with pollutant breakdown</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <code className="text-sm font-mono text-orange-600 dark:text-orange-400">GET /api/search_cities?keyword=Delhi</code>
                  <p className="text-sm text-muted-foreground mt-1">Autocomplete search for cities with AQI data</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <code className="text-sm font-mono text-red-600 dark:text-red-400">POST /api/predict</code>
                  <p className="text-sm text-muted-foreground mt-1">Generate health predictions based on AQI and profile</p>
                </div>
                <div className="border-l-4 border-teal-500 pl-4">
                  <code className="text-sm font-mono text-teal-600 dark:text-teal-400">POST /api/chat</code>
                  <p className="text-sm text-muted-foreground mt-1">Conversational AI endpoint for VayuBot</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
