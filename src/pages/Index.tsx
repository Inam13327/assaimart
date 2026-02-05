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
import AdvertisementPopup from '@/components/AdvertisementPopup';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />
      <AdvertisementPopup />
      <main>
        <HeroSection />
        {/* RandomProducts section removed as per request to replace it with the popup */}
        {/* <RandomProducts /> */} 
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
