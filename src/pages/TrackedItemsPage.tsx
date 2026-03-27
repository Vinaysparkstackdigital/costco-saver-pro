import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import TrackedItems from "@/components/TrackedItems";
import { Button } from "@/components/ui/button";

const TrackedItemsPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Tracked Items - Cost Saver</title>
        <meta 
          name="description" 
          content="View and manage all your tracked Costco items and price updates." 
        />
      </Helmet>

      <div className="min-h-screen gradient-hero">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Back Button */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="gap-2"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">Back</span>
            </div>

            {/* Page Title */}
            <section className="text-center py-4 animate-fade-in">
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Your <span className="text-primary">Tracked Items</span>
              </h1>
              <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Monitor price changes and claim refunds for items purchased at Costco
              </p>
            </section>

            {/* Tracked Items List */}
            <TrackedItems />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-border bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© 2026 Cost Saver by SparkStack Digital LLC. Not affiliated with Costco Wholesale Corporation.</p>
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

export default TrackedItemsPage;
