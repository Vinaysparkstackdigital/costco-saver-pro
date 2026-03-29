import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import SavingsOverview from "@/components/SavingsOverview";
import ReceiptUpload from "@/components/ReceiptUpload";
import PriceAlerts from "@/components/PriceAlerts";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Cost Saver - Track Price Drops & Claim Refunds Automatically</title>
        <meta 
          name="description" 
          content="Smart Costco price monitoring that automatically tracks price drops and notifies you about refunds. Save money on every shopping trip." 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Hero Section */}
            <section className="text-center py-6 md:py-12 animate-fade-in">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Save More on <span className="text-primary">Costco Purchases</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Snap a receipt photo. Cost Saver tracks price drops and automatically notifies you about refunds you can claim within 30 days.
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
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
              <p>© 2026 Cost Saver by SparkStack Digital LLC. Not affiliated with Costco Wholesale Corporation.</p>
              <div className="flex gap-4">
                <a href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
