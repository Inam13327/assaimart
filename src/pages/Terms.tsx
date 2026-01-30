import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';

const Terms = () => {
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
              Terms & Conditions
            </h1>
            <p className="text-muted-foreground mb-12">
              Last updated: January 2024
            </p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using this website, you accept and agree to be bound by the terms 
                  and provisions of this agreement. If you do not agree to abide by these terms, 
                  please do not use this service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  2. Products and Pricing
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  All products are subject to availability. We reserve the right to discontinue any 
                  product at any time. Prices for our products are subject to change without notice. 
                  We reserve the right to modify or discontinue the service without notice at any time.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  3. Orders and Payment
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  When you place an order, you are offering to purchase a product subject to these 
                  terms and conditions. All orders are subject to availability and confirmation of 
                  the order price. We accept various payment methods and use secure payment processing.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  4. Shipping and Delivery
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We aim to dispatch all orders within 1-2 business days. Delivery times may vary 
                  depending on your location. We are not responsible for delays caused by customs 
                  or other factors outside our control.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  5. Intellectual Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on this website, including text, graphics, logos, images, and software, 
                  is the property of ASSAIMART and is protected by copyright laws. You may 
                  not reproduce, distribute, or create derivative works without our written permission.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-serif font-semibold text-foreground">
                  6. Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  ASSAIMART shall not be liable for any indirect, incidental, special, 
                  consequential, or punitive damages resulting from your access to or use of, 
                  or inability to access or use, the service.
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

export default Terms;
