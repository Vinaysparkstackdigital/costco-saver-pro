import { Bell, TrendingDown, Clock, ArrowRight, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTrackedItems } from "@/hooks/useTrackedItems";
import { useAuth } from "@/hooks/useAuth";

interface Alert {
  id: string;
  itemName: string;
  savings: number;
  daysLeft: number;
  isUrgent: boolean;
}

const PriceAlerts = () => {
  const { items } = useTrackedItems();
  const { user } = useAuth();

  // Generate real alerts from tracked items with price drops
  const generateAlerts = (): Alert[] => {
    if (!user || items.length === 0) return [];

    const now = new Date();
    return items
      .filter((item) => {
        const purchasePrice = Number(item.purchase_price);
        const currentPrice = Number(item.current_price);
        return currentPrice < purchasePrice;
      })
      .map((item) => {
        const purchasePrice = Number(item.purchase_price);
        const currentPrice = Number(item.current_price);
        const savings = purchasePrice - currentPrice;
        
        const purchaseDate = new Date(item.purchase_date);
        const daysSincePurchase = Math.floor((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysLeft = Math.max(0, 30 - daysSincePurchase);
        
        return {
          id: item.id,
          itemName: item.item_name,
          savings,
          daysLeft,
          isUrgent: daysLeft <= 7,
        };
      })
      .sort((a, b) => {
        // Sort by urgency first, then by savings
        if (a.isUrgent && !b.isUrgent) return -1;
        if (!a.isUrgent && b.isUrgent) return 1;
        return b.savings - a.savings;
      });
  };

  const alerts = generateAlerts();
  const urgentAlerts = alerts.filter(a => a.isUrgent);
  
  return (
    <section className="animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Price Drop Alerts
          </h2>
          {alerts.length > 0 && (
            <Badge className="bg-accent/20 text-accent border-0 text-base px-3 py-1">
              {alerts.length}
            </Badge>
          )}
        </div>
      </div>

      {alerts.length === 0 ? (
        <Card className="p-8 border-0 shadow-lg text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground">No price drop alerts yet. Upload receipts to track prices!</p>
        </Card>
      ) : (
        <Card className="p-0 border-0 shadow-lg bg-card overflow-hidden">
          {urgentAlerts.length > 0 && (
            <div className="bg-warning/10 border-b border-warning/20 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-warning">Urgent!</p>
                  <p className="text-sm text-warning/80">
                    {urgentAlerts.length} item{urgentAlerts.length !== 1 ? "s" : ""} expiring soon
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="divide-y divide-border">
            {alerts.map((alert, index) => (
              <div
                key={alert.id}
                className={`p-4 flex items-start gap-4 hover:bg-secondary/50 transition-colors ${
                  alert.isUrgent ? "bg-warning/5" : ""
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  alert.isUrgent ? "bg-warning/20" : "bg-accent/20"
                }`}>
                  {alert.isUrgent ? (
                    <Clock className="w-5 h-5 text-warning" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-accent" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground truncate">{alert.itemName}</h4>
                    {alert.isUrgent && (
                      <Badge variant="destructive" className="text-xs px-2">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-accent">${alert.savings.toFixed(2)}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className={`${alert.isUrgent ? "text-warning font-semibold" : "text-muted-foreground"}`}>
                      {alert.daysLeft} days left
                    </span>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0 hover:bg-primary/10"
                  title="Claim refund"
                >
                  <ArrowRight className="w-5 h-5 text-primary" />
                </Button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-secondary/50 border-t border-border">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bell className="w-4 h-4" />
                <span>Stay updated on price changes</span>
              </div>
              <Button variant="outline" size="sm" className="font-semibold">
                Enable
              </Button>
            </div>
          </div>
        </Card>
      )}
    </section>
  );
};

export default PriceAlerts;
