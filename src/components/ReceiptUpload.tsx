import { useState, useCallback, useRef } from "react";
import { Upload, FileText, X, CheckCircle, Loader2, Sparkles, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { parseReceiptImage, ParsedItem, ReceiptMetadata } from "@/lib/receiptParser";
import { useTrackedItems } from "@/hooks/useTrackedItems";
import { useAuth } from "@/hooks/useAuth";
import ParsedItemsDialog from "./ParsedItemsDialog";

interface UploadedFile {
  name: string;
  size: string;
  status: "uploading" | "processing" | "complete" | "error";
  items?: ParsedItem[];
  metadata?: ReceiptMetadata;
  error?: string;
  trackedCount?: number;
}

const ReceiptUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addMultipleItems } = useTrackedItems();
  const { user } = useAuth();

  const processFile = async (file: File) => {
    const newFile: UploadedFile = {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      status: "processing",
    };
    
    setFiles((prev) => [newFile, ...prev]);

    try {
      const result = await parseReceiptImage(file);

      if (result.success && result.items) {
        // Auto-track all items if user is logged in
        let trackedCount = 0;
        if (user && result.items.length > 0) {
          const itemsToAdd = result.items.map((item) => ({
            itemName: item.name,
            itemNumber: item.itemNumber,
            purchasePrice: item.price,
            quantity: item.quantity,
            purchaseDate: result.metadata?.purchaseDate || new Date().toISOString().split("T")[0],
            storeLocation: result.metadata?.storeLocation,
            receiptNumber: result.metadata?.receiptNumber,
          }));
          trackedCount = await addMultipleItems(itemsToAdd);
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name
              ? { 
                  ...f, 
                  status: "complete", 
                  items: result.items,
                  metadata: result.metadata,
                  trackedCount,
                }
              : f
          )
        );
        toast({
          title: "Receipt processed!",
          description: user 
            ? `${trackedCount} items added to tracking for price drops.`
            : `Found ${result.items.length} items. Sign in to track prices.`,
        });
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name
              ? { ...f, status: "error", error: result.error }
              : f
          )
        );
        toast({
          title: "Processing failed",
          description: result.error || "Could not extract items from receipt",
          variant: "destructive",
        });
      }
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name
            ? { ...f, status: "error", error: "Failed to process receipt" }
            : f
        )
      );
      toast({
        title: "Error",
        description: "Failed to process receipt",
        variant: "destructive",
      });
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFile = droppedFiles.find((f) =>
      f.type.startsWith("image/") || f.type === "application/pdf"
    );

    if (imageFile) {
      processFile(imageFile);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (JPG, PNG) or PDF",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFile(selectedFiles[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case "complete":
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case "error":
        return <X className="w-5 h-5 text-destructive" />;
    }
  };

  return (
    <>
      <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
        <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
          Upload Receipts
        </h2>
        <Card className="p-6 border-0 shadow-card bg-card">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Upload className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-2">
              Drop your Costco receipts here
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Supports JPG, PNG files up to 10MB
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-accent mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-powered OCR extracts items automatically</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText className="w-4 h-4 mr-2" />
              Browse Files
            </Button>
          </div>

          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium text-foreground">Recent Uploads</h4>
              {files.map((file) => (
                <div
                  key={file.name}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    file.status === "error" ? "bg-destructive/10" : "bg-secondary/50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      file.status === "error" ? "bg-destructive/20" : "bg-primary/10"
                    }`}>
                      <FileText className={`w-4 h-4 ${
                        file.status === "error" ? "text-destructive" : "text-primary"
                      }`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.status === "processing" ? (
                          "Extracting items with AI..."
                        ) : file.status === "complete" && file.items ? (
                          <span className="text-accent">
                            {file.trackedCount ? `${file.trackedCount} items tracked` : `${file.items.length} items extracted`}
                          </span>
                        ) : file.status === "error" ? (
                          <span className="text-destructive">{file.error}</span>
                        ) : (
                          file.size
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(file.status)}
                    {file.status === "complete" && file.items && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedFile(file)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <button
                      onClick={() => removeFile(file.name)}
                      className="p-1 hover:bg-secondary rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      <ParsedItemsDialog
        open={!!selectedFile}
        onOpenChange={(open) => !open && setSelectedFile(null)}
        items={selectedFile?.items || []}
        metadata={selectedFile?.metadata}
        fileName={selectedFile?.name || ""}
      />
    </>
  );
};

export default ReceiptUpload;
