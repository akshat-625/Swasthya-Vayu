import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAQI } from "@/contexts/AQIContext";
import axios from "axios";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I am VayuBot. Ask me about air quality!", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);
  const { toast } = useToast();
  const { aqiData } = useAQI();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !profileChecked) {
      const savedProfile = localStorage.getItem("vayu_profile");
      if (!savedProfile) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: "I notice you haven't set up your profile yet. Please visit Settings to complete your profile for personalized advice.",
            sender: "bot"
          }]);
        }, 500);
      }
      setProfileChecked(true);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
    setIsLoading(true);

    try {
      const savedProfile = localStorage.getItem("vayu_profile");
      let profileData: any = {
        location: aqiData?.location?.name || "Mumbai",
        aqi: aqiData?.aqi,
        pm2_5: aqiData?.pm25,
        pm10: aqiData?.pm25 ? aqiData.pm25 * 1.5 : undefined,
        age: 30,
        asthma: false,
      };

      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        profileData = {
          location: profile.city || profileData.location,
          aqi: aqiData?.aqi || profileData.aqi,
          pm2_5: aqiData?.pm25 || profileData.pm2_5,
          pm10: aqiData?.pm25 ? aqiData.pm25 * 1.5 : profileData.pm10,
          age: parseInt(profile.age) || 30,
          asthma: profile.healthConditions?.asthma || false,
          smoker: profile.healthConditions?.smoker || false,
          allergies: profile.healthConditions?.allergies || false,
          lung_disease: profile.healthConditions?.lungDisease || false,
          outdoor_activity: profile.activityLevel || "moderate"
        };
      }

      const response = await axios.post("https://swasthya-vayu-backend.onrender.com/chat", {
        message: userMessage,
        userProfile: profileData
      });

      const aiResponse = response.data.reply || "Sorry, I could not process that.";
      setMessages(prev => [...prev, { text: aiResponse, sender: "bot" }]);
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        text: "Cannot connect to server. Please make sure the backend is running or try again later.",
        sender: "bot"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-card border rounded-lg shadow-2xl flex flex-col z-50">
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
            <h3 className="font-semibold">VayuBot</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSend()} placeholder="Ask about air quality..." />
              <Button onClick={handleSend} size="icon"><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
