import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AQIProvider } from "./contexts/AQIContext";
import { Toaster } from "./components/ui/toaster";
import Navigation from "./components/Navigation";
import ChatBot from "./components/ChatBot";
import AuthPage from "./pages/AuthPage";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import FeaturesPage from "./pages/FeaturesPage";
import ClimateActionPage from "./pages/ClimateActionPage";
import ContactPage from "./pages/ContactPage";
import AQIPage from "./pages/AQIPage";
import JoinMovementPage from "./pages/JoinMovementPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { wakeBackend } from "./utils/wakeBackend";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wake up backend immediately
    wakeBackend("https://swasthya-vayu-backend.onrender.com/health").catch(() => {
      // Silent fail - don't block UI
    });

    // Check if user is already logged in
    const authStatus = localStorage.getItem("vayu_authenticated");
    const userName = localStorage.getItem("vayu_user_name");
    
    if (authStatus === "true" && userName) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (name: string, email: string) => {
    localStorage.setItem("vayu_authenticated", "true");
    localStorage.setItem("vayu_user_name", name);
    localStorage.setItem("vayu_user_email", email);
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <AQIProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/climate-action" element={<ClimateActionPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/aqi" element={<AQIPage />} />
          <Route path="/join-movement" element={<JoinMovementPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatBot />
        <Toaster />
      </BrowserRouter>
    </AQIProvider>
  );
}
