"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface MpesaPaymentProps {
  isProcessing: boolean;
}

export default function MpesaPayment({ isProcessing }: MpesaPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className="space-y-4">
      <Alert variant="default" className="bg-green-50 border-green-200">
        <InfoIcon className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          You will receive an M-Pesa prompt on your phone to complete the
          payment.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="mpesa-phone">M-Pesa Phone Number</Label>
        <Input
          id="mpesa-phone"
          placeholder="e.g. 254712345678"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isProcessing}
          className="border-green-300 focus:border-green-500 focus:ring-green-500"
        />
        <p className="text-xs text-muted-foreground">
          Enter the phone number registered with M-Pesa, starting with country
          code (e.g. 254 for Kenya)
        </p>
      </div>

      {isProcessing && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700 animate-pulse">
            Sending payment request to your M-Pesa phone...
          </p>
        </div>
      )}
    </div>
  );
}
