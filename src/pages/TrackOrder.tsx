import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getOrder } from "@/lib/api";
import type { Order } from "@/lib/types";

const TrackOrder = () => {
  const [reference, setReference] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    const id = reference.trim();
    if (!id || loading) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const result = await getOrder(id);
      setOrder(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Order not found";
      setError(message);
      toast({
        title: "Unable to find order",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 text-center">
            Track Your Order
          </h1>
          <p className="text-muted-foreground mb-8 text-center">
            Enter the reference number you received after placing your order to view its details.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              className="flex-1"
              placeholder="Enter reference number"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button
              variant="gold"
              disabled={!reference.trim() || loading}
              onClick={handleSearch}
            >
              {loading ? "Searching…" : "Track Order"}
            </Button>
          </div>
          {error && (
            <p className="mt-4 text-sm text-destructive text-center">{error}</p>
          )}
          {order && (
            <div className="mt-6 rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold">Order Details</h2>
              <p className="text-sm">
                Reference: <span className="font-mono">{order.id}</span>
              </p>
              <p className="text-sm">
                Customer: {order.customer.name} ({order.customer.phone})
              </p>
              <p className="text-sm">Address: {order.customer.address}</p>
              <p className="mt-1 text-sm">Status: {order.status}</p>
              <p className="text-xs text-muted-foreground">
                Created: {new Date(order.createdAt).toLocaleString()}
              </p>
              <div className="mt-4 space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-14 w-14 rounded-md object-cover border"
                      />
                    )}
                    <div className="text-xs">
                      <div className="font-medium">{item.productName}</div>
                      <div>
                        Quantity: {item.quantity}
                      </div>
                      <div>Rs {item.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackOrder;
