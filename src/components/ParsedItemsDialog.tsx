import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Package, Calendar, MapPin, Receipt, Plus } from "lucide-react";
import { ParsedItem, ReceiptMetadata } from "@/lib/receiptParser";
import { useToast } from "@/hooks/use-toast";

interface ParsedItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ParsedItem[];
  metadata?: ReceiptMetadata;
  fileName: string;
}

const ParsedItemsDialog = ({
  open,
  onOpenChange,
  items,
  metadata,
  fileName,
}: ParsedItemsDialogProps) => {
  const { toast } = useToast();

  const handleTrackAll = () => {
    toast({
      title: "Items added to tracking!",
      description: `${items.length} items are now being monitored for price drops.`,
    });
    onOpenChange(false);
  };

  const handleTrackItem = (item: ParsedItem) => {
    toast({
      title: "Item added to tracking!",
      description: `"${item.name}" is now being monitored for price drops.`,
    });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Unknown date";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Extracted Items
          </DialogTitle>
        </DialogHeader>

        {/* Metadata Card */}
        {metadata && (
          <Card className="p-4 bg-secondary/50 border-0 shrink-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {metadata.storeLocation && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{metadata.storeLocation}</span>
                </div>
              )}
              {metadata.purchaseDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{formatDate(metadata.purchaseDate)}</span>
                </div>
              )}
              {metadata.receiptNumber && (
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">#{metadata.receiptNumber}</span>
                </div>
              )}
              {metadata.total && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-semibold text-foreground">${metadata.total.toFixed(2)}</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{item.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {item.itemNumber && <span>#{item.itemNumber}</span>}
                    {item.quantity && item.quantity > 1 && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        Qty: {item.quantity}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-semibold text-foreground">
                  ${item.price.toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTrackItem(item)}
                  className="h-8 gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Track
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border shrink-0">
          <p className="text-sm text-muted-foreground">
            {items.length} items from <span className="font-medium">{fileName}</span>
          </p>
          <Button variant="savings" onClick={handleTrackAll}>
            Track All Items
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParsedItemsDialog;
