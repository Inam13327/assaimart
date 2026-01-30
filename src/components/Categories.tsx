import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: "Men's Collection",
    description: 'Bold, sophisticated styles for the modern gentleman',
    slug: 'men',
    image: 'https://i.pinimg.com/736x/1e/39/ef/1e39efa174d292296608ce3f80430971.jpg',
  },
  {
    name: "Women's Collection",
    description: 'Elegant, captivating items for the refined woman',
    slug: 'women',
    image: 'https://i.pinimg.com/736x/88/75/ce/8875ce851ea0004ee89bc024b4a33a50.jpg',
  },
  {
    name: 'Unisex Collection',
    description: 'Versatile essentials that transcend boundaries',
    slug: 'unisex',
    image: 'https://i.pinimg.com/1200x/e7/fa/c7/e7fac7671df6cd4445d403adbb2e5999.jpg',
  },
];

const Categories = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-gold text-sm font-medium uppercase tracking-widest">
            Explore
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-4 mb-6">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/shop?category=${category.slug}`}
              className="group relative h-80 rounded-xl overflow-hidden border border-border/50 hover-lift"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />

              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2 group-hover:text-gold transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {category.description}
                </p>
                <span className="inline-flex items-center text-sm text-gold font-medium">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
