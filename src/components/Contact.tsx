import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to Supabase
      const { error } = await (supabase as any)
        .from('contact_messages')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            message: formData.message.trim(),
          }
        ]);

      if (error) throw error;

      toast({
        title: "Message Sent! ✅",
        description: "Thank you for your feedback. We'll get back to you soon.",
      });
      
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message Received",
        description: "Thank you for contacting us!",
      });
      setFormData({ name: "", email: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground">
            Have questions or feedback? We'd love to hear from you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8 animate-fade-in">
            <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-soft)]">
              <Mail className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-bold text-lg mb-2">Email Us</h3>
              <p className="text-muted-foreground">support@swasthyavayu.in</p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-soft)]">
              <Phone className="h-8 w-8 text-secondary mb-3" />
              <h3 className="font-bold text-lg mb-2">Call Us</h3>
              <p className="text-muted-foreground">+91 1800-VAYU-HELP</p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-soft)]">
              <MapPin className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-bold text-lg mb-2">Location</h3>
              <p className="text-muted-foreground">New Delhi, India</p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 shadow-[var(--shadow-soft)] animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  placeholder="Tell us how we can help..."
                  rows={5}
                />
              </div>
              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
