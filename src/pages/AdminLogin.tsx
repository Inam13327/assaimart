import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { adminLogin, resetAdminPassword } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Reset password state
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetStep, setResetStep] = useState<"verification" | "new_password">("verification");
  const [verificationAnswer, setVerificationAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await adminLogin(email, password);
      toast({
        title: "Welcome back",
        description: "You are now logged in as admin.",
      });
      navigate("/admin");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Check your credentials and try again.";
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => {
    const value = verificationAnswer.trim();
    if (value === "Lenovopc123#") {
      setResetStep("new_password");
      setResetError("");
    } else {
      setResetError("Incorrect reset password. Please try again.");
    }
  };

  const handleResetSubmit = async () => {
    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters.");
      return;
    }
    try {
      await resetAdminPassword(newPassword);
      setResetSuccess("Password reset successfully. You can now login.");
      setTimeout(() => {
        setIsResetOpen(false);
        setResetStep("verification");
        setVerificationAnswer("");
        setNewPassword("");
        setResetSuccess("");
      }, 2000);
    } catch (err) {
       setResetError("Failed to reset password. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CartSidebar />
      <main className="flex-1">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-16">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight">Admin Portal</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Secure access to manage products, orders, and homepage content.
          </p>
          <form onSubmit={handleSubmit} className="w-full space-y-4 rounded-lg border bg-card p-6 shadow-sm">
            <Button 
              type="button" 
              variant="destructive" 
              className="w-full mb-4" 
              onClick={() => setIsResetOpen(true)}
            >
              Reset Password
            </Button>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            For this demo, a default admin account is preconfigured.
          </p>
        </div>
      </main>

      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Admin Password</DialogTitle>
            <DialogDescription>
              {resetStep === "verification"
                ? "Please verify your identity to reset your password."
                : "Enter your new password."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {resetStep === "verification" ? (
              <div className="space-y-2">
                <Label htmlFor="verification">Enter reset password</Label>
                <Input
                  id="verification"
                  type="password"
                  value={verificationAnswer}
                  onChange={(e) => setVerificationAnswer(e.target.value)}
                  placeholder="Enter reset password"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
            )}
            
            {resetError && (
              <p className="mt-2 text-sm text-destructive font-medium">{resetError}</p>
            )}
            {resetSuccess && (
              <p className="mt-2 text-sm text-green-600 font-medium">{resetSuccess}</p>
            )}
          </div>

          <DialogFooter>
            {resetStep === "verification" ? (
              <Button onClick={handleVerify}>Verify</Button>
            ) : (
              <Button onClick={handleResetSubmit}>Set New Password</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLogin;
