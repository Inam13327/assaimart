import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ShoppingBag, Heart, Truck, Shield, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { getProduct, likeProduct } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading, error, refetch } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id || ""),
    enabled: Boolean(id),
  });
  const { addToCart } = useCart();
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (product) {
      setLikes(product.likes || 0);
      const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]');
      if (likedProducts.includes(product.id)) {
        setIsLiked(true);
      }
    }
  }, [product]);

  const handleLike = async () => {
    if (!id) return;
    try {
      if (isLiked) {
        // Unlike logic
        const res = await likeProduct(id, 'unlike');
        setLikes(res.likes);
        setIsLiked(false);
        
        const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]');
        const newLikedProducts = likedProducts.filter((pid: string) => pid !== id);
        localStorage.setItem('likedProducts', JSON.stringify(newLikedProducts));
      } else {
        // Like logic
        const res = await likeProduct(id, 'like');
        setLikes(res.likes);
        setIsLiked(true);
        
        const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]');
        if (!likedProducts.includes(id)) {
          likedProducts.push(id);
          localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
        }
      }
    } catch (e) {
      console.error("Failed to like/unlike", e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <CartSidebar />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-serif font-bold text-foreground mb-4">Loading perfume…</h1>
            <p className="text-muted-foreground mb-8">Please wait while we fetch the fragrance details.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <CartSidebar />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
              Product Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The product you are looking for is unavailable.
            </p>
            <Button variant="gold" asChild>
              <Link to="/shop">Back to Shop</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Back Link */}
          <Link
            to="/shop"
            className="inline-flex items-center text-muted-foreground hover:text-gold mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="aspect-square rounded-xl bg-card border border-border/50 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Badges */}
              <div className="flex gap-3">
                {product.bestseller && (
                  <span className="px-3 py-1 bg-gold text-primary-foreground text-xs font-semibold rounded-full">
                    Bestseller
                  </span>
                )}
                {product.originalPrice && (
                  <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded-full">
                    Sale
                  </span>
                )}
                <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full capitalize">
                  {product.category}
                </span>
              </div>

              {/* Name & Brand */}
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {product.brand}
                </p>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                  {product.name}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-gold">Rs {product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    Rs {product.originalPrice}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">/ {product.size}</span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Fragrance Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-semibold text-foreground">
                  Fragrance Notes
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <span className="text-sm font-medium text-gold w-16">Top:</span>
                    <span className="text-sm text-muted-foreground">
                      {product.notes.top.join(', ')}
                    </span>
                  </div>
                  {/* Removed Heart and Base as requested */}
                </div>
              </div>

              {/* Rating & Media */}
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-semibold text-foreground">
                  Rating
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gold">
                    {typeof product.rating === 'number' ? product.rating.toFixed(1) : 'N/A'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Array.isArray(product.ratingMedia) ? `${product.ratingMedia.length} media` : 'No media'}
                  </span>
                </div>
                {Array.isArray(product.ratingMedia) && product.ratingMedia.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {product.ratingMedia.map((m, idx) => (
                      <div key={idx} className="rounded-lg overflow-hidden border border-border">
                        {m.type === 'video' ? (
                          <video src={m.url} controls className="w-full h-full" />
                        ) : (
                          <img src={m.url} alt={`rating media ${idx + 1}`} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  variant="gold"
                  size="xl"
                  className="flex-1"
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                >
                  {product.inStock ? (
                    <>
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Add to Cart
                    </>
                  ) : (
                    'Out of Stock'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="xl" 
                  onClick={handleLike} 
                  className={`flex gap-2 ${isLiked ? 'text-red-500 border-red-200 bg-red-50' : ''}`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likes}</span>
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                <div className="text-center">
                  <Truck className="h-6 w-6 text-gold mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 text-gold mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">100% Authentic</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 text-gold mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">30-Day Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
