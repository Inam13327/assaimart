import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct } from "@/lib/api";
import { AdminProduct, AdminProductInput } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const emptyForm = {
  id: "",
  name: "",
  brand: "ASSAIMART",
  description: "",
  price: "",
  originalPrice: "",
  size: "100ml",
  categorySlug: "",
  segment: "",
  tier: "",
  productType: "",
  imageUrl: "",
  notes: "",
  featuredHome: false,
  bestseller: false,
  available: true,
  rating: "",
  ratingMedia: [] as { type: "image" | "video"; url: string }[],
};

const AdminProducts = () => {
  const navigate = useNavigate();
  const token = typeof window !== "undefined" ? window.localStorage.getItem("adminToken") : null;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [step, setStep] = useState(1);
  const [ratingMediaType, setRatingMediaType] = useState<"image" | "video">("image");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [token, navigate]);

  const { data, isLoading, error } = useQuery<AdminProduct[]>({
    queryKey: ["admin-products"],
    queryFn: getAdminProducts,
    enabled: !!token,
  });

  // Get unique product types from existing products, default to ["Perfume"]
  const existingProductTypes = Array.from(new Set(
    (Array.isArray(data) ? data : []).map((p) => p.productType).filter(Boolean) as string[]
  ));
  if (existingProductTypes.length === 0) existingProductTypes.push("Perfume");
  
  // Combine with a default "Sleeper" if not present, for user convenience as requested
  if (!existingProductTypes.includes("Sleeper")) existingProductTypes.push("Sleeper");
  if (!existingProductTypes.includes("Perfume")) existingProductTypes.push("Perfume");
  // Ensure current form value is in the list so Select can display it
  if (form.productType && !existingProductTypes.includes(form.productType)) {
    existingProductTypes.push(form.productType);
  }

  const createMutation = useMutation({
    mutationFn: (payload: AdminProductInput) => createAdminProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setForm(emptyForm);
      setStep(1);
      toast({ title: "Product created" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AdminProductInput> }) => updateAdminProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setForm(emptyForm);
      setStep(1);
      toast({ title: "Product updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product deleted" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: AdminProductInput = {
      name: form.name,
      brand: form.brand,
      description: form.description,
      price: Number(form.price) || 0,
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      size: form.size,
      categorySlug: form.categorySlug,
      segment: form.segment,
      tier: form.tier,
      productType: form.productType,
      imageUrl: form.imageUrl,
      notes: form.notes,
      featuredHome: form.featuredHome,
      available: form.available,
      rating: form.rating ? Number(form.rating) : undefined,
      ratingMedia: form.ratingMedia,
    };
    if (form.id) {
      updateMutation.mutate({ id: form.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (product: AdminProduct) => {
    setForm({
      id: product.id,
      name: product.name,
      brand: product.brand || "ASSAIMART",
      description: product.description,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      size: product.size || "100ml",
      categorySlug: product.categorySlug,
      segment: product.segment,
      tier: product.tier,
      productType: product.productType || "Perfume",
      imageUrl: product.imageUrl || "",
      notes: product.notes || "",
      featuredHome: Boolean(product.featuredHome),
      available: product.available !== false,
      rating: typeof product.rating === "number" ? String(product.rating) : "",
      ratingMedia: Array.isArray(product.ratingMedia)
        ? product.ratingMedia
        : [],
    });
    setStep(2);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleImageFileChange = (file: File | null) => {
    if (!file) return;

    // Resize image logic
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Max width/height
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Use original file type (to preserve transparency for PNGs)
        // Quality param (0.8) works for JPEG/WebP, ignored for PNG
        const dataUrl = canvas.toDataURL(file.type || "image/jpeg", 0.8);
        
        setForm((prev) => ({
          ...prev,
          imageUrl: dataUrl,
        }));
      };
      if (typeof event.target?.result === "string") {
         img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNextStep = () => {
    if (!form.segment || !form.tier || !form.productType) {
      toast({
        title: "Selection Required",
        description: "Please select product type, segment, and tier.",
        variant: "destructive",
      });
      return;
    }
    // Set categorySlug same as tier as per existing data structure seems to imply
    setForm({ ...form, categorySlug: form.tier }); 
    setStep(2);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
   
      <CartSidebar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Manage Products</h1>
              <p className="text-sm text-muted-foreground">
                Add, edit, or remove products and control homepage visibility.
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/admin")}>
              Back to Dashboard
            </Button>
          </div>

          {step === 1 ? (
            <div className="mb-10 max-w-md mx-auto rounded-lg border bg-card p-8 shadow-sm text-center space-y-6">
              <h2 className="text-xl font-semibold">{form.id ? "Update Category & Type" : "Step 1: Select Product Category"}</h2>
              <div className="space-y-4 text-left">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Type</label>
                  <div className="flex gap-2">
                    <Select
                      value={form.productType}
                      onValueChange={(val) => setForm({ ...form, productType: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Product Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {existingProductTypes.map((type: string) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input 
                      placeholder="Or type new..." 
                      className="w-1/2"
                      onChange={(e) => setForm({...form, productType: e.target.value})}
                      value={form.productType}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Segment</label>
                  <Select
                    value={form.segment}
                    onValueChange={(val) => setForm({ ...form, segment: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Segment" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.slug} value={c.slug}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tier</label>
                  <Select
                    value={form.tier}
                    onValueChange={(val) => setForm({ ...form, tier: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiers.map((t) => (
                        <SelectItem key={t.slug} value={t.slug}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3">
                {form.id && (
                   <Button variant="outline" className="w-full" onClick={() => setStep(2)}>
                     Cancel
                   </Button>
                )}
                <Button className="w-full" onClick={handleNextStep}>
                  {form.id ? "Update & Continue" : "Next: Product Details"}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mb-10 grid gap-4 rounded-lg border bg-card p-6 shadow-sm md:grid-cols-2">
              <div className="md:col-span-2 mb-4 flex items-center justify-between border-b pb-4">
                <h3 className="text-lg font-medium">
                  {form.id ? "Edit Product" : `New ${form.productType} - ${form.segment} - ${form.tier}`}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setStep(1)} type="button">
                  Change Category/Type
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Product Type</label>
                <Input value={form.productType} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Original Price (optional)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <Input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="100ml" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Tier</label>
                <Select
                  value={form.tier}
                  onValueChange={(val) => setForm({ ...form, tier: val, categorySlug: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiers.map((t) => (
                      <SelectItem key={t.slug} value={t.slug}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Segment</label>
                <Select
                  value={form.segment}
                  onValueChange={(val) => setForm({ ...form, segment: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">
                  {form.productType === "Perfume" ? "Fragrance Notes" : "Key Details / Notes"}
                </label>
                <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Product Image</label>
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleImageFileChange(file);
                      e.target.value = "";
                    }}
                  />
                  <Input
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="Or paste image URL (optional)"
                  />
                </div>
                {form.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="h-24 w-24 rounded-md object-cover border"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Rating</label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  placeholder="0 - 5"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Rating Media Type</label>
                    <Select
                      value={ratingMediaType}
                      onValueChange={(val) => setRatingMediaType(val as "image" | "video")}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Upload {ratingMediaType === "video" ? "Video" : "Image"}</label>
                    <Input
                      type="file"
                      accept={ratingMediaType === "video" ? "video/*" : "image/*"}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          const result = reader.result;
                          if (typeof result !== "string") return;
                          setForm((prev) => ({
                            ...prev,
                            ratingMedia: [
                              ...(prev.ratingMedia || []),
                              { type: ratingMediaType, url: result },
                            ],
                          }));
                        };
                        reader.readAsDataURL(file);
                        e.target.value = "";
                      }}
                    />
                  </div>
                </div>
                {form.ratingMedia.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {form.ratingMedia.map((m, idx) => (
                      <div key={idx} className="relative rounded-lg overflow-hidden border border-border">
                        {m.type === "video" ? (
                          <video src={m.url} className="w-full h-full" controls />
                        ) : (
                          <img src={m.url} alt={`rating media ${idx + 1}`} className="w-full h-full object-cover" />
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 px-2 text-xs"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              ratingMedia: prev.ratingMedia.filter((_, i) => i !== idx),
                            }))
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={form.featuredHome}
                  onCheckedChange={(val) => setForm({ ...form, featuredHome: Boolean(val) })}
                />
                <span className="text-sm">Featured on homepage</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bestseller"
                  checked={form.bestseller}
                  onCheckedChange={(checked) => setForm({ ...form, bestseller: checked as boolean })}
                />
                <label
                  htmlFor="bestseller"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Bestseller
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={form.available}
                  onCheckedChange={(checked) => setForm({ ...form, available: checked as boolean })}
                />
                <label
                  htmlFor="available"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Available / In Stock
                </label>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => { setForm(emptyForm); setStep(1); }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {form.id ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </form>
          )}

          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold">Product Inventory</h2>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 flex-wrap h-auto">
                <TabsTrigger value="all">All Products</TabsTrigger>
                {existingProductTypes.map((type: string) => (
                  <TabsTrigger key={type} value={type}>{type}s</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {isLoading && <p className="text-sm text-muted-foreground">Loading products...</p>}
            {error && <p className="text-sm text-destructive">Failed to load products.</p>}
            
            {!isLoading && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(data) && data
                    .filter((p) => {
                      const productType = p.productType || "Perfume";
                      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                            (p.brand || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            productType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            (p.segment || "").toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesTab = activeTab === "all" || productType === activeTab;
                      return matchesSearch && matchesTab;
                    })
                    .map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="h-10 w-10 rounded-md object-cover" />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-secondary/50" />
                          )}
                        </TableCell>
                        <TableCell>{p.productType || "Perfume"}</TableCell>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.brand}</TableCell>
                        <TableCell>Rs {p.price.toFixed(2)}</TableCell>
                        <TableCell>{p.size || "-"}</TableCell>
                        <TableCell className="max-w-[150px] truncate" title={typeof p.notes === 'object' ? JSON.stringify(p.notes) : p.notes}>
                          {typeof p.notes === 'object' ? "Complex Notes" : (p.notes || "-")}
                        </TableCell>
                        <TableCell>{p.tier}</TableCell>
                        <TableCell className="capitalize">{p.segment}</TableCell>
                        <TableCell className="space-x-2">
                          <span>{typeof p.rating === "number" ? `${p.rating.toFixed(1)}` : "-"}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(p)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              updateMutation.mutate({
                                id: p.id,
                                payload: { rating: undefined, ratingMedia: [] },
                              })
                            }
                          >
                            Delete
                          </Button>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(p.id)}
                            disabled={deleteMutation.isPending}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {Array.isArray(data) && data.filter((p) => {
                      const productType = p.productType || "Perfume";
                      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                            (p.brand || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            productType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            (p.segment || "").toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesTab = activeTab === "all" || productType === activeTab;
                      return matchesSearch && matchesTab;
                  }).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                        No products found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProducts;
