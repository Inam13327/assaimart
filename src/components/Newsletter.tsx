import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { subscribeNewsletter } from "@/lib/api";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await subscribeNewsletter(email);
      toast({
        title: "Welcome to the family!",
        description: "You'll receive exclusive offers and updates.",
      });
      setEmail("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to subscribe.";
      toast({
        title: "Subscription failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-gold text-sm font-medium uppercase tracking-widest">
            Stay Connected
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-4 mb-6">
            Join Our Newsletter
          </h2>
          <p className="text-muted-foreground mb-10">
            Be the first to know about new arrivals, exclusive offers, 
            and insider style tips.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 bg-card border-border focus:border-gold"
              required
            />
            <Button type="submit" variant="gold" size="lg">
              <Send className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">By subscribing, you agree to our Privacy Policy and consent to receive updates.</p>

          <div className="mt-12 grid gap-8 md:grid-cols-3 text-left">
            <div className="space-y-2">
              <h3 className="font-serif font-semibold text-foreground">Facebook</h3>
              <p className="text-sm text-muted-foreground">
                Join our vibrant community for daily updates, community discussions, and exclusive Facebook-only offers.
              </p>
              <a 
                href="https://www.facebook.com/share/18MrnQLRBj/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-gold hover:underline block break-all"
              >
                Visit Facebook Page
              </a>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-semibold text-foreground">TikTok</h3>
              <p className="text-sm text-muted-foreground">
                Watch our viral trends, behind-the-scenes content, and fun styling tips on our TikTok channel.
              </p>
              <a 
                href="https://www.tiktok.com/@assaimartofficial?_r=1&_t=ZS-93Cfhw0wdcG" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-gold hover:underline block break-all"
              >
                Watch on TikTok
              </a>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-semibold text-foreground">Instagram</h3>
              <p className="text-sm text-muted-foreground">
                Explore our curated visual gallery, daily stories, and style inspiration directly from our feed.
              </p>
              <a 
                href="https://www.instagram.com/assaimartofficial?igsh=Mzl3cGNzZzE4YXdm&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-gold hover:underline block break-all"
              >
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
