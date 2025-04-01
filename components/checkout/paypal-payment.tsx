"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface PaypalPaymentProps {
  isProcessing: boolean;
}

export default function PaypalPayment({ isProcessing }: PaypalPaymentProps) {
  // In a real implementation, this would be replaced with the PayPal SDK

  return (
    <div className="space-y-4">
      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          You will be redirected to PayPal to complete your payment securely.
        </AlertDescription>
      </Alert>

      <div className="p-4 border border-blue-200 rounded-md bg-blue-50">
        <div className="flex justify-center">
          <div className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full text-center">
            {isProcessing ? "Connecting to PayPal..." : "Pay with PayPal"}
          </div>
        </div>
        <p className="text-xs text-center mt-2 text-muted-foreground">
          By clicking above, you will be redirected to PayPal to complete your
          purchase securely.
        </p>
      </div>

      {isProcessing && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700 animate-pulse">
            Connecting to PayPal...
          </p>
        </div>
      )}
    </div>
  );
}
