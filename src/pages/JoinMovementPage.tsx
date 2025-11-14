import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Users, Heart, Mail, CheckCircle, Loader2 } from "lucide-react";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const JoinMovementPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMemberCount();
    
    // Check if user has already joined
    const userJoined = localStorage.getItem("userJoinedMovement");
    if (userJoined === "true") {
      setHasJoined(true);
    }
  }, []);

  const fetchMemberCount = async () => {
    try {
      const { data, error } = await supabase.rpc('get_member_count');
      if (error) throw error;
      setMemberCount(data || 1247);
    } catch (error) {
      console.error("Error fetching member count:", error);
      // Fallback to localStorage if Supabase fails
      const storedCount = localStorage.getItem("movementMemberCount");
      setMemberCount(storedCount ? parseInt(storedCount, 10) : 1247);
    }
  };

  const handleJoinMovement = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !city.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to join the movement.",
        variant: "destructive",
      });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Save to Supabase
      const { data, error } = await (supabase as any)
        .from('movement_members')
        .insert([
          {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            city: city.trim(),
          }
        ])
        .select();

      if (error) {
        // Check if email already exists
        if (error.code === '23505') {
          toast({
            title: "Already Registered",
            description: "This email is already part of the movement!",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      // Mark user as joined in localStorage
      localStorage.setItem("userJoinedMovement", "true");
      localStorage.setItem("userName", name);
      localStorage.setItem("userCity", city);
      
      setHasJoined(true);
      
      // Refresh member count
      await fetchMemberCount();
      
      toast({
        title: "Welcome to the Movement! 🎉",
        description: `Thank you, ${name}! Together we're building a healthier future.`,
      });

      // Clear form
      setName("");
      setEmail("");
      setCity("");
    } catch (error: any) {
      console.error("Error joining movement:", error);
      toast({
        title: "Error",
        description: "Failed to join the movement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-fade-in">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Community Impact</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
              Join the Clean Air Movement
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Be part of a growing community committed to breathing cleaner air and building healthier, more sustainable cities
            </p>
          </div>

          {/* Member Counter */}
          <Card className="bg-gradient-to-r from-primary to-blue-600 text-white p-8 mb-12 shadow-xl">
            <div className="text-center">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-90" />
              <div className="text-6xl font-bold mb-2">{memberCount.toLocaleString()}</div>
              <p className="text-xl opacity-90">Citizens have joined the movement</p>
            </div>
          </Card>

          {/* Why Join Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Heart className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">Health Protection</h3>
              <p className="text-muted-foreground text-sm">
                Get personalized air quality alerts and health advisories to protect yourself and your loved ones
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Users className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">Community Power</h3>
              <p className="text-muted-foreground text-sm">
                Join thousands advocating for cleaner air policies and environmental action in your city
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Mail className="h-10 w-10 text-green-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">Stay Informed</h3>
              <p className="text-muted-foreground text-sm">
                Receive weekly air quality reports, climate action updates, and tips for reducing pollution
              </p>
            </Card>
          </div>

          {/* Join Form */}
          {!hasJoined ? (
            <Card className="p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-center">Take Action Today</h2>
              <form onSubmit={handleJoinMovement} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-2">
                    City
                  </label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Enter your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full"
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    "Join the Movement"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By joining, you'll receive updates about air quality in your area and tips for climate action. 
                  We respect your privacy and will never share your information.
                </p>
              </form>
            </Card>
          ) : (
            <Card className="p-8 shadow-xl text-center bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">You're Already Part of the Movement!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your commitment to cleaner air and a healthier future. 
                Keep using Swasthya Vayu to monitor air quality and protect your health.
              </p>
              <Button
                onClick={() => {
                  localStorage.removeItem("userJoinedMovement");
                  setHasJoined(false);
                }}
                variant="outline"
              >
                Update My Information
              </Button>
            </Card>
          )}

          {/* Impact Statement */}
          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground italic">
              "Together, we're not just monitoring air quality—we're building a movement for environmental justice, 
              public health, and climate resilience. Every voice matters."
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JoinMovementPage;
