import React from "react";
import ChatBot from "@/components/ChatBot";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const VayuBotPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Vayu Bot - Your Air Quality Assistant
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Ask me about air quality, get personalized health recommendations, and learn about pollution in your city
          </p>

          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle>What can I help you with?</CardTitle>
              <CardDescription>
                Try asking questions like:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">•</span>
                  "What's the AQI in Mumbai?"
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">•</span>
                  "Should I go outside for a run today?"
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">•</span>
                  "What advice do you have for someone with asthma?"
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">•</span>
                  "Tell me about air pollution in Delhi"
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Keep ChatBot UI intact - it will now call backend at /api/chat */}
          <ChatBot />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VayuBotPage;
