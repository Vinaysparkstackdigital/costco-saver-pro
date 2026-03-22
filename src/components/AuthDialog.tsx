import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const { signIn, signUp, signInWithApple, signInWithGoogle, signInWithFacebook } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password);

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: isSignUp ? "Account created!" : "Welcome back!",
        description: isSignUp 
          ? "You can now start tracking price drops."
          : "Your tracked items are ready.",
      });
      onOpenChange(false);
      setEmail("");
      setPassword("");
    }
  };

  const handleSocialLogin = async (provider: 'apple' | 'google' | 'facebook') => {
    setSocialLoading(provider);
    try {
      if (provider === 'apple') {
        await signInWithApple();
      } else if (provider === 'google') {
        await signInWithGoogle();
      } else if (provider === 'facebook') {
        await signInWithFacebook();
      }
      toast({
        title: "Redirecting...",
        description: `Signing in with ${provider}...`,
      });
      onOpenChange(false);
    } catch (error: any) {
      setSocialLoading(null);
      toast({
        title: "Error",
        description: error.message || `Failed to sign in with ${provider}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-center">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        <div className="relative my-6">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-background px-2 text-xs text-muted-foreground font-medium">
              Or log in with
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            onClick={() => handleSocialLogin('apple')}
            disabled={loading || socialLoading !== null}
            className="w-full bg-black text-white hover:bg-black/90"
          >
            {socialLoading === 'apple' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19.67 16.2c-.28.65-.62 1.25-1.04 1.82-.57.77-1.04 1.31-1.43 1.61-.59.5-1.22.76-1.9.78-.49 0-1.08-.14-1.77-.42-.69-.28-1.32-.42-1.9-.42-.61 0-1.27.14-1.97.42-.7.28-1.26.43-1.69.45-.65.03-1.3-.24-1.95-.8-.41-.35-.91-.91-1.49-1.68-.62-.82-1.12-1.77-1.51-2.86-.42-1.17-.63-2.3-.63-3.4 0-1.26.27-2.34.82-3.24.43-.72 1.01-1.29 1.73-1.71.72-.42 1.5-.64 2.33-.66.52 0 1.2.16 2.04.48.84.32 1.38.48 1.62.48.18 0 .79-.19 1.82-.57.98-.35 1.8-.49 2.46-.42 1.78.14 3.11.84 4 2.09-1.59.96-2.37 2.3-2.35 4 .02 1.32.49 2.42 1.42 3.3.42.41.9.72 1.42.93-.11.31-.23.61-.37.9ZM15.27 1.98c0 1.03-.38 1.99-1.13 2.87-.91 1.05-2.01 1.66-3.2 1.56-.02-.12-.03-.25-.03-.38 0-.99.43-2.05 1.19-2.9.38-.43.87-.79 1.45-1.07.58-.28 1.13-.43 1.65-.46.05.13.07.26.07.38Z" />
              </svg>
            )}
            Sign in with Apple
          </Button>

          <div className="flex justify-center gap-6">
            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading || socialLoading !== null}
              className="w-14 h-14 rounded-full bg-[#1877F2] hover:bg-[#166FE5] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              title="Sign in with Facebook"
            >
              {socialLoading === 'facebook' ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={loading || socialLoading !== null}
              className="w-14 h-14 rounded-full bg-[#EA4335] hover:bg-[#D33425] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              title="Sign in with Google"
            >
              {socialLoading === 'google' ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline font-medium"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
