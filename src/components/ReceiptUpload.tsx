import { useState, useCallback, useRef } from "react";
import { Upload, FileText, X, CheckCircle, Loader2, Sparkles, Eye, Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { parseReceiptImage, ParsedItem, ReceiptMetadata } from "@/lib/receiptParser";
import { captureReceiptImage, CameraSource, isNativePlatform } from "@/lib/native";
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
  const cameraInputRef = useRef<HTMLInputElement>(null);
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
      void processFile(selectedFiles[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      await processFile(selectedFiles[0]);
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };

  const handleNativeImageSelection = async (source: CameraSource) => {
    try {
      const file = await captureReceiptImage(source);
      await processFile(file);
    } catch (error) {
      toast({
        title: "Unable to access photo",
        description: error instanceof Error ? error.message : "Please check camera and photo permissions.",
        variant: "destructive",
      });
    }
  };

  const handleBrowseFiles = () => {
    if (isNativePlatform()) {
      void handleNativeImageSelection(CameraSource.Photos);
      return;
    }

    fileInputRef.current?.click();
  };

  const handleOpenCamera = () => {
    if (isNativePlatform()) {
      void handleNativeImageSelection(CameraSource.Camera);
      return;
    }

    cameraInputRef.current?.click();
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
        <Card className="p-0 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-primary/5 via-card to-card overflow-hidden">
          <div className="p-8 md:p-10">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-200 ${
                isDragging
                  ? "border-primary bg-primary/10 scale-105"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Upload className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-3">
                Start Tracking Now
              </h3>
              <p className="text-base text-muted-foreground mb-2">
                Upload or photograph your Costco receipt
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Supports camera capture plus JPG, PNG, or PDF receipts up to 10MB
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-primary mb-8 bg-primary/10 rounded-lg py-3 px-4">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">AI-powered OCR automatically extracts items</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleBrowseFiles}
                  className="w-full sm:w-auto text-base font-semibold"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  {isNativePlatform() ? "Photo Library" : "Browse Files"}
                </Button>
                <Button 
                  variant="default" 
                  size="lg"
                  onClick={handleOpenCamera}
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Take Picture
                </Button>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="border-t border-border bg-secondary/30 p-6 md:p-8">
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                Recent Uploads
              </h4>
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                      file.status === "error" 
                        ? "bg-destructive/10 border border-destructive/30" 
                        : "bg-accent/10 border border-accent/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        file.status === "error" ? "bg-destructive/20" : "bg-accent/20"
                      }`}>
                        <FileText className={`w-5 h-5 ${
                          file.status === "error" ? "text-destructive" : "text-accent"
                        }`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.status === "processing" ? (
                            <span className="flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Extracting items with AI...
                            </span>
                          ) : file.status === "complete" && file.items ? (
                            <span className="text-accent font-medium">
                              ✓ {file.trackedCount ? `${file.trackedCount} items tracked` : `${file.items.length} items extracted`}
                            </span>
                          ) : file.status === "error" ? (
                            <span className="text-destructive">✗ {file.error}</span>
                          ) : (
                            file.size
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {getStatusIcon(file.status)}
                      {file.status === "complete" && file.items && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/20"
                          onClick={() => setSelectedFile(file)}
                          title="View extracted items"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <button
                        onClick={() => removeFile(file.name)}
                        className="p-1 hover:bg-destructive/20 rounded transition-colors"
                        title="Remove"
                      >
                        <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
