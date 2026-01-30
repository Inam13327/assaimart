import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';

const Refund = () => {
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
              Refund & Return Policy
            </h1>
            <p className="text-muted-foreground mb-12">
              Last updated: January 2024
            </p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  30-Day Return Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We want you to be completely satisfied with your purchase. If you're not happy 
                  with your order, you may return it within 30 days of delivery for a full refund 
                  or exchange.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  Return Conditions
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To be eligible for a return, items must be:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Unused and in the same condition that you received them</li>
                  <li>In their original packaging with all seals intact</li>
                  <li>Accompanied by the original receipt or proof of purchase</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  How to Return
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To initiate a return, please contact our customer service team at 
                  returns@tradingmarketing.com with your order number and reason for return. 
                  We will provide you with return instructions and a prepaid shipping label.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  Refund Process
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Once we receive your return, we will inspect the item and notify you of the 
                  refund status. If approved, your refund will be processed within 5-7 business 
                  days. The refund will be credited to your original payment method.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  Damaged or Defective Items
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you receive a damaged or defective item, please contact us immediately at 
                  assaimartofficial@gmail.com. We will arrange for a replacement or full refund 
                  at no additional cost to you.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  Exchanges
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you would like to exchange an item for a different product, please return 
                  the original item for a refund and place a new order for the desired product.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  Contact Us
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about our return policy, please contact us at 
                  assaimartofficial@gmail.com or call us at +92-3497716806.
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

export default Refund;
