import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Receipt, TrendingDown, Bell, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTrackedItems } from "@/hooks/useTrackedItems";
import AuthDialog from "./AuthDialog";
import CostSaverLogo from "./CostSaverLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();
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
      <header
        className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              <CostSaverLogo width={44} height={32} className="shrink-0 sm:h-10 sm:w-14" />
              <div className="min-w-0">
                <h1 className="truncate font-heading text-lg font-bold leading-none text-foreground sm:text-xl">
                  Cost Saver
                </h1>
                <p className="hidden text-[11px] text-muted-foreground min-[360px]:block">
                  Smart Price Tracking
                </p>
              </div>
            </div>
            
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
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
                    <DropdownMenuItem 
                      onClick={() => navigate("/settings")} 
                      className="cursor-pointer"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" size="sm" className="px-3 sm:px-4" onClick={() => setAuthOpen(true)}>
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
