import { supabase } from "@/integrations/supabase/client";

export interface ParsedItem {
  name: string;
  price: number;
  quantity?: number;
  itemNumber?: string;
}

export interface ReceiptMetadata {
  storeLocation?: string;
  purchaseDate?: string;
  receiptNumber?: string;
  subtotal?: number;
  tax?: number;
  total?: number;
}

export interface ParseReceiptResult {
  success: boolean;
  items?: ParsedItem[];
  metadata?: ReceiptMetadata;
  error?: string;
}

export async function parseReceiptImage(file: File): Promise<ParseReceiptResult> {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file);
    
    // Remove the data URL prefix to get just the base64 content
    const base64Content = base64.split(",")[1];
    
    const { data, error } = await supabase.functions.invoke("parse-receipt", {
      body: {
        imageBase64: base64Content,
        mimeType: file.type,
      },
    });

    if (error) {
      console.error("Error calling parse-receipt function:", error);
      return { success: false, error: error.message };
    }

    return data as ParseReceiptResult;
  } catch (error) {
    console.error("Error parsing receipt:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to parse receipt",
    };
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
