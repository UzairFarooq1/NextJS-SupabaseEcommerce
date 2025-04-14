import StockDebugger from "@/components/debug/stock-debugger";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StockDebugPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Stock Management Debug</h1>
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>

      <StockDebugger />

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <h2 className="text-lg font-medium mb-2">
          Troubleshooting Stock Issues
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Use the debugger above to check if the stock decrement function is
            working correctly
          </li>
          <li>
            Verify that the product IDs in your cart match the actual product
            IDs in the database
          </li>
          <li>
            Check if there are any permission issues with the RPC function call
          </li>
          <li>Ensure the function parameters are being passed correctly</li>
        </ul>
      </div>
    </div>
  );
}
