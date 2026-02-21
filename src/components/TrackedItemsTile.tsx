import { useNavigate } from "react-router-dom";
import { TrendingDown, ChevronRight, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTrackedItems } from "@/hooks/useTrackedItems";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

const TrackedItemsTile = () => {
  const navigate = useNavigate();
  const { items, loading } = useTrackedItems();
  const { user } = useAuth();

  // Count items with price drops
  const itemsWithDrops = items.filter(item => {
    const purchasePrice = Number(item.purchase_price);
    const currentPrice = Number(item.current_price);
    return currentPrice < purchasePrice;
  }).length;

  const totalPotentialSavings = items.reduce((total, item) => {
    const purchasePrice = Number(item.purchase_price);
    const currentPrice = Number(item.current_price);
    const diff = Math.max(0, purchasePrice - currentPrice);
    return total + diff;
  }, 0);

  const handleViewItems = () => {
    navigate("/tracked-items");
  };

  if (!user) {
    return (
      <section className="animate-slide-up" style={{ animationDelay: "300ms" }}>
        <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-secondary/50 to-card"
          onClick={handleViewItems}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ShoppingCart className="w-6 h-6 text-primary" />
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  Your Tracked Items
                </h3>
              </div>
              <p className="text-base text-muted-foreground">
                Sign in to start tracking your purchases for price drops
              </p>
            </div>
            <ChevronRight className="w-6 h-6 text-primary flex-shrink-0" />
          </div>
        </Card>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="animate-slide-up" style={{ animationDelay: "300ms" }}>
        <Card className="p-8 border-0 shadow-lg">
          <div className="space-y-4">
            <Skeleton className="h-7 w-1/3" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/2 mt-4" />
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="animate-slide-up" style={{ animationDelay: "300ms" }}>
      <Card 
        className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-secondary/50 to-card"
        onClick={handleViewItems}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <ShoppingCart className="w-6 h-6 text-primary" />
              <h3 className="font-heading text-xl font-semibold text-foreground">
                Your Tracked Items
              </h3>
              <Badge variant="default" className="bg-primary/20 text-primary border-0 text-base px-3 py-1">
                {items.length}
              </Badge>
            </div>
            
            {items.length > 0 ? (
              <div className="space-y-3">
                <p className="text-base text-muted-foreground">
                  Monitoring {items.length} item{items.length !== 1 ? "s" : ""} for price changes
                </p>
                {itemsWithDrops > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-lg font-semibold text-savings">
                      <TrendingDown className="w-5 h-5" />
                      ${totalPotentialSavings.toFixed(2)} in potential refunds
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {itemsWithDrops} item{itemsWithDrops !== 1 ? "s" : ""} ready to claim
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-base text-muted-foreground">
                No items tracked yet. Upload a receipt to get started!
              </p>
            )}
          </div>
          <ChevronRight className="w-6 h-6 text-primary flex-shrink-0 ml-4" />
        </div>

        {items.length > 0 && (
          <Button 
            variant="default" 
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary font-semibold text-base shadow-md hover:shadow-lg transition-all"
          >
            View All Items
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </Card>
    </section>
  );
};

export default TrackedItemsTile;
