import { useState } from "react";
import { Receipt, TrendingDown, Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTrackedItems } from "@/hooks/useTrackedItems";
import AuthDialog from "./AuthDialog";
import CostcoSaverLogo from "./CostcoSaverLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signOut } = useAuth();
  const { items } = useTrackedItems();
  const [authOpen, setAuthOpen] = useState(false);

  // Calculate real alert count from items with price drops
  const alertCount = items.filter(item => {
    const purchasePrice = Number(item.purchase_price);
    const currentPrice = Number(item.current_price);
    return currentPrice < purchasePrice;
  }).length;

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CostcoSaverLogo width={56} height={40} />
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">CostcoSaver</h1>
                <p className="text-xs text-muted-foreground">Smart Price Tracking</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {alertCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-savings rounded-full text-[10px] text-savings-foreground flex items-center justify-center font-bold">
                    {alertCount > 9 ? "9+" : alertCount}
                  </span>
                )}
              </Button>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline max-w-[120px] truncate">
                        {user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setAuthOpen(true)}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
};

export default Header;
