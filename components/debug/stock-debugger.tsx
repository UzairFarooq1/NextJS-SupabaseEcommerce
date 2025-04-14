"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StockDebugger() {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkStock = async () => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const supabase = getSupabaseBrowser();
      const { data, error } = await supabase
        .from("products")
        .select("id, name, stock_quantity")
        .eq("id", Number.parseInt(productId))
        .single();

      if (error) throw error;
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to check stock");
    } finally {
      setIsLoading(false);
    }
  };

  const testDecrement = async () => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowser();

      // Get current stock
      const { data: before } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", Number.parseInt(productId))
        .single();

      // Call the decrement_stock function directly
      const { error: rpcError } = await supabase.rpc("decrement_stock", {
        p_product_id: Number.parseInt(productId),
        p_quantity: Number.parseInt(quantity),
      });

      if (rpcError) throw rpcError;

      // Get updated stock
      const { data: after } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", Number.parseInt(productId))
        .single();

      setResult({
        before: before?.stock_quantity,
        after: after?.stock_quantity,
        difference: before?.stock_quantity - after?.stock_quantity,
      });
    } catch (err: any) {
      setError(err.message || "Failed to test stock decrement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productId">Product ID</Label>
            <Input
              id="productId"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Enter product ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              min="1"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={checkStock} disabled={isLoading || !productId}>
            Check Stock
          </Button>
          <Button onClick={testDecrement} disabled={isLoading || !productId}>
            Test Decrement
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-50 border rounded-md p-4">
            <p className="font-medium">Result:</p>
            <pre className="mt-2 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
