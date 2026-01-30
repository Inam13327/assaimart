import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function pickRandom<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  while (copy.length && result.length < count) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

const RandomProducts = () => {
  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["random-products-home"],
    queryFn: () => getProducts(),
  });

  const products = Array.isArray(data) ? pickRandom(data, 30) : [];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-gold text-sm font-medium uppercase tracking-widest">
            Discover More
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-4 mb-6">
            Explore Our Collection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A random selection of products to inspire your next choice.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading products…</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="goldOutline" size="lg" asChild>
            <Link to="/shop">Browse All</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RandomProducts;
