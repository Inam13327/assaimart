import type { AdminAuthResponse, AdminOverview, AdminProduct, AdminProductInput, Order, Product } from "./types";

const API_BASE = import.meta.env.PROD 
  ? "https://assaimartofficial.vercel.app/api" 
  : "http://localhost:4000/api";

function logApiError(details: { method: string; path: string; status?: number; message?: string; error?: unknown }) {
  // Always log errors to console for visibility
  console.error("[API ERROR]", details);
}

async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const token = typeof window !== "undefined" ? window.localStorage.getItem("adminToken") : null;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  try {
    const method = options.method || "GET";
    const fullPath = `${API_BASE}${path}`;
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
    const text = await res.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    if (!res.ok) {
      const errorMessage =
        typeof data === "object" && data !== null && "error" in data && typeof (data as { error: unknown }).error === "string"
          ? (data as { error: string }).error
          : typeof data === "object" && data !== null && "message" in data && typeof (data as { message: unknown }).message === "string"
            ? (data as { message: string }).message
            : res.statusText;
      logApiError({
        method,
        path: fullPath,
        status: res.status,
        message: errorMessage,
      });
      throw new Error(errorMessage);
    }
    return data as T;
  } catch (error) {
    const method = options.method || "GET";
    const fullPath = `${API_BASE}${path}`;
    logApiError({
      method,
      path: fullPath,
      error,
    });
    throw error;
  }
}

interface RawProduct {
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
  image?: string;
  notes?: string | { top: string[]; heart: string[]; base: string[] };
  available?: boolean;
  featuredHome?: boolean;
  rating?: number;
  ratingMedia?: { type: "image" | "video"; url: string }[];
}

function transformProduct(p: RawProduct): Product {
  const category: Product["category"] =
    p.segment === "men" || p.segment === "women" || p.segment === "unisex" ? (p.segment as Product["category"]) : "unisex";
  return {
    ...p,
    image: p.imageUrl || p.image || "",
    category,
    notes: typeof p.notes === "string" 
      ? { top: p.notes.split(",").map((s) => s.trim()), heart: [], base: [] } 
      : p.notes || { top: [], heart: [], base: [] },
    inStock: p.available !== false,
    featured: p.featuredHome,
    bestseller: false,
    rating: p.rating,
    ratingMedia: p.ratingMedia || [],
  };
}

export function getCategories() {
  return request("/categories");
}

export function getProducts(params?: { category?: string; segment?: string; tier?: string; q?: string; featured?: boolean; productType?: string }) {
  const search = new URLSearchParams();
  if (params) {
    if (params.category) search.set("category", params.category);
    if (params.segment) search.set("segment", params.segment);
    if (params.tier) search.set("tier", params.tier);
    if (params.featured) search.set("featured", "true");
    if (params.q) search.set("q", params.q);
    if (params.productType) search.set("productType", params.productType);
  }
  const suffix = search.toString() ? `?${search.toString()}` : "";
  return request<RawProduct[]>(`/products${suffix}`).then((items) => items.map(transformProduct));
}

export function getProductTypes() {
  return request<RawProduct[]>("/products").then((items) => {
    const types = new Set<string>();
    for (const item of items) {
      if (item.available === false) continue;
      const type = item.productType || "Perfume";
      types.add(type);
    }
    const result = Array.from(types);
    if (result.length === 0) {
      result.push("Perfume");
    }
    return result;
  });
}

export function getProduct(id: string) {
  return request<RawProduct>(`/products/${id}`).then(transformProduct);
}

export function sendContactMessage(payload: { name: string; email: string; subject: string; message: string }) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function subscribeNewsletter(email: string) {
  return request("/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function checkout(payload: {
  items: { productId: string; name: string; quantity: number; price: number; imageUrl?: string }[];
  customer: { name: string; phone: string; address: string };
}) {
  return request<{ orderId: string }>("/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getOrder(id: string) {
  return request<Order>(`/orders/${id}`);
}

export function adminLogin(email: string, password: string) {
  return request<AdminAuthResponse>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }).then((data) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("adminToken", data.token);
      window.localStorage.setItem("adminUser", JSON.stringify(data.admin));
    }
    return data;
  });
}

export function adminLogout() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("adminToken");
    window.localStorage.removeItem("adminUser");
  }
  return request("/admin/logout", { method: "POST" }).catch(() => {});
}

export function resetAdminPassword(password: string) {
  return request("/admin/reset-password", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export function getAdminOverview() {
  return request<AdminOverview>("/admin/overview");
}

export function getAdminProducts() {
  return request<AdminProduct[]>("/admin/products");
}

export function createAdminProduct(payload: AdminProductInput) {
  return request<AdminProduct>("/admin/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminProduct(id: string, payload: Partial<AdminProductInput>) {
  return request<AdminProduct>(`/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminProduct(id: string) {
  return request(`/admin/products/${id}`, {
    method: "DELETE",
  });
}

export function getAdminOrders() {
  return request<Order[]>("/admin/orders");
}

export function getAdminOrder(id: string) {
  return request<Order>(`/admin/orders/${id}`);
}

export function updateAdminOrder(id: string, payload: Pick<Order, "status">) {
  return request<Order>(`/admin/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminOrder(id: string) {
  return request(`/admin/orders/${id}`, {
    method: "DELETE",
  });
}

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
  read?: boolean;
}

export function getAdminMessages() {
  return request<AdminMessage[]>("/admin/messages");
}

export function markAdminMessagesRead() {
  return request<{ success: boolean }>("/admin/messages/mark-read", {
    method: "POST",
  });
}

export function deleteAdminMessage(id: string) {
  return request(`/admin/messages/${id}`, {
    method: "DELETE",
  });
}

export function getAdminSubscribers() {
  return request<Subscriber[]>("/admin/subscribers");
}

export function markAdminSubscribersRead() {
  return request<{ success: boolean }>("/admin/subscribers/mark-read", {
    method: "POST",
  });
}

export function deleteAdminSubscriber(id: string) {
  return request<{ id: string }>(`/admin/subscribers/${id}`, {
    method: "DELETE",
  });
}
