import { Shield, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
              <h3 className="font-bold text-lg">Citizen Services Hub</h3>
                <p className="text-sm text-muted">Your Gateway to Digital Services</p>
              </div>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Your one-stop digital platform for essential citizen services. From government schemes to document services, 
              we're building a transparent and accessible digital governance ecosystem.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-background">Quick Links</h4>
            <nav className="space-y-2">
              <a href="/services" className="block text-muted hover:text-background transition-colors text-sm">
                All Services
              </a>
              <a href="/schemes" className="block text-muted hover:text-background transition-colors text-sm">
                Government Schemes
              </a>
              <a href="/documents" className="block text-muted hover:text-background transition-colors text-sm">
                Document Services
              </a>
              <a href="/applications" className="block text-muted hover:text-background transition-colors text-sm">
                Track Applications
              </a>
              <a href="/support" className="block text-muted hover:text-background transition-colors text-sm">
                Support
              </a>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold text-background">Service Categories</h4>
            <nav className="space-y-2">
              <a href="/schemes/education" className="block text-muted hover:text-background transition-colors text-sm">
                Education Services
              </a>
              <a href="/schemes/healthcare" className="block text-muted hover:text-background transition-colors text-sm">
                Healthcare Services
              </a>
              <a href="/schemes/employment" className="block text-muted hover:text-background transition-colors text-sm">
                Employment Services
              </a>
              <a href="/documents/certificates" className="block text-muted hover:text-background transition-colors text-sm">
                Certificates
              </a>
              <a href="/financial" className="block text-muted hover:text-background transition-colors text-sm">
                Financial Services
              </a>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-background">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-background font-medium">Helpline</p>
                  <p className="text-sm text-muted">1800-xxx-xxxx</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-background font-medium">Support</p>
                  <p className="text-sm text-muted">support@citizenhub.in</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-background font-medium">Address</p>
                  <p className="text-sm text-muted">New Delhi, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-muted/20 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-muted">
                © 2024 Government of India. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <a href="/privacy" className="text-muted hover:text-background transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-muted hover:text-background transition-colors">
                  Terms of Service
                </a>
                <a href="/accessibility" className="text-muted hover:text-background transition-colors">
                  Accessibility
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="link" size="sm" className="text-muted hover:text-background">
                Site Map
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="link" size="sm" className="text-muted hover:text-background">
                Feedback
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;