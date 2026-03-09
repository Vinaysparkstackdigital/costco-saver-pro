import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import SavingsOverview from "@/components/SavingsOverview";
import ReceiptUpload from "@/components/ReceiptUpload";
import PriceAlerts from "@/components/PriceAlerts";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>PriceDrop - Costco Price Tracker & Refund Assistant</title>
        <meta 
          name="description" 
          content="Automatically track price drops on your Costco purchases and claim refunds with ease. Save money on every shopping trip." 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Hero Section */}
            <section className="text-center py-6 md:py-12 animate-fade-in">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Save on <span className="text-primary">Every Purchase</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Snap a photo of your receipt. We'll track prices and notify you about drops so you can claim refunds instantly.
              </p>
            </section>

            {/* Primary CTA - Receipt Upload */}
            <section className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <ReceiptUpload />
            </section>

            {/* Dashboard Stats */}
            <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <SavingsOverview />
            </section>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
              {/* Left Column - Empty for balance */}
              <div className="lg:col-span-2" />

              {/* Right Column - Alerts */}
              <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
                <PriceAlerts />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-border bg-card/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© 2026 SparkStack Digital LLC. Not affiliated with Costco Wholesale.</p>
              <p>
                Costco's price adjustment policy allows refunds within 30 days of purchase.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
