import { Link } from 'react-router-dom';
import { ArrowRight, Star, Gem, Sparkles } from 'lucide-react';

const tiers = [
  {
    name: 'Premium Collection',
    description: 'Exclusive, high-end products for special occasions.',
    slug: 'premium',
    icon: Gem,
    color: 'bg-gold/10 text-gold',
  },
  {
    name: 'Medium Range',
    description: 'Perfect balance of quality and affordability for daily wear.',
    slug: 'medium',
    icon: Star,
    color: 'bg-primary/10 text-primary',
  },
  {
    name: 'Basic Collection',
    description: 'Delightful items at an accessible price point.',
    slug: 'basic',
    icon: Sparkles,
    color: 'bg-secondary text-secondary-foreground',
  },
];

const FeaturedTiers = () => {
  return (
    <section className="py-24 bg-background border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-gold text-sm font-medium uppercase tracking-widest">
            Ranges
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-4 mb-6">
            Shop by Collection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the perfect match for your lifestyle and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <Link
              key={tier.slug}
              to={`/shop?tier=${tier.slug}`}
              className="group relative p-8 rounded-xl border border-border/50 bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-6 ${tier.color} transition-transform group-hover:scale-110`}>
                <tier.icon className="h-7 w-7" />
              </div>
              
              <h3 className="text-2xl font-serif font-bold text-foreground mb-4 group-hover:text-gold transition-colors">
                {tier.name}
              </h3>
              
              <p className="text-muted-foreground mb-8">
                {tier.description}
              </p>

              <span className="inline-flex items-center text-sm font-medium text-foreground group-hover:text-gold transition-colors">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTiers;
