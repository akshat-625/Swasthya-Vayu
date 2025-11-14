import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Wind, Loader2, Users, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthPageProps {
  onLogin: (name: string, email: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submitted - isLogin:", isLogin, "email:", email, "name:", userName);
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    if (!isLogin && !userName) {
      toast({
        title: "Name Required",
        description: "Please enter your name.",
        variant: "destructive"
      });
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Check Supabase users table for existing users
      const { data: existingUsers, error: fetchError } = await (supabase as any)
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase());

      const userExists = existingUsers && existingUsers.length > 0 ? existingUsers[0] : null;

      if (isLogin) {
        // LOGIN MODE: Check if user exists
        if (!userExists) {
          setLoading(false);
          toast({
            title: "Account Not Found ❌",
            description: "No account exists with this email. Please sign up first by clicking below.",
            variant: "destructive"
          });
          console.log("Login failed - user not found");
          return;
        }
        
        console.log("Login successful - user found:", userExists);
        // User exists, log them in
        onLogin(userExists.name, email);
        toast({
          title: "Welcome Back! 🎉",
          description: `Welcome back, ${userExists.name}!`,
        });
        setLoading(false);
      } else {
        // SIGNUP MODE: Check if user already exists
        if (userExists) {
          setLoading(false);
          toast({
            title: "Account Already Exists",
            description: "An account with this email already exists. Please login instead.",
            variant: "destructive"
          });
          return;
        }
        
        // Register new user in users table
        const { data: newUser, error: insertError } = await (supabase as any)
          .from('users')
          .insert([
            {
              name: userName,
              email: email.toLowerCase(),
            }
          ])
          .select();

        if (insertError) {
          throw insertError;
        }
        
        onLogin(userName, email);
        toast({
          title: "Account Created! 🎉",
          description: `Welcome to Swasthya Vayu, ${userName}!`,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Auth error:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Branding Section */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <Wind className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Swasthya Vayu
            </h1>
          </div>
          
          <h2 className="text-3xl font-bold text-foreground">
            Breathe Smart, Live Healthy
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join thousands of people monitoring air quality in real-time. Get personalized health recommendations 
            based on current AQI levels and your health profile.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">2.4M+</p>
                <p className="text-sm text-muted-foreground">Lives Affected</p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">1000+</p>
                <p className="text-sm text-muted-foreground">Monitoring Stations</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Auth Form Section */}
        <Card className="shadow-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="text-2xl">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Enter your email to access your personalized dashboard" 
                : "Sign up to start monitoring air quality"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? "Logging in..." : "Creating account..."}
                  </>
                ) : (
                  <>{isLogin ? "Login" : "Sign Up"}</>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Login"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
