import { Bell, TrendingDown, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  itemName: string;
  savings: number;
  daysLeft: number;
  isUrgent: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    itemName: "Sony 65\" Class X90L TV",
    savings: 100.00,
    daysLeft: 13,
    isUrgent: false,
  },
  {
    id: "2",
    itemName: "Kirkland Signature Olive Oil 2L",
    savings: 6.00,
    daysLeft: 3,
    isUrgent: true,
  },
  {
    id: "3",
    itemName: "Apple AirPods Pro (2nd Gen)",
    savings: 20.00,
    daysLeft: 20,
    isUrgent: false,
  },
];

const PriceAlerts = () => {
  return (
    <section className="animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Price Drop Alerts
          </h2>
          <span className="px-2 py-0.5 rounded-full gradient-savings text-xs font-medium text-savings-foreground">
            {mockAlerts.length} new
          </span>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          Clear All
        </Button>
      </div>

      <Card className="p-0 border-0 shadow-card bg-card overflow-hidden">
        <div className="divide-y divide-border">
          {mockAlerts.map((alert, index) => (
            <div
              key={alert.id}
              className={`p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors ${
                alert.isUrgent ? "bg-warning/5" : ""
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                alert.isUrgent ? "bg-warning/20" : "bg-savings/10"
              }`}>
                {alert.isUrgent ? (
                  <Clock className="w-5 h-5 text-warning" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-savings" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground truncate">{alert.itemName}</h4>
                  {alert.isUrgent && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-warning text-warning-foreground uppercase">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Save <span className="text-savings font-semibold">${alert.savings.toFixed(2)}</span>
                  {" · "}{alert.daysLeft} days left to claim
                </p>
              </div>

              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="p-4 bg-secondary/30 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bell className="w-4 h-4" />
              <span>Get notified when prices drop</span>
            </div>
            <Button variant="outline" size="sm">
              Enable Notifications
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default PriceAlerts;
