import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProductTypes } from "@/lib/api";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems, setIsCartOpen } = useCart();

  const { data: productTypesData } = useQuery<string[]>({
    queryKey: ["product-types"],
    queryFn: getProductTypes,
  });

  const productTypes = productTypesData && productTypesData.length > 0 ? productTypesData : ["Perfume"];

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Track Order', path: '/track-order' },
  ];

  const categories = [
    { name: 'Men', slug: 'men' },
    { name: 'Women', slug: 'women' },
    { name: 'Unisex', slug: 'unisex' },
  ];

  const tiers = [
    { name: 'Premium', slug: 'premium' },
    { name: 'Medium', slug: 'medium' },
    { name: 'Basic', slug: 'basic' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 lg:gap-4">
            <img 
              src="/logo.png" 
              alt="ASSAIMART" 
              className="h-16 -mt-5 md:h-24 md:-mt-7 lg:h-28 lg:-mt-9 w-auto mt-1 md:mt-2 object-contain transition-all duration-300" 
            />
            <span className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-gradient-gold transition-all duration-300">
              ASSAIMART
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                isActive('/') ? 'text-gold' : 'text-foreground/80 hover:text-gold'
              }`}
            >
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium tracking-wide transition-colors duration-300 text-foreground/80 hover:text-gold outline-none">
                Products <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {productTypes.map((type) => (
                  <DropdownMenuSub key={type}>
                    <DropdownMenuSubTrigger>
                      {type}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {categories.map((category) => (
                        <DropdownMenuSub key={`${type}-${category.slug}`}>
                          <DropdownMenuSubTrigger>
                            {category.name}
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {tiers.map((tier) => (
                              <DropdownMenuItem key={`${type}-${category.slug}-${tier.slug}`} onClick={() => navigate(`/shop?productType=${type}&category=${category.slug}&tier=${tier.slug}`)}>
                                {tier.name}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem onClick={() => navigate(`/shop?productType=${type}&category=${category.slug}`)}>
                              All {category.name}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      ))}
                      <DropdownMenuItem onClick={() => navigate(`/shop?productType=${type}`)}>
                        All {type}s
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.filter(l => l.path !== '/').map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-gold'
                    : 'text-foreground/80 hover:text-gold'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className={`transition-all duration-300 ${isSearchOpen ? 'w-48 md:w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
              <Input 
                placeholder="Search..." 
                className="h-9 bg-background/50 border-gold/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/shop?q=${e.currentTarget.value}`);
                    setIsSearchOpen(false);
                  }
                }}
              />
            </div>
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold text-primary-foreground text-xs flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-gold'
                    : 'text-foreground/80 hover:text-gold'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
