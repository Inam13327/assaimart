import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getAdminMessages, markAdminMessagesRead, deleteAdminMessage, type AdminMessage } from "@/lib/api";

const AdminMessages = () => {
  const navigate = useNavigate();
  const token = typeof window !== "undefined" ? window.localStorage.getItem("adminToken") : null;
  const { toast } = useToast();
  const [emailFilter, setEmailFilter] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [token, navigate]);

  const { data, isLoading, error } = useQuery<AdminMessage[]>({
    queryKey: ["admin-messages"],
    queryFn: getAdminMessages,
    enabled: !!token,
    retry: 1,
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Unable to load messages.";
      toast({
        title: "Failed to load messages",
        description: message,
        variant: "destructive",
      });
    },
  });

  const threads = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    const filtered = !emailFilter.trim()
      ? list
      : list.filter((m) => m.email.toLowerCase().includes(emailFilter.trim().toLowerCase()));
    const map = new Map<string, AdminMessage[]>();
    for (const m of filtered) {
      const key = m.email;
      const existing = map.get(key) || [];
      existing.push(m);
      map.set(key, existing);
    }
    const result = Array.from(map.entries()).map(([email, items]) => {
      const sorted = items
        .slice()
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      const last = sorted[sorted.length - 1];
      return {
        email,
        messages: sorted,
        last,
      };
    });
    result.sort(
      (a, b) =>
        new Date(b.last.createdAt).getTime() - new Date(a.last.createdAt).getTime()
    );
    return result;
  }, [data, emailFilter]);

  useEffect(() => {
    if (!Array.isArray(data) || !data.length) {
      return;
    }
    const hasUnread = data.some((m) => !m.read);
    if (!hasUnread) {
      return;
    }
    let cancelled = false;
    const markRead = async () => {
      try {
        await markAdminMessagesRead();
        if (cancelled) {
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
        queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unable to update message status.";
        toast({
          title: "Failed to mark messages as read",
          description: message,
          variant: "destructive",
        });
      }
    };
    markRead();
    return () => {
      cancelled = true;
    };
  }, [data, queryClient, toast]);

  useEffect(() => {
    if (!threads.length) {
      setSelectedEmail(null);
      return;
    }
    if (!selectedEmail || !threads.some((t) => t.email === selectedEmail)) {
      setSelectedEmail(threads[0].email);
    }
  }, [threads, selectedEmail]);

  const selectedThread =
    threads.find((t) => t.email === selectedEmail) || null;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      toast({ title: "Message deleted" });
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Unable to delete message.";
      toast({
        title: "Failed to delete message",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteMessage = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this message?");
    if (!confirmed) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CartSidebar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Messages</h1>
              <p className="text-sm text-muted-foreground">
                View and search customer messages sent via the contact form.
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/admin")}>
              Back to Dashboard
            </Button>
          </div>

          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <Input
                  className="w-64"
                  placeholder="Search by email"
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {threads.length > 0
                  ? `${threads.length} conversation${threads.length === 1 ? "" : "s"}`
                  : "No messages yet"}
              </p>
            </div>

            {isLoading && <p className="text-sm text-muted-foreground">Loading messages…</p>}
            {error && !isLoading && (
              <p className="text-sm text-destructive">Failed to load messages.</p>
            )}

                {!isLoading && !error && (
              <div className="grid gap-4 md:grid-cols-[1.1fr,1.9fr]">
                <div className="space-y-2 border-r pr-2">
                  <div className="max-h-[420px] space-y-1 overflow-y-auto pr-1">
                    {threads.map((thread) => (
                      <button
                        key={thread.email}
                        type="button"
                        onClick={() => setSelectedEmail(thread.email)}
                        className={`flex w-full flex-col items-start rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                          thread.email === selectedEmail
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/40 hover:bg-muted"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="font-medium truncate">
                            {thread.email}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(thread.last.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-1 flex w-full items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground truncate">
                            {thread.last.subject}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {thread.last.name}
                          </span>
                        </div>
                      </button>
                    ))}
                    {!threads.length && (
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        No messages found for this filter.
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  {selectedThread ? (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                        <div>
                          <p className="text-sm font-semibold">
                            Conversation with {selectedThread.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedThread.messages[0]?.name} &lt;
                            {selectedThread.email}&gt;
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Latest:{" "}
                          {new Date(
                            selectedThread.last.createdAt
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="max-h-[360px] overflow-y-auto rounded-md bg-muted px-4 py-3 text-sm leading-relaxed space-y-3">
                        {selectedThread.messages.map((m) => (
                          <div key={m.id} className="rounded-md bg-background px-3 py-2 shadow-sm">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-medium">
                                {m.subject}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-muted-foreground">
                                  {new Date(m.createdAt).toLocaleString()}
                                </span>
                                <Button
                                  variant="destructive"
                                  size="xs"
                                  onClick={() => handleDeleteMessage(m.id)}
                                  disabled={deleteMutation.isPending}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                            <p className="whitespace-pre-wrap text-xs">
                              {m.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full min-h-[260px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                      Select a conversation to view messages.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMessages;
