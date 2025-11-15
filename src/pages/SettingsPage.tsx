import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Moon, Sun, Settings as SettingsIcon, User, Save, Loader2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  name: string;
  age: string;
  city: string;
  activityLevel?: string;
  healthConditions: {
    asthma: boolean;
    heartDisease: boolean;
    diabetes: boolean;
    lungDisease: boolean;
    smoker: boolean;
    allergies: boolean;
    other: boolean;
  };
}

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    age: "",
    city: "",
    activityLevel: "moderate",
    healthConditions: {
      asthma: false,
      heartDisease: false,
      diabetes: false,
      lungDisease: false,
      smoker: false,
      allergies: false,
      other: false,
    },
  });

  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    // Load saved profile
    const savedProfile = localStorage.getItem("vayu_profile");
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }
  }, []);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleProfileChange = (field: keyof Omit<UserProfile, 'healthConditions'>, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleHealthConditionChange = (condition: keyof UserProfile['healthConditions'], checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      healthConditions: {
        ...prev.healthConditions,
        [condition]: checked,
      },
    }));
  };

  const saveProfile = async () => {
    if (!profile.name || !profile.age || !profile.city) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in Name, Age, and City before saving.",
      });
      return;
    }

    setSaving(true);

    try {
      // Check if user has an existing profile ID
      const savedProfileId = localStorage.getItem("vayu_profile_id");
      
      const profileData = {
        name: profile.name,
        age: parseInt(profile.age),
        city: profile.city,
        asthma: profile.healthConditions.asthma,
        heart_disease: profile.healthConditions.heartDisease,
        diabetes: profile.healthConditions.diabetes,
        lung_disease: profile.healthConditions.lungDisease,
        other_conditions: profile.healthConditions.other,
      };

      if (savedProfileId) {
        // Update existing profile
        const { data, error } = await (supabase as any)
          .from('users')
          .update(profileData)
          .eq('id', savedProfileId)
          .select();

        if (error) throw error;
      } else {
        // Insert new profile
        const { data, error } = await (supabase as any)
          .from('users')
          .insert([profileData])
          .select();

        if (error) throw error;

        // Save the profile ID for future updates
        if (data && data[0]) {
          localStorage.setItem("vayu_profile_id", data[0].id);
        }
      }

      // Also save to localStorage as backup
      localStorage.setItem("vayu_profile", JSON.stringify(profile));
      
      toast({
        title: "Profile Saved! ✅",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error saving profile:", error);
      // Fallback to localStorage only
      localStorage.setItem("vayu_profile", JSON.stringify(profile));
      toast({
        title: "Profile Saved Locally",
        description: "Profile saved to your browser.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted animate-fade-in">
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Settings
            </h1>
          </div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  User Profile
                </CardTitle>
                <CardDescription>
                  Your profile helps us provide personalized health recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={profile.name}
                      onChange={(e) => handleProfileChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={profile.age}
                      onChange={(e) => handleProfileChange("age", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Enter your city"
                    value={profile.city}
                    onChange={(e) => handleProfileChange("city", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityLevel">Outdoor Activity Level</Label>
                  <select
                    id="activityLevel"
                    value={profile.activityLevel || "moderate"}
                    onChange={(e) => handleProfileChange("activityLevel" as any, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-background"
                  >
                    <option value="low">Low (Mostly indoors)</option>
                    <option value="moderate">Moderate (Occasional outdoor activity)</option>
                    <option value="high">High (Regular outdoor exercise/sports)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <Label>Health Conditions</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="asthma"
                        checked={profile.healthConditions.asthma}
                        onCheckedChange={(checked) => 
                          handleHealthConditionChange("asthma", checked as boolean)
                        }
                      />
                      <label htmlFor="asthma" className="text-sm cursor-pointer">
                        Asthma
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allergies"
                        checked={profile.healthConditions.allergies}
                        onCheckedChange={(checked) => 
                          handleHealthConditionChange("allergies", checked as boolean)
                        }
                      />
                      <label htmlFor="allergies" className="text-sm cursor-pointer">
                        Allergies (Respiratory)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="smoker"
                        checked={profile.healthConditions.smoker}
                        onCheckedChange={(checked) => 
                          handleHealthConditionChange("smoker", checked as boolean)
                        }
                      />
                      <label htmlFor="smoker" className="text-sm cursor-pointer">
                        Smoker
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="heartDisease"
                        checked={profile.healthConditions.heartDisease}
                        onCheckedChange={(checked) => 
                          handleHealthConditionChange("heartDisease", checked as boolean)
                        }
                      />
                      <label htmlFor="heartDisease" className="text-sm cursor-pointer">
                        Heart Disease
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="diabetes"
                        checked={profile.healthConditions.diabetes}
                        onCheckedChange={(checked) => 
                          handleHealthConditionChange("diabetes", checked as boolean)
                        }
                      />
                      <label htmlFor="diabetes" className="text-sm cursor-pointer">
                        Diabetes
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lungDisease"
                        checked={profile.healthConditions.lungDisease}
                        onCheckedChange={(checked) => 
                          handleHealthConditionChange("lungDisease", checked as boolean)
                        }
                      />
                      <label htmlFor="lungDisease" className="text-sm cursor-pointer">
                        Lung Disease
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="other"
                        checked={profile.healthConditions.other}
                        onCheckedChange={(checked) => 
                          handleHealthConditionChange("other", checked as boolean)
                        }
                      />
                      <label htmlFor="other" className="text-sm cursor-pointer">
                        Other Respiratory Conditions
                      </label>
                    </div>
                  </div>
                </div>

                <Button onClick={saveProfile} className="w-full" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Account Management */}
            <Card className="shadow-lg border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <LogOut className="h-5 w-5" />
                  Account Management
                </CardTitle>
                <CardDescription>
                  Manage your account and session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    localStorage.removeItem("vayu_authenticated");
                    localStorage.removeItem("vayu_user_name");
                    localStorage.removeItem("vayu_user_email");
                    localStorage.removeItem("vayu_profile_id");
                    window.location.href = "/";
                  }}
                  className="w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  You'll be redirected to the login page
                </p>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {darkMode ? (
                    <Moon className="h-5 w-5 text-primary" />
                  ) : (
                    <Sun className="h-5 w-5 text-primary" />
                  )}
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how Swasthya Vayu looks for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark themes
                    </p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Developer</span>
                  <span className="font-medium">Swasthya Vayu Team</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage;
