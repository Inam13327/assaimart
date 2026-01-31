import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { checkout } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length || submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          imageUrl: item.product.image,
        })),
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
        },
      };
      const result = await checkout(payload);
      clearCart();
      toast({
        title: "Order placed",
        description: "Thank you for choosing ASSAIMART.",
      });
      navigate(`/order-confirmation?orderId=${result.orderId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Please try again.";
      toast({
        title: "Checkout failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Guest Checkout
          </h1>
          <p className="text-muted-foreground mb-10 max-w-xl">
            Complete your order without creating an account. Provide your contact and
            delivery details and our team will handle the rest.
          </p>

          <div className="grid gap-10 md:grid-cols-[2fr,1.3fr]">
            <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border bg-card p-6 shadow-sm">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  placeholder="+1 234 567 890"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Delivery Address</label>
                <Textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                  rows={4}
                  placeholder="Street, building, city, country"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={!items.length || submitting}
              >
                {submitting ? "Placing order…" : "Place Order"}
              </Button>
              {!items.length && (
                <p className="text-xs text-muted-foreground">
                  Your cart is empty. Add items from the shop before checking out.
                </p>
              )}
            </form>

            <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-muted-foreground">
                        Qty {item.quantity} × Rs {item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      Rs {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t pt-4 mt-2 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">Rs {totalPrice.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping fees and delivery times will be confirmed by our team after order
                review.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
