import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const TikTok = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-gradient-gold">
              ASSAIMART
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Discover a world of quality. We bring you authentic products 
              that define your unique style and needs.
            </p>
            <div className="flex gap-4 pt-2">
              <a 
                href="https://www.instagram.com/assaimartofficial?igsh=Mzl3cGNzZzE4YXdm&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-gold transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.facebook.com/share/18MrnQLRBj/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-gold transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@assaimartofficial?_r=1&_t=ZS-93Cfhw0wdcG" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-gold transition-colors"
              >
                <TikTok className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-serif font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              {['Shop All', 'Men\'s Collection', 'Women\'s Collection', 'New Arrivals', 'Bestsellers'].map(item => (
                <li key={item}>
                  <Link to="/shop" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-serif font-semibold text-foreground">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-serif font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-gold" />
                assaimartofficial@gmail.com
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-gold" />
                +92-3497716806
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-gold mt-0.5" />
                <span>3rd Floor, Tajmahal Plaza, Abbottabad<br /> KPK, PAKISTAN</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 ASSAIMART. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <img src="/placeholder.svg" alt="Visa" className="h-6 opacity-50" />
            <img src="/placeholder.svg" alt="Mastercard" className="h-6 opacity-50" />
            <img src="/placeholder.svg" alt="PayPal" className="h-6 opacity-50" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
