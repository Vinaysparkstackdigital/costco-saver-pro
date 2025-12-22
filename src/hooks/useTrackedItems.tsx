import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface TrackedItem {
  id: string;
  item_name: string;
  item_number: string | null;
  purchase_price: number;
  current_price: number;
  quantity: number;
  purchase_date: string;
  store_location: string | null;
  receipt_number: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PriceHistory {
  id: string;
  tracked_item_id: string;
  price: number;
  recorded_at: string;
}

interface AddItemParams {
  itemName: string;
  itemNumber?: string;
  purchasePrice: number;
  quantity?: number;
  purchaseDate: string;
  storeLocation?: string;
  receiptNumber?: string;
}

export const useTrackedItems = () => {
  const [items, setItems] = useState<TrackedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tracked_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching tracked items:", error);
      toast({
        title: "Error",
        description: "Failed to load tracked items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (params: AddItemParams): Promise<TrackedItem | null> => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to track items",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("tracked_items")
        .insert({
          user_id: user.id,
          item_name: params.itemName,
          item_number: params.itemNumber || null,
          purchase_price: params.purchasePrice,
          current_price: params.purchasePrice, // Start with same as purchase
          quantity: params.quantity || 1,
          purchase_date: params.purchaseDate,
          store_location: params.storeLocation || null,
          receipt_number: params.receiptNumber || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Also add initial price to history
      await supabase.from("price_history").insert({
        tracked_item_id: data.id,
        price: params.purchasePrice,
      });

      setItems((prev) => [data, ...prev]);
      return data;
    } catch (error) {
      console.error("Error adding tracked item:", error);
      toast({
        title: "Error",
        description: "Failed to add item to tracking",
        variant: "destructive",
      });
      return null;
    }
  };

  const addMultipleItems = async (itemsList: AddItemParams[]): Promise<number> => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to track items",
        variant: "destructive",
      });
      return 0;
    }

    let successCount = 0;
    for (const item of itemsList) {
      const result = await addItem(item);
      if (result) successCount++;
    }
    return successCount;
  };

  const updateCurrentPrice = async (itemId: string, newPrice: number) => {
    try {
      const { error } = await supabase
        .from("tracked_items")
        .update({ current_price: newPrice })
        .eq("id", itemId);

      if (error) throw error;

      // Add to price history
      await supabase.from("price_history").insert({
        tracked_item_id: itemId,
        price: newPrice,
      });

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, current_price: newPrice } : item
        )
      );
    } catch (error) {
      console.error("Error updating price:", error);
      toast({
        title: "Error",
        description: "Failed to update price",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("tracked_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const getPriceHistory = async (itemId: string): Promise<PriceHistory[]> => {
    try {
      const { data, error } = await supabase
        .from("price_history")
        .select("*")
        .eq("tracked_item_id", itemId)
        .order("recorded_at", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching price history:", error);
      return [];
    }
  };

  const getTotalSavings = () => {
    return items.reduce((total, item) => {
      const savings = item.purchase_price - item.current_price;
      return total + (savings > 0 ? savings : 0);
    }, 0);
  };

  const getPriceDropCount = () => {
    return items.filter((item) => item.current_price < item.purchase_price).length;
  };

  return {
    items,
    loading,
    addItem,
    addMultipleItems,
    updateCurrentPrice,
    deleteItem,
    getPriceHistory,
    getTotalSavings,
    getPriceDropCount,
    refetch: fetchItems,
  };
};
