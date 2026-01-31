import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/lib/types";
import { getAdminOrders, updateAdminOrder, deleteAdminOrder } from "@/lib/api";

const AdminOrders = () => {
  const navigate = useNavigate();
  const token = typeof window !== "undefined" ? window.localStorage.getItem("adminToken") : null;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [phoneFilter, setPhoneFilter] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [token, navigate]);

  const { data, isLoading, error } = useQuery<Order[]>({
    queryKey: ["admin-orders"],
    queryFn: getAdminOrders,
    enabled: !!token,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) => updateAdminOrder(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Order updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Order deleted" });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Unable to delete order.";
      toast({
        title: "Failed to delete order",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (id: string, status: Order["status"]) => {
    updateMutation.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (!confirmed) return;
    deleteMutation.mutate(id);
  };

  const filteredOrders = Array.isArray(data)
    ? data.filter((order) => {
        if (!phoneFilter.trim()) return true;
        const phone = order.customer.phone || "";
        return phone.toLowerCase().includes(phoneFilter.trim().toLowerCase());
      })
    : [];

  const completedOrders = filteredOrders.filter((o) => o.status === "completed");
  const activeOrders = filteredOrders.filter((o) => o.status !== "completed");
  const displayedOrders = showCompleted ? completedOrders : activeOrders;

  return (
    <div className="flex min-h-screen flex-col bg-background">
     
      <CartSidebar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {showCompleted ? "Completed Orders" : "Customer Orders"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {showCompleted
                  ? "Orders that have been marked as completed."
                  : "View and manage guest checkout orders in real time."}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
              <Input
                className="w-56"
                placeholder="Search by contact number"
                value={phoneFilter}
                onChange={(e) => setPhoneFilter(e.target.value)}
              />
              <Button variant={showCompleted ? "default" : "secondary"} onClick={() => setShowCompleted((s) => !s)}>
                {showCompleted ? "View Active Orders" : `Completed Orders (${completedOrders.length})`}
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin")}>
                Back to Dashboard
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4 shadow-sm">
            {isLoading && <p className="text-sm text-muted-foreground">Loading orders…</p>}
            {error && <p className="text-sm text-destructive">Failed to load orders.</p>}
            {!isLoading && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.customer.name}</TableCell>
                        <TableCell>{order.customer.email}</TableCell>
                        <TableCell>{order.customer.phone}</TableCell>
                        <TableCell className="max-w-xs text-xs">{order.customer.address}</TableCell>
                        <TableCell className="text-xs">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 mb-1 last:mb-0">
                              {item.imageUrl && (
                                <img
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  className="h-10 w-10 rounded-md object-cover border"
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
                        </TableCell>
                        <TableCell className="text-xs">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                View Reference
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reference Code</DialogTitle>
                                <DialogDescription>This is the reference code for this order.</DialogDescription>
                              </DialogHeader>
                              <div className="mt-2 text-sm font-mono break-all">
                                {order.id}
                              </div>
                              <div className="mt-4 flex justify-end">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                                      navigator.clipboard.writeText(order.id).catch(() => {});
                                    }
                                    toast({
                                      title: "Reference code copied",
                                      description: order.id,
                                    });
                                  }}
                                >
                                  Copy Link
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell>
                          <Select value={order.status} onValueChange={(val) => handleStatusChange(order.id, val as Order["status"])}>
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                              <SelectItem value="order placed">Order Placed</SelectItem>
                              <SelectItem value="order confirmed">Order Confirmed</SelectItem>
                              <SelectItem value="order send">Order Send</SelectItem>
                              <SelectItem value="order recieved">Order Recieved</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(order.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(order.id)}
                            disabled={deleteMutation.isPending}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;
