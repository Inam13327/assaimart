import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';
import { Product } from '@/lib/types';
import heroPerfume from '@/assets/hero-perfume.jpg';

const HeroSection = () => {
  const { data } = useQuery<Product[]>({
    queryKey: ['hero-products'],
    queryFn: () => getProducts(),
  });

  const slides = Array.isArray(data)
    ? data.filter((product) => product.image).slice(0, 6)
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  useEffect(() => {
    if (!slides.length) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const activeProduct = slides.length ? slides[currentIndex] : null;

  const handleNext = () => {
    if (!slides.length) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    if (!slides.length) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroPerfume}
          alt="Premium Fragrance"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>
      
      {/* Gold Accent Orb */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="text-sm text-muted-foreground">Premium Collection</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 animate-slide-up">
              <span className="text-foreground">Discover Your</span>
              <br />
              <span className="text-gradient-gold">Perfect Style</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Explore our curated collection of authentic, high-quality products 
              crafted to elevate your lifestyle.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Button variant="hero" asChild>
                <Link to="/shop">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" asChild>
                <Link to="/about">
                  Our Story
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-8 mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              {[
                '100% Authentic',
                'Free Shipping',
                'Secure Checkout',
                '30-Day Returns',
              ].map(badge => (
                <div key={badge} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-gold" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
          <div className="relative lg:translate-x-12 xl:translate-x-16">
            <div className="absolute -inset-6 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.35),transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.8),transparent_65%)] opacity-60 blur-3xl pointer-events-none" />
            <div className="relative rounded-[2rem] border border-gold/40 bg-gradient-to-br from-gold/15 via-background/95 to-background shadow-[0_0_80px_rgba(212,175,55,0.55)] overflow-hidden backdrop-blur-2xl">
              {activeProduct ? (
                <Link to={`/product/${activeProduct.id}`} className="relative block w-full h-full bg-black">
                  <img
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    className="w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[420px] object-contain p-4 transition-transform duration-700 hover:scale-110"
                  />
                  {/* Black Vignette / Blur Overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_80%,rgba(0,0,0,1)_100%)] mix-blend-multiply" />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/50 via-transparent to-transparent opacity-50" />
                </Link>
              ) : (
                <div className="w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[420px] bg-gradient-to-br from-gold/10 via-background to-background" />
              )}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.75),transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.65),transparent_65%)] mix-blend-multiply" />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4">
                <div className="max-w-[60%]">
                  <p className="text-xs font-medium text-gold uppercase tracking-widest">
                    Featured Product
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {activeProduct ? activeProduct.name : 'Discover our latest arrivals'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activeProduct?.brand}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-background/70 border-gold/40 hover:bg-background"
                    onClick={handlePrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-background/70 border-gold/40 hover:bg-background"
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {slides.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setCurrentIndex(slides.findIndex((p) => p.id === product.id))}
                  className="focus:outline-none"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all ${
                      product.id === activeProduct?.id
                        ? 'w-7 bg-gold'
                        : 'w-4 bg-muted-foreground/40'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-gold rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
