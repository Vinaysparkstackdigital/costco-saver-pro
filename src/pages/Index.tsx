import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import SavingsOverview from "@/components/SavingsOverview";
import ReceiptUpload from "@/components/ReceiptUpload";
import TrackedItems from "@/components/TrackedItems";
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

      <div className="min-h-screen gradient-hero">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Hero Section */}
            <section className="text-center py-8 animate-fade-in">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Never Miss a <span className="text-primary">Price Drop</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload your Costco receipts and we'll automatically track prices. 
                When items drop, claim your refund in seconds.
              </p>
            </section>

            {/* Dashboard Grid */}
            <SavingsOverview />

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-8">
                <TrackedItems />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-2 space-y-8">
                <ReceiptUpload />
                <PriceAlerts />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-border bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© 2024 PriceDrop. Not affiliated with Costco Wholesale.</p>
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
