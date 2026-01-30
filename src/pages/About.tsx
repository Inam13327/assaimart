import { Target, Eye, Heart, Award, Users, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';

const About = () => {
  const values = [
    {
      icon: Award,
      title: 'Authenticity',
      description: 'Every fragrance we offer is 100% authentic, sourced directly from authorized distributors.',
    },
    {
      icon: Heart,
      title: 'Quality',
      description: 'We curate only the finest perfumes that meet our rigorous standards for excellence.',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We\'re here to help you find your perfect scent.',
    },
    {
      icon: Sparkles,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service, from selection to delivery.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-24">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-gold text-sm font-medium uppercase tracking-widest">
              Our Story
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mt-4 mb-8">
              About ASSAIMART
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Founded with a passion for quality and variety, ASSAIMART has become 
              a trusted destination for shoppers seeking authentic products, 
              from fine fragrances to fashion and lifestyle essentials.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-card py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Mission */}
              <div className="p-8 rounded-xl bg-background border border-border/50">
                <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-gold" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To make luxury fragrances accessible to everyone by offering authentic, 
                  premium perfumes at competitive prices, backed by exceptional customer 
                  service and a seamless shopping experience.
                </p>
              </div>

              {/* Vision */}
              <div className="p-8 rounded-xl bg-background border border-border/50">
                <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center mb-6">
                  <Eye className="h-7 w-7 text-gold" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                  Our Vision
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To become the leading online destination for premium fragrances, 
                  known for our authenticity, curated selection, and commitment 
                  to helping customers discover their signature scent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-gold text-sm font-medium uppercase tracking-widest">
                What We Believe
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-4">
                Our Values
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="text-center p-6"
                >
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="bg-card py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-gold text-sm font-medium uppercase tracking-widest">
                Our Expertise
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-4 mb-8">
                Years of Experience
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                With years of experience in the retail trading industry, 
                we have built strong relationships with authorized distributors worldwide. 
                This allows us to offer you the finest products at competitive prices 
                while guaranteeing 100% authenticity.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our team of product specialists is passionate about helping you 
                discover items that resonate with your personality and style. 
                Whether you're looking for a bold statement piece or a subtle 
                everyday essential, we're here to guide you.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
