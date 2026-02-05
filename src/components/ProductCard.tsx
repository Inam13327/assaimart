import { useState, useEffect } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { likeProduct } from '@/lib/api';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCard = ({ product, compact }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);
  const [likes, setLikes] = useState(product.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]');
    if (likedProducts.includes(product.id)) {
      setIsLiked(true);
    }
  }, [product.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if inside a link, though here it's a button
    e.stopPropagation();

    try {
      if (isLiked) {
        // Unlike logic
        const res = await likeProduct(product.id, 'unlike');
        if (res && typeof res.likes === 'number') {
          setLikes(res.likes);
          setIsLiked(false);
          
          const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]');
          const newLikedProducts = likedProducts.filter((id: string) => id !== product.id);
          localStorage.setItem('likedProducts', JSON.stringify(newLikedProducts));
        }
      } else {
        // Like logic
        const res = await likeProduct(product.id, 'like');
        if (res && typeof res.likes === 'number') {
          setLikes(res.likes);
          setIsLiked(true);
          
          const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '[]');
          if (!likedProducts.includes(product.id)) {
            likedProducts.push(product.id);
            localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
          }
        }
      }
    } catch (error) {
      console.error("Failed to like product", error);
    }
  };

  return (
    <div
      className={
        compact
          ? "group relative bg-card rounded-lg overflow-hidden hover-lift border border-border/50 text-xs h-full flex flex-col"
          : "group relative bg-card rounded-lg overflow-hidden hover-lift border border-border/50 h-full flex flex-col"
      }
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
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
      </div>

      {/* Wishlist Button - Reused for Like */}
      <button 
        onClick={handleLike}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background ${isLiked ? 'text-red-500 opacity-100' : ''}`}
      >
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      </button>

      {/* Image */}
      <Link
        to={`/product/${product.id}`}
        className={compact ? "block aspect-square overflow-hidden bg-secondary w-full" : "block aspect-square overflow-hidden bg-secondary w-full"}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </Link>

      {/* Content */}
      <div className={(compact ? "p-3" : "p-3") + " flex flex-col flex-grow"}>
        <div className="flex-grow">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <Link to={`/product/${product.id}`}>
            <h3
              className={
                compact
                  ? "font-serif text-sm font-semibold text-foreground mb-1 hover:text-gold transition-colors line-clamp-2"
                  : "font-serif text-base font-semibold text-foreground mb-1 hover:text-gold transition-colors line-clamp-2"
              }
            >
              {product.name}
            </h3>
          </Link>
          <p className={compact ? "text-[10px] text-muted-foreground mb-2 line-clamp-2" : "text-xs text-muted-foreground mb-2 line-clamp-2"}>
            {product.description || "No description available"}
          </p>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={compact ? "text-sm font-semibold text-gold" : "text-base font-semibold text-gold"}>
                Rs {product.price}
              </span>
              {product.originalPrice && (
                <span className={compact ? "text-[10px] text-muted-foreground line-through" : "text-xs text-muted-foreground line-through"}>
                  Rs {product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">{product.size}</span>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            <Button
              variant="goldOutline"
              className="w-full"
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
            >
              {product.inStock ? (
                <>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              ) : (
                'Out of Stock'
              )}
            </Button>
            <div className="flex gap-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    Rating
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rating for {product.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-gold">
                        {typeof product.rating === 'number' ? product.rating.toFixed(1) : 'N/A'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {typeof product.rating === 'number' ? 'out of 5' : 'No rating yet'}
                      </span>
                    </div>
                    {Array.isArray(product.ratingMedia) && product.ratingMedia.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
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
                    {(!product.ratingMedia || product.ratingMedia.length === 0) && (
                      <p className="text-sm text-muted-foreground">No rating media for this product.</p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={handleLike} className={`flex gap-2 min-w-[60px] ${isLiked ? 'text-red-500 border-red-200 bg-red-50' : ''}`}>
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
