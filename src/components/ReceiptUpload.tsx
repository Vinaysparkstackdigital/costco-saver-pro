import { useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  name: string;
  size: string;
  status: "processing" | "complete" | "error";
}

const ReceiptUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([
    { name: "costco_receipt_dec15.pdf", size: "2.4 MB", status: "complete" },
    { name: "costco_receipt_dec08.jpg", size: "1.1 MB", status: "complete" },
  ]);
  const { toast } = useToast();

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
    if (droppedFiles.length > 0) {
      const newFile: UploadedFile = {
        name: droppedFiles[0].name,
        size: `${(droppedFiles[0].size / 1024 / 1024).toFixed(1)} MB`,
        status: "processing",
      };
      setFiles((prev) => [newFile, ...prev]);

      // Simulate processing
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.name === newFile.name ? { ...f, status: "complete" } : f
          )
        );
        toast({
          title: "Receipt processed!",
          description: "Found 6 items to track for price drops.",
        });
      }, 2000);
    }
  }, [toast]);

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  return (
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
          <p className="text-sm text-muted-foreground mb-4">
            Supports PDF, JPG, PNG files up to 10MB
          </p>
          <Button variant="outline" size="sm">
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
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === "processing" ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : file.status === "complete" ? (
                    <CheckCircle className="w-5 h-5 text-savings" />
                  ) : null}
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
  );
};

export default ReceiptUpload;
