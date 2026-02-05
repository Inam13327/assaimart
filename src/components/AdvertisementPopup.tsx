import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';
import { Product } from '@/lib/types';

const AdvertisementPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAd, setCurrentAd] = useState<Product | null>(null);

  const { data: products } = useQuery<Product[]>({
    queryKey: ['ad-products'],
    queryFn: () => getProducts(),
  });

  useEffect(() => {
    // Initial delay before first ad
    const initialTimer = setTimeout(() => {
      showRandomAd();
    }, 2000);

    return () => clearTimeout(initialTimer);
  }, [products]);

  const showRandomAd = () => {
    if (!products || products.length === 0) return;
    
    // Pick a random product
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    setCurrentAd(randomProduct);
    setIsVisible(true);

    // Auto-hide after 5 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      
      // Schedule next ad (optional, e.g., every 30 seconds)
      // For now, let's just show it once per session or reload, 
      // or we can make it reappear. User said "randomly show... timer 5 sec played".
      // Let's make it reappear after 15 seconds for demo purposes.
      setTimeout(showRandomAd, 15000);
      
    }, 5000);

    return () => clearTimeout(hideTimer);
  };

  if (!isVisible || !currentAd) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-slide-in-left">
      <div className="relative bg-card border border-gold/30 rounded-lg shadow-lg p-3 w-64 md:w-72 flex items-center gap-3 backdrop-blur-md bg-opacity-95">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border border-border shadow-sm hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-3 w-3" />
        </Button>
        
        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-secondary">
          <img 
            src={currentAd.image} 
            alt={currentAd.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gold font-medium uppercase tracking-wider mb-0.5">
            Featured
          </p>
          <h4 className="text-sm font-semibold text-foreground truncate leading-tight mb-1">
            {currentAd.name}
          </h4>
          <p className="text-xs text-muted-foreground truncate mb-2">
            Rs {currentAd.price}
          </p>
          <Button variant="gold" size="sm" className="w-full h-7 text-xs" asChild>
            <Link to={`/product/${currentAd.id}`}>
              Check it out
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementPopup;
