import { DollarSign, TrendingDown, Package, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTrackedItems } from "@/hooks/useTrackedItems";
import { useAuth } from "@/hooks/useAuth";

const SavingsOverview = () => {
  const { items, getTotalSavings, getPriceDropCount } = useTrackedItems();
  const { user } = useAuth();

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

  const stats = [
    {
      label: "Total Savings",
      value: user ? `$${totalSavings.toFixed(2)}` : "$0.00",
      icon: DollarSign,
      gradient: "gradient-savings",
      iconBg: "bg-savings/10",
      iconColor: "text-savings",
    },
    {
      label: "Price Drops Found",
      value: user ? String(priceDrops) : "0",
      icon: TrendingDown,
      gradient: "gradient-primary",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Items Tracked",
      value: user ? String(itemsCount) : "0",
      icon: Package,
      gradient: "",
      iconBg: "bg-secondary",
      iconColor: "text-foreground",
    },
    {
      label: "Days Left to Claim",
      value: user && items.length > 0 ? String(getMinDaysLeft()) : "-",
      icon: Clock,
      gradient: "",
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
  ];

  return (
    <section className="animate-fade-in">
      <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
        Your Savings Dashboard
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className={`p-5 border-0 shadow-card hover:shadow-hover transition-all duration-300 ${
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
    </section>
  );
};

export default SavingsOverview;
