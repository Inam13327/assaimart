import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <span className="text-gold text-sm font-medium uppercase tracking-widest">
              Legal
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-4 mb-8">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground mb-12">
              Last updated: January 2024
            </p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  1. Information We Collect
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We collect information you provide directly to us, such as when you create an account, 
                  make a purchase, subscribe to our newsletter, or contact us for support. This information 
                  may include your name, email address, postal address, phone number, and payment information.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  2. How We Use Your Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use the information we collect to process transactions, send you order confirmations 
                  and updates, respond to your comments and questions, send you marketing communications 
                  (with your consent), and improve our services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  3. Information Sharing
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to outside parties 
                  except to trusted third parties who assist us in operating our website, conducting our 
                  business, or servicing you, as long as those parties agree to keep this information confidential.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  4. Data Security
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement a variety of security measures to maintain the safety of your personal 
                  information. Your personal information is contained behind secured networks and is only 
                  accessible by a limited number of persons who have special access rights.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  5. Cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies to enhance your experience, gather general visitor information, and track 
                  visits to our website. You can choose to disable cookies through your browser settings.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  6. Contact Us
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at 
                  privacy@tradingmarketing.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
