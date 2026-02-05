import { useState, useEffect, ReactNode } from 'react';
import { X, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';
import { Product } from '@/lib/types';

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

type AdType = 'product' | 'social';

interface AdItem {
  type: AdType;
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  icon?: ReactNode;
  iconBgClass?: string;
  link: string;
  isExternal: boolean;
  buttonText: string;
}

const SOCIAL_ADS: AdItem[] = [
  {
    type: 'social',
    id: 'tiktok',
    title: 'Follow us on TikTok',
    subtitle: '@assaimartofficial',
    icon: <TikTok className="w-8 h-8 text-white" />,
    iconBgClass: 'bg-black',
    link: 'https://www.tiktok.com/@assaimartofficial?_r=1&_t=ZS-93Cfhw0wdcG',
    isExternal: true,
    buttonText: 'Follow Now'
  },
  {
    type: 'social',
    id: 'instagram',
    title: 'Join us on Instagram',
    subtitle: '@assaimartofficial',
    icon: <Instagram className="w-8 h-8 text-white" />,
    iconBgClass: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500',
    link: 'https://www.instagram.com/assaimartofficial?igsh=Mzl3cGNzZzE4YXdm&utm_source=qr',
    isExternal: true,
    buttonText: 'Follow Us'
  },
  {
    type: 'social',
    id: 'facebook',
    title: 'Join us on Facebook',
    subtitle: 'Assaimart Official',
    icon: <Facebook className="w-8 h-8 text-white" />,
    iconBgClass: 'bg-blue-600',
    link: 'https://www.facebook.com/share/18MrnQLRBj/?mibextid=wwXIfr',
    isExternal: true,
    buttonText: 'Join Now'
  }
];

const AdvertisementPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAd, setCurrentAd] = useState<AdItem | null>(null);

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
    const availableAds: AdItem[] = [...SOCIAL_ADS];

    if (products && products.length > 0) {
      const productAds: AdItem[] = products.map(product => ({
        type: 'product',
        id: product.id,
        title: product.name,
        subtitle: `Rs ${product.price}`,
        image: product.image,
        link: `/product/${product.id}`,
        isExternal: false,
        buttonText: 'Check it out'
      }));
      availableAds.push(...productAds);
    }
    
    // Pick a random ad
    const randomAd = availableAds[Math.floor(Math.random() * availableAds.length)];
    setCurrentAd(randomAd);
    setIsVisible(true);

    // Auto-hide after 5 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      
      // Schedule next ad
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
        
        <div className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center ${currentAd.type === 'social' ? currentAd.iconBgClass : 'bg-secondary'}`}>
          {currentAd.type === 'product' ? (
            <img 
              src={currentAd.image} 
              alt={currentAd.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            currentAd.icon
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gold font-medium uppercase tracking-wider mb-0.5">
            {currentAd.type === 'product' ? 'Featured' : 'Connect'}
          </p>
          <h4 className="text-sm font-semibold text-foreground truncate leading-tight mb-1">
            {currentAd.title}
          </h4>
          <p className="text-xs text-muted-foreground truncate mb-2">
            {currentAd.subtitle}
          </p>
          
          {currentAd.isExternal ? (
             <Button variant="gold" size="sm" className="w-full h-7 text-xs" asChild>
               <a href={currentAd.link} target="_blank" rel="noopener noreferrer">
                 {currentAd.buttonText}
               </a>
             </Button>
          ) : (
            <Button variant="gold" size="sm" className="w-full h-7 text-xs" asChild>
              <Link to={currentAd.link}>
                {currentAd.buttonText}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvertisementPopup;
