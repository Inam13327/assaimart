import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAdminSubscribers, markAdminSubscribersRead, type Subscriber } from "@/lib/api";

const AdminSubscribers = () => {
  const navigate = useNavigate();
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("adminToken")
      : null;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    } else {
      // Mark as read when page loads
      markAdminSubscribersRead()
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
        })
        .catch((err) => console.error("Failed to mark subscribers read", err));
    }
  }, [token, navigate, queryClient]);

  const { data, isLoading, error } = useQuery<Subscriber[]>({
    queryKey: ["admin-subscribers"],
    queryFn: getAdminSubscribers,
    enabled: !!token,
    retry: 1,
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Unable to load subscribers.";
      toast({
        title: "Failed to load subscribers",
        description: message,
        variant: "destructive",
      });
    },
  });

  const subscribers = Array.isArray(data) ? data : [];

  const handleCopyEmails = async () => {
    if (!subscribers.length) {
      toast({
        title: "No subscribers to copy",
        variant: "destructive",
      });
      return;
    }
    const value = subscribers.map((s) => s.email).join(",");
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(value);
        toast({
          title: "Emails copied",
          description: "All subscriber emails have been copied.",
        });
      } else {
        throw new Error("Clipboard not available");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to copy to clipboard.";
      toast({
        title: "Failed to copy emails",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CartSidebar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Subscribers ({subscribers.length})
              </h1>
              <p className="text-sm text-muted-foreground">
                View all newsletter subscribers and copy their emails.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopyEmails}>
                Copy Emails
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin")}>
                Back to Dashboard
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4 shadow-sm">
            {isLoading && (
              <p className="text-sm text-muted-foreground">
                Loading subscribers…
              </p>
            )}
            {error && !isLoading && (
              <p className="text-sm text-destructive">
                Failed to load subscribers.
              </p>
            )}
            {!isLoading && !error && (
              <div className="space-y-2">
                {subscribers.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No subscribers yet.
                  </p>
                )}
                {subscribers.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b text-xs text-muted-foreground">
                          <th className="py-2 pr-4">Email</th>
                          <th className="py-2">Subscribed At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((s) => (
                          <tr key={s.id} className="border-b last:border-0">
                            <td className="py-2 pr-4">{s.email}</td>
                            <td className="py-2 text-xs text-muted-foreground">
                              {new Date(s.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSubscribers;

