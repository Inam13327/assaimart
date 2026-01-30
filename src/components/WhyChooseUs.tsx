import { Shield, Truck, CreditCard, Headphones } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '100% Authentic',
    description: 'Every item is sourced directly from authorized distributors, guaranteeing authenticity.',
  },
  {
    icon: CreditCard,
    title: 'Competitive Pricing',
    description: 'Premium products at prices that make luxury accessible without compromising quality.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Secure packaging and swift shipping to bring your favorite items right to your doorstep.',
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    description: 'Our product specialists are here to help you find your perfect match.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold text-sm font-medium uppercase tracking-widest">
            Our Promise
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-4 mb-6">
            Why Choose Us
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to delivering an exceptional shopping experience 
            with every purchase you make.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-xl bg-background border border-border/50 hover:border-gold/30 transition-all duration-300 hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                <feature.icon className="h-7 w-7 text-gold" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
