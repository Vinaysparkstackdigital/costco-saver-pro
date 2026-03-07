import { useState, useEffect, useCallback } from "react";
import { DollarSign, TrendingDown, Package, Clock, X, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTrackedItems } from "@/hooks/useTrackedItems";
import { useAuth } from "@/hooks/useAuth";

const SavingsOverview = () => {
  const { items, getTotalSavings, getPriceDropCount } = useTrackedItems();
  const { user } = useAuth();
  const [selectedStat, setSelectedStat] = useState<string | null>(null);

  const preventScroll = useCallback((e: TouchEvent) => {
    // Only prevent scroll if touch is NOT on the modal content
    const modalContent = document.querySelector('[data-modal-content]');
    if (modalContent && !modalContent.contains(e.target as Node)) {
      e.preventDefault();
    }
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedStat) {
      // Lock scroll on body and html
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.position = "fixed";
      document.documentElement.style.width = "100%";
      document.documentElement.style.height = "100vh";
      
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100vh";
      
      // Add touch event listener to prevent scroll
      document.addEventListener("touchmove", preventScroll, { passive: false });
    } else {
      // Unlock scroll
      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.style.width = "";
      document.documentElement.style.height = "";
      
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      
      document.removeEventListener("touchmove", preventScroll);
    }

    // Cleanup on unmount
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.style.width = "";
      document.documentElement.style.height = "";
      
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [selectedStat, preventScroll]);

  const totalSavings = getTotalSavings();
  const priceDrops = getPriceDropCount();
  const itemsCount = items.length;
  
  // Calculate min days left (30 days from purchase date)
  const getMinDaysLeft = () => {
    if (items.length === 0) return 0;
    const now = new Date();
    const daysLeftArray = items.map((item) => {
      const purchaseDate = new Date(item.purchase_date);
      const daysSincePurchase = Math.floor((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(0, 30 - daysSincePurchase);
    });
    return Math.min(...daysLeftArray);
  };

  const getItemsWithPriceDrops = () => {
    return items.filter(item => {
      const purchasePrice = Number(item.purchase_price);
      const currentPrice = Number(item.current_price);
      return currentPrice < purchasePrice;
    });
  };

  const getUrgentItems = () => {
    const now = new Date();
    return items.filter(item => {
      const purchaseDate = new Date(item.purchase_date);
      const daysSincePurchase = Math.floor((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysLeft = Math.max(0, 30 - daysSincePurchase);
      return daysLeft <= 7;
    });
  };

  const stats = [
    {
      id: "savings",
      label: "Total Savings",
      value: user ? `$${totalSavings.toFixed(2)}` : "$0.00",
      icon: DollarSign,
      gradient: "gradient-savings",
      iconBg: "bg-savings/10",
      iconColor: "text-savings",
    },
    {
      id: "drops",
      label: "Price Drops Found",
      value: user ? String(priceDrops) : "0",
      icon: TrendingDown,
      gradient: "gradient-primary",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      id: "tracked",
      label: "Items Tracked",
      value: user ? String(itemsCount) : "0",
      icon: Package,
      gradient: "",
      iconBg: "bg-secondary",
      iconColor: "text-foreground",
    },
    {
      id: "days",
      label: "Days Left to Claim",
      value: user && items.length > 0 ? String(getMinDaysLeft()) : "-",
      icon: Clock,
      gradient: "",
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
  ];

  const getModalContent = () => {
    switch (selectedStat) {
      case "savings":
        return {
          title: "Total Savings Available",
          items: getItemsWithPriceDrops(),
          emptyMessage: "No price drops available yet",
          renderItem: (item: any) => {
            const purchasePrice = Number(item.purchase_price);
            const currentPrice = Number(item.current_price);
            const savings = purchasePrice - currentPrice;
            return (
              <div key={item.id} className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{item.item_name}</h4>
                  <span className="text-lg font-bold text-savings">${savings.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ${purchasePrice.toFixed(2)} → ${currentPrice.toFixed(2)}
                </p>
              </div>
            );
          }
        };
      case "drops":
        return {
          title: "Price Drops Found",
          items: getItemsWithPriceDrops(),
          emptyMessage: "No price drops yet. Keep monitoring!",
          renderItem: (item: any) => {
            const purchasePrice = Number(item.purchase_price);
            const currentPrice = Number(item.current_price);
            const savings = purchasePrice - currentPrice;
            const percent = ((savings / purchasePrice) * 100).toFixed(1);
            return (
              <div key={item.id} className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{item.item_name}</h4>
                  <span className="text-lg font-bold text-savings">-{percent}%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ${purchasePrice.toFixed(2)} → ${currentPrice.toFixed(2)}
                </p>
              </div>
            );
          }
        };
      case "tracked":
        return {
          title: "Items Tracked",
          items: items,
          emptyMessage: "No items tracked yet",
          renderItem: (item: any) => {
            const purchasePrice = Number(item.purchase_price);
            const currentPrice = Number(item.current_price);
            const status = currentPrice < purchasePrice ? "Price Drop" : currentPrice > purchasePrice ? "Price Up" : "No Change";
            const statusColor = currentPrice < purchasePrice ? "text-savings" : currentPrice > purchasePrice ? "text-destructive" : "text-muted-foreground";
            return (
              <div key={item.id} className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{item.item_name}</h4>
                  <span className={`text-sm font-semibold ${statusColor}`}>{status}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Paid: ${purchasePrice.toFixed(2)} • Current: ${currentPrice.toFixed(2)}
                </p>
              </div>
            );
          }
        };
      case "days":
        return {
          title: "Urgent - Days Left to Claim",
          items: getUrgentItems(),
          emptyMessage: "No urgent items. All items have plenty of time to claim.",
          renderItem: (item: any) => {
            const purchaseDate = new Date(item.purchase_date);
            const now = new Date();
            const daysSincePurchase = Math.floor((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
            const daysLeft = Math.max(0, 30 - daysSincePurchase);
            return (
              <div key={item.id} className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{item.item_name}</h4>
                  <span className={`text-lg font-bold ${daysLeft <= 7 ? "text-warning" : "text-muted-foreground"}`}>
                    {daysLeft} days
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Purchased: {new Date(item.purchase_date).toLocaleDateString()}
                </p>
              </div>
            );
          }
        };
      default:
        return { title: "", items: [], emptyMessage: "", renderItem: () => null };
    }
  };

  return (
    <section className="animate-fade-in">
      <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
        Your Savings Dashboard
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.id}
            onClick={() => setSelectedStat(stat.id)}
            className={`p-5 border-0 shadow-card hover:shadow-hover transition-all duration-300 cursor-pointer hover:scale-105 ${
              stat.gradient ? stat.gradient + " text-primary-foreground" : "bg-card"
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm ${stat.gradient ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {stat.label}
                </p>
                <p className="text-2xl font-heading font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                stat.gradient ? "bg-primary-foreground/20" : stat.iconBg
              }`}>
                <stat.icon className={`w-5 h-5 ${stat.gradient ? "text-primary-foreground" : stat.iconColor}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for displaying stat details */}
      {selectedStat && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 pointer-events-auto" style={{ touchAction: "none" }}>
          <Card className="w-full max-w-2xl max-h-[90vh] border-0 shadow-2xl overflow-hidden bg-card pointer-events-auto" data-modal-content style={{ touchAction: "auto" }}>
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-secondary/50">
              <h3 className="font-heading text-xl font-semibold text-foreground">
                {getModalContent().title}
              </h3>
              <button
                onClick={() => setSelectedStat(null)}
                className="p-1 hover:bg-secondary rounded transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6" style={{ touchAction: "pan-y" }}>
              {getModalContent().items.length > 0 ? (
                <div className="space-y-3">
                  {getModalContent().items.map(item => getModalContent().renderItem(item))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">{getModalContent().emptyMessage}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {getModalContent().items.length > 0 && (
              <div className="border-t border-border p-6 bg-secondary/30 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedStat(null)}
                >
                  Close
                </Button>
                {(selectedStat === "savings" || selectedStat === "drops") && (
                  <Button
                    variant="default"
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                  >
                    Claim Refunds
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </section>
  );
};

export default SavingsOverview;
