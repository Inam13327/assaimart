import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Thank You For Your Order
          </h1>
          <p className="text-muted-foreground mb-6">
            Your order has been received. Our ASSAIMART team will
            contact you shortly to confirm delivery details.
          </p>
          {orderId && (
            <p className="mb-6 text-sm text-muted-foreground">
              Your reference number is{" "}
              <span className="font-mono font-semibold text-foreground">{orderId}</span>.
            </p>
          )}
          <div className="flex justify-center gap-4">
            <Button variant="gold" asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;

