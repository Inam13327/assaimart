import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import CartSidebar from "@/components/CartSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdminOverview, adminLogout, getAdminOrder } from "@/lib/api";
import type { AdminOverview, Order } from "@/lib/types";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = typeof window !== "undefined" ? window.localStorage.getItem("adminToken") : null;
  const [referenceSearch, setReferenceSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [token, navigate]);

  const { data, isLoading, error } = useQuery<AdminOverview>({
    queryKey: ["admin-overview"],
    queryFn: getAdminOverview,
    enabled: !!token,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: "always",
  });

  const handleLogout = async () => {
    await adminLogout();
    navigate("/admin/login");
  };

  const unreadMessages =
    !isLoading && !error && data && typeof data.unreadMessages === "number"
      ? data.unreadMessages
      : 0;

  const unreadSubscribers =
    !isLoading && !error && data && typeof data.unreadSubscribers === "number"
      ? data.unreadSubscribers
      : 0;

  const newOrdersCount =
    !isLoading && !error && data && typeof data.newOrders === "number"
      ? data.newOrders
      : 0;

  const handleSearchOrder = async () => {
    const id = referenceSearch.trim();
    if (!id) return;
    setSearching(true);
    setSearchError(null);
    setFoundOrder(null);
    try {
      const order = await getAdminOrder(id);
      setFoundOrder(order);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Order not found";
      setSearchError(message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
     
      <CartSidebar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Overview of products, categories, and guest orders.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/">Home</Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {isLoading ? "…" : error ? "-" : data?.totalProducts ?? 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {isLoading ? "…" : error ? "-" : data?.totalOrders ?? 0}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>New Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {isLoading ? "…" : error ? "-" : data?.newOrders ?? 0}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link to="/admin/products">Manage Products</Link>
            </Button>
            <Button variant="outline" asChild className="relative">
              <Link to="/admin/orders" className="flex items-center gap-2">
                <span>View Orders</span>
                {newOrdersCount > 0 && (
                  <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-semibold text-destructive-foreground">
                    {newOrdersCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="outline" asChild className="relative">
              <Link to="/admin/messages" className="flex items-center gap-2">
                <span>MESSAGES</span>
                {unreadMessages > 0 && (
                  <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-semibold text-destructive-foreground">
                    {unreadMessages}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="outline" asChild className="relative">
              <Link to="/admin/subscribers" className="flex items-center gap-2">
                <span>SUBSCRIBERS</span>
                {unreadSubscribers > 0 && (
                  <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-semibold text-destructive-foreground">
                    {unreadSubscribers}
                  </span>
                )}
              </Link>
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                className="w-56"
                placeholder="Enter reference number"
                value={referenceSearch}
                onChange={(e) => setReferenceSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchOrder();
                  }
                }}
              />
              <Button
                variant="secondary"
                disabled={!referenceSearch.trim() || searching}
                onClick={handleSearchOrder}
              >
                {searching ? "Searching…" : "Search Order"}
              </Button>
            </div>
          </div>
          {searchError && (
            <p className="mt-4 text-sm text-destructive">{searchError}</p>
          )}
          {foundOrder && (
            <div className="mt-4 rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold">Order Details</h2>
              <p className="text-sm">
                Reference: <span className="font-mono">{foundOrder.id}</span>
              </p>
              <p className="text-sm">
                Customer: {foundOrder.customer.name} ({foundOrder.customer.phone})
              </p>
              <p className="text-sm">Address: {foundOrder.customer.address}</p>
              <p className="mt-1 text-sm">Status: {foundOrder.status}</p>
              <p className="text-xs text-muted-foreground">
                Created: {new Date(foundOrder.createdAt).toLocaleString()}
              </p>
              <div className="mt-3 space-y-2 text-xs">
                {foundOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-12 w-12 rounded-md object-cover border"
                      />
                    )}
                    <div>
                      <div>
                        {item.productName} × {item.quantity}
                      </div>
                      <div>Rs {item.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
