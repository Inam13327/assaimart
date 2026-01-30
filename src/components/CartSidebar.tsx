import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const CartSidebar = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 animate-slide-up flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-serif font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-gold" />
            Your Cart
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mb-6">
                Discover our exquisite collection of fragrances
              </p>
              <Button variant="gold" onClick={() => setIsCartOpen(false)} asChild>
                <Link to="/shop">Shop Now</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-4 pb-6 border-b border-border">
                  <div className="w-20 h-20 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.product.size}</p>
                    <p className="text-gold font-semibold mt-1">Rs {item.product.price}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-xl font-serif font-semibold text-gold">Rs {totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Shipping calculated at checkout</p>
            <Button
              variant="gold"
              className="w-full"
              size="lg"
              onClick={() => {
                setIsCartOpen(false);
                navigate("/checkout");
              }}
            >
              Proceed to Checkout
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsCartOpen(false)}
              asChild
            >
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
