import { useState } from "react";
import { TrendingDown, TrendingUp, Minus, ExternalLink, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTrackedItems } from "@/hooks/useTrackedItems";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { checkItemPrice } from "@/lib/priceChecker";
import { useToast } from "@/hooks/use-toast";

const TrackedItems = () => {
  const { items, loading, deleteItem, updateCurrentPrice } = useTrackedItems();
  const { user } = useAuth();
  const { toast } = useToast();
  const [checkingPrices, setCheckingPrices] = useState(false);
  const [checkingItemId, setCheckingItemId] = useState<string | null>(null);

  const getPriceChange = (purchase: number, current: number) => {
    const diff = purchase - current;
    const percent = ((diff / purchase) * 100).toFixed(1);
    return { diff, percent };
  };

  const getDaysLeft = (purchaseDate: string) => {
    const purchase = new Date(purchaseDate);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - daysSince);
  };

  const getStatusInfo = (purchase: number, current: number) => {
    if (current < purchase) {
      return {
        icon: TrendingDown,
        color: "text-savings",
        bg: "bg-savings/10",
        label: "Price Drop",
        badgeVariant: "default" as const,
      };
    } else if (current > purchase) {
      return {
        icon: TrendingUp,
        color: "text-destructive",
        bg: "bg-destructive/10",
        label: "Price Up",
        badgeVariant: "destructive" as const,
      };
    }
    return {
      icon: Minus,
      color: "text-muted-foreground",
      bg: "bg-secondary",
      label: "No Change",
      badgeVariant: "secondary" as const,
    };
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCheckSinglePrice = async (itemId: string, itemName: string, itemNumber: string | null) => {
    setCheckingItemId(itemId);
    try {
      const result = await checkItemPrice(itemName, itemNumber ?? undefined);
      
      if (result.success && result.currentPrice) {
        await updateCurrentPrice(itemId, result.currentPrice);
        toast({
          title: "Price updated",
          description: `Found current price: $${result.currentPrice.toFixed(2)}`,
        });
      } else {
        toast({
          title: "Could not find price",
          description: result.error || "Product not found online",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check price",
        variant: "destructive",
      });
    } finally {
      setCheckingItemId(null);
    }
  };

  const handleCheckAllPrices = async () => {
    if (items.length === 0) return;
    
    setCheckingPrices(true);
    let updatedCount = 0;
    let priceDropCount = 0;

    for (const item of items) {
      setCheckingItemId(item.id);
      try {
        const result = await checkItemPrice(item.item_name, item.item_number ?? undefined);
        
        if (result.success && result.currentPrice) {
          const oldPrice = Number(item.current_price);
          await updateCurrentPrice(item.id, result.currentPrice);
          updatedCount++;
          
          if (result.currentPrice < Number(item.purchase_price)) {
            priceDropCount++;
          }
        }
        
        // Delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error checking price for", item.item_name, error);
      }
    }

    setCheckingItemId(null);
    setCheckingPrices(false);

    if (priceDropCount > 0) {
      toast({
        title: "Price drops found!",
        description: `${priceDropCount} item(s) have dropped in price. Claim your refund!`,
      });
    } else if (updatedCount > 0) {
      toast({
        title: "Prices updated",
        description: `Updated ${updatedCount} of ${items.length} items`,
      });
    } else {
      toast({
        title: "No prices found",
        description: "Could not find current prices online",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <section className="animate-slide-up" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Tracked Items
          </h2>
        </div>
        <Card className="p-8 border-0 shadow-card text-center">
          <p className="text-muted-foreground">Sign in to start tracking your purchases</p>
        </Card>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="animate-slide-up" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Tracked Items
          </h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 border-0 shadow-card">
              <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="animate-slide-up" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Tracked Items
          </h2>
        </div>
        <Card className="p-8 border-0 shadow-card text-center">
          <p className="text-muted-foreground">No items tracked yet. Upload a receipt to get started!</p>
        </Card>
      </section>
    );
  }

  return (
    <section className="animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Tracked Items
        </h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleCheckAllPrices}
            disabled={checkingPrices}
          >
            {checkingPrices ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {checkingPrices ? "Checking..." : "Check All Prices"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const purchasePrice = Number(item.purchase_price);
          const currentPrice = Number(item.current_price);
          const { diff, percent } = getPriceChange(purchasePrice, currentPrice);
          const status = getStatusInfo(purchasePrice, currentPrice);
          const hasDrop = currentPrice < purchasePrice;
          const daysLeft = getDaysLeft(item.purchase_date);
          const isChecking = checkingItemId === item.id;

          return (
            <Card
              key={item.id}
              className={`p-4 border-0 shadow-card hover:shadow-hover transition-all duration-300 bg-card ${
                hasDrop ? "ring-1 ring-savings/30" : ""
              } ${isChecking ? "opacity-70" : ""}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${status.bg}`}>
                  {isChecking ? (
                    <Loader2 className={`w-5 h-5 ${status.color} animate-spin`} />
                  ) : (
                    <status.icon className={`w-5 h-5 ${status.color}`} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-medium text-foreground truncate">{item.item_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Purchased {formatDate(item.purchase_date)} · {daysLeft} days left
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={status.badgeVariant}
                        className={hasDrop ? "gradient-savings border-0" : ""}
                      >
                        {status.label}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => handleCheckSinglePrice(item.id, item.item_name, item.item_number)}
                        disabled={isChecking || checkingPrices}
                        title="Check current price"
                      >
                        <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Paid</p>
                        <p className="font-semibold text-foreground">${purchasePrice.toFixed(2)}</p>
                      </div>
                      <div className="text-muted-foreground">→</div>
                      <div>
                        <p className="text-xs text-muted-foreground">Current</p>
                        <p className={`font-semibold ${hasDrop ? "text-savings" : "text-foreground"}`}>
                          ${currentPrice.toFixed(2)}
                        </p>
                      </div>
                      {diff !== 0 && (
                        <div className={`px-2 py-1 rounded-md ${status.bg}`}>
                          <span className={`text-sm font-medium ${status.color}`}>
                            {diff > 0 ? "-" : "+"}${Math.abs(diff).toFixed(2)} ({percent}%)
                          </span>
                        </div>
                      )}
                    </div>

                    {hasDrop && (
                      <Button variant="savings" size="sm" className="gap-1">
                        Claim Refund
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default TrackedItems;
