import { supabase } from "@/integrations/supabase/client";

export interface PriceCheckResult {
  success: boolean;
  currentPrice?: number;
  itemName?: string;
  productUrl?: string;
  error?: string;
}

export async function checkItemPrice(
  itemName: string,
  itemNumber?: string
): Promise<PriceCheckResult> {
  try {
    const { data, error } = await supabase.functions.invoke("check-price", {
      body: { itemName, itemNumber },
    });

    if (error) {
      console.error("Error calling check-price function:", error);
      return { success: false, error: error.message };
    }

    return data as PriceCheckResult;
  } catch (error) {
    console.error("Error checking price:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to check price",
    };
  }
}

export async function checkMultiplePrices(
  items: Array<{ id: string; itemName: string; itemNumber?: string }>
): Promise<Map<string, PriceCheckResult>> {
  const results = new Map<string, PriceCheckResult>();
  
  // Process items sequentially to avoid rate limiting
  for (const item of items) {
    const result = await checkItemPrice(item.itemName, item.itemNumber ?? undefined);
    results.set(item.id, result);
    
    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}
