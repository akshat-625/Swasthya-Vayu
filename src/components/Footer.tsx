import { Wind, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Wind className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Swasthya Vayu</span>
            </div>
            <p className="text-muted-foreground text-sm">
              AI-powered air quality monitoring for a healthier tomorrow
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#climate" className="hover:text-primary transition-colors">Climate Action</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Research Papers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Data Sources</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect With Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Swasthya Vayu. All rights reserved. Contributing to UN SDG 13.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
