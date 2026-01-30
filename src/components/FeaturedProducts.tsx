import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';
import { Product } from '@/lib/types';

const FeaturedProducts = () => {
  const { data: featuredProducts, isLoading } = useQuery<Product[]>({
    queryKey: ['featured-products'],
    queryFn: () => getProducts({ featured: true }),
  });

  if (isLoading) {
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading featured collection...</p>
        </div>
      </section>
    );
  }

  const products = Array.isArray(featuredProducts) ? featuredProducts : [];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold text-sm font-medium uppercase tracking-widest">
            Curated Selection
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-4 mb-6">
            Featured Collection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium items, 
            each chosen for its exceptional quality and style.
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No featured products at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {products.slice(0, 14).map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="goldOutline" size="lg" asChild>
            <Link to="/shop">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
