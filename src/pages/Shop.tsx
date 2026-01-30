import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/api";
import { Product } from "@/lib/types";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const categories = [
    { id: "all", name: "All Fragrances" },
    { id: "men", name: "Men" },
    { id: "women", name: "Women" },
    { id: "unisex", name: "Unisex" },
  ];

  const tierParam = searchParams.get("tier");
  const qParam = searchParams.get("q");
  const productTypeParam = searchParams.get("productType");

  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["shop-products", activeCategory, tierParam, qParam, productTypeParam],
    queryFn: () =>
      getProducts({
        segment: activeCategory === "all" ? undefined : activeCategory,
        tier: tierParam || undefined,
        q: qParam || undefined,
        productType: productTypeParam || undefined,
      }),
  });

  const filteredProducts = Array.isArray(data) ? data : [];

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", categoryId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-gold text-sm font-medium uppercase tracking-widest">
              {tierParam ? `${tierParam} Collection` : "Our Collection"}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-4 mb-6">
              Shop Your Perfect Style
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated selection of premium products, 
              each crafted to leave a lasting impression.
            </p>
            {tierParam && (
              <Button 
                variant="ghost" 
                className="mt-4 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  searchParams.delete("tier");
                  setSearchParams(searchParams);
                }}
              >
                Show All Collections
              </Button>
            )}
            {qParam && (
              <div className="flex flex-col items-center mt-2">
                <p className="text-lg">Search results for "{qParam}"</p>
                <Button 
                  variant="link" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    searchParams.delete("q");
                    setSearchParams(searchParams);
                  }}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "gold" : "outline"}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {isLoading && <p className="text-center text-muted-foreground">Loading products…</p>}
          {error && <p className="text-center text-destructive">Failed to load products.</p>}
          {!isLoading && !error && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} compact />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No products found in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
