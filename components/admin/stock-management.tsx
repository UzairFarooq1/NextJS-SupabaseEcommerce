"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getSupabaseBrowser } from "@/lib/supabase/client";

interface StockManagementProps {
  product: {
    id: number;
    name: string;
    stock_quantity: number;
  };
  onUpdate: () => void;
}

export default function StockManagement({
  product,
  onUpdate,
}: StockManagementProps) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(product.stock_quantity.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateStock = async () => {
    const newQuantity = Number.parseInt(quantity);

    if (isNaN(newQuantity) || newQuantity < 0) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid number of 0 or greater.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getSupabaseBrowser();

      const { error } = await supabase
        .from("products")
        .update({ stock_quantity: newQuantity })
        .eq("id", product.id);

      if (error) throw error;

      toast({
        title: "Stock updated",
        description: `Stock for ${product.name} has been updated to ${newQuantity}.`,
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update stock.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="current-stock">Current Stock</Label>
          <Input
            id="current-stock"
            value={product.stock_quantity}
            disabled
            className="bg-muted"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-stock">New Stock Quantity</Label>
          <Input
            id="new-stock"
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
      </div>
      <Button
        onClick={handleUpdateStock}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Updating..." : "Update Stock"}
      </Button>
    </div>
  );
}
