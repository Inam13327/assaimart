import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import FeaturedTiers from '@/components/FeaturedTiers';
import RandomProducts from '@/components/RandomProducts';
import Categories from '@/components/Categories';
import WhyChooseUs from '@/components/WhyChooseUs';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />
      <main>
        <HeroSection />
        <RandomProducts />
        <FeaturedTiers />
        <FeaturedProducts />
        <Categories />
        <WhyChooseUs />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
