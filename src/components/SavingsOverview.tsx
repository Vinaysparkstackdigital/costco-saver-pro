import { DollarSign, TrendingDown, Package, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
  {
    label: "Total Savings",
    value: "$127.45",
    icon: DollarSign,
    gradient: "gradient-savings",
    iconBg: "bg-savings/10",
    iconColor: "text-savings",
  },
  {
    label: "Price Drops Found",
    value: "8",
    icon: TrendingDown,
    gradient: "gradient-primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    label: "Items Tracked",
    value: "24",
    icon: Package,
    gradient: "",
    iconBg: "bg-secondary",
    iconColor: "text-foreground",
  },
  {
    label: "Days Left to Claim",
    value: "12",
    icon: Clock,
    gradient: "",
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
];

const SavingsOverview = () => {
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
