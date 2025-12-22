import { Receipt, TrendingDown, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-card">
              <TrendingDown className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">PriceDrop</h1>
              <p className="text-xs text-muted-foreground">Costco Savings Tracker</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-savings rounded-full text-[10px] text-savings-foreground flex items-center justify-center font-bold">
                3
              </span>
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
              <Receipt className="w-4 h-4" />
              Upload Receipt
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
