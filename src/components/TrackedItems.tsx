import { TrendingDown, TrendingUp, Minus, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TrackedItem {
  id: string;
  name: string;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  daysLeft: number;
  imageUrl?: string;
}

const mockItems: TrackedItem[] = [
  {
    id: "1",
    name: "Kirkland Signature Olive Oil 2L",
    purchasePrice: 24.99,
    currentPrice: 18.99,
    purchaseDate: "Dec 10, 2024",
    daysLeft: 18,
  },
  {
    id: "2",
    name: "Sony 65\" Class X90L TV",
    purchasePrice: 1299.99,
    currentPrice: 1199.99,
    purchaseDate: "Dec 5, 2024",
    daysLeft: 13,
  },
  {
    id: "3",
    name: "Apple AirPods Pro (2nd Gen)",
    purchasePrice: 189.99,
    currentPrice: 169.99,
    purchaseDate: "Dec 12, 2024",
    daysLeft: 20,
  },
  {
    id: "4",
    name: "Kirkland Signature Paper Towels",
    purchasePrice: 22.49,
    currentPrice: 22.49,
    purchaseDate: "Dec 8, 2024",
    daysLeft: 16,
  },
  {
    id: "5",
    name: "Vitamix E320 Blender",
    purchasePrice: 349.99,
    currentPrice: 359.99,
    purchaseDate: "Dec 1, 2024",
    daysLeft: 9,
  },
];

const TrackedItems = () => {
  const getPriceChange = (purchase: number, current: number) => {
    const diff = purchase - current;
    const percent = ((diff / purchase) * 100).toFixed(1);
    return { diff, percent };
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

  return (
    <section className="animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Tracked Items
        </h2>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {mockItems.map((item, index) => {
          const { diff, percent } = getPriceChange(item.purchasePrice, item.currentPrice);
          const status = getStatusInfo(item.purchasePrice, item.currentPrice);
          const hasDrop = item.currentPrice < item.purchasePrice;

          return (
            <Card
              key={item.id}
              className={`p-4 border-0 shadow-card hover:shadow-hover transition-all duration-300 bg-card ${
                hasDrop ? "ring-1 ring-savings/30" : ""
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${status.bg}`}>
                  <status.icon className={`w-5 h-5 ${status.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Purchased {item.purchaseDate} · {item.daysLeft} days left
                      </p>
                    </div>
                    <Badge 
                      variant={status.badgeVariant}
                      className={hasDrop ? "gradient-savings border-0" : ""}
                    >
                      {status.label}
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Paid</p>
                        <p className="font-semibold text-foreground">${item.purchasePrice.toFixed(2)}</p>
                      </div>
                      <div className="text-muted-foreground">→</div>
                      <div>
                        <p className="text-xs text-muted-foreground">Current</p>
                        <p className={`font-semibold ${hasDrop ? "text-savings" : "text-foreground"}`}>
                          ${item.currentPrice.toFixed(2)}
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
