export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: "men" | "women" | "unisex";
  description: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  size: string;
  inStock: boolean;
  featured?: boolean;
  bestseller?: boolean;
  rating?: number;
  ratingMedia?: { type: "image" | "video"; url: string }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  brand: string;
  size: string;
  price: number;
  originalPrice?: number;
  categorySlug: string;
  segment: Product["category"] | string;
  tier: string;
  productType?: string;
  imageUrl?: string;
  notes?: string;
  featuredHome?: boolean;
  featuredMen?: boolean;
  featuredWomen?: boolean;
  featuredUnisex?: boolean;
  available?: boolean;
  rating?: number;
  ratingMedia?: { type: "image" | "video"; url: string }[];
}

export type AdminProductInput = Omit<AdminProduct, "id">;

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  status: "new" | "processing" | "completed" | "cancelled" | "order placed" | "order confirmed" | "order send" | "order recieved";
  createdAt: string;
}

export interface AdminAuthResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    name: string;
  };
}

export interface AdminOverview {
  totalProducts: number;
  totalOrders: number;
  newOrders: number;
   unreadMessages: number;
}
