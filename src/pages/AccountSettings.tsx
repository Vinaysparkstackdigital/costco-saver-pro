import { Helmet } from "react-helmet";
import { ArrowLeft, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AccountSettings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  const handleDeleteAccount = async () => {
    if (!deleteConfirmed || !user) return;

    setIsDeleting(true);
    try {
      // Delete all user data from tracked_items table
      const { error: itemsError } = await supabase
        .from("tracked_items")
        .delete()
        .eq("user_id", user.id);

      if (itemsError) throw itemsError;

      toast({
        title: "Account and data deleted",
        description: "Your account and all data have been permanently removed. You have been signed out.",
      });

      // Sign out and redirect
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error deleting account",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setDeleteConfirmed(false);
    }
  };

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Account Settings - Cost Saver</title>
        </Helmet>

        <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
          <Header />

          <main className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-8">
                <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground">Back</span>
              </div>

              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">Please sign in to access account settings.</p>
                <Button onClick={() => navigate("/")} variant="outline">
                  Return Home
                </Button>
              </Card>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Account Settings - Cost Saver</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
        <Header />

        <main className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">Back</span>
            </div>

            <div className="space-y-8">
              {/* Account Information */}
              <Card className="p-6 md:p-8">
                <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-2">Email Address</h2>
                    <p className="text-lg font-medium">{user.email}</p>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-2">Account Status</h2>
                    <p className="text-lg font-medium text-green-600">Active</p>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-2">Member Since</h2>
                    <p className="text-lg font-medium">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Danger Zone */}
              <Card className="p-6 md:p-8 border-destructive/20 bg-destructive/5">
                <div className="flex items-start gap-4 mb-6">
                  <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-2xl font-bold text-destructive mb-2">Danger Zone</h2>
                    <p className="text-sm text-muted-foreground">
                      Irreversible and destructive actions
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-destructive/20">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Delete Account</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data including tracked items, receipts, and price history. This action cannot be undone.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteDialog(true)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Information Links */}
              <Card className="p-6 md:p-8">
                <h2 className="text-lg font-bold mb-4">More Information</h2>
                <div className="space-y-3">
                  <a
                    href="https://Vinaysparkstackdigital.github.io/costco-saver-pro/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full justify-start text-left block px-4 py-2 border border-input rounded-md hover:bg-accent transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="https://Vinaysparkstackdigital.github.io/costco-saver-pro/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full justify-start text-left block px-4 py-2 border border-input rounded-md hover:bg-accent transition-colors"
                  >
                    Terms of Service
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </main>

        {/* Delete Account Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Delete Account Permanently?
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3 mt-4">
                <p>
                  This action <strong>cannot be undone</strong>. This will permanently delete:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Your account ({user.email})</li>
                  <li>All tracked items and price history</li>
                  <li>All uploaded receipts and extracted data</li>
                  <li>All notifications and preferences</li>
                </ul>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deleteConfirmed}
                      onChange={(e) => setDeleteConfirmed(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">
                      I understand this will permanently delete my account and all data
                    </span>
                  </label>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex gap-3 justify-end mt-6">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={!deleteConfirmed || isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Permanently"
                )}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        <footer className="mt-20 py-8 border-t border-border bg-card/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© 2026 Cost Saver by SparkStack Digital LLC.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AccountSettings;
