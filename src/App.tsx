import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import TrackedItemsPage from "./pages/TrackedItemsPage";
import AccountSettings from "./pages/AccountSettings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import { registerPushNotifications, isPushNotificationsAvailable } from "@/lib/pushNotifications";
import { registerNativeAuthCallbackListener } from "@/lib/native";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    let removeAuthListener: (() => void) | undefined;

    void registerNativeAuthCallbackListener().then((cleanup) => {
      removeAuthListener = cleanup;
    });

    // Register for push notifications on native platforms
    if (isPushNotificationsAvailable()) {
      void registerPushNotifications();
    }

    return () => {
      removeAuthListener?.();
    };
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tracked-items" element={<TrackedItemsPage />} />
            <Route path="/settings" element={<AccountSettings />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
