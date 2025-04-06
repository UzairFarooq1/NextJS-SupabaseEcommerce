"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { format, subDays } from "date-fns";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2 } from "lucide-react";

export default function SalesChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = getSupabaseBrowser();

        // Get orders from the last 30 days
        const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

        const { data: orders } = await supabase
          .from("orders")
          .select("total_amount, created_at")
          .gte("created_at", thirtyDaysAgo)
          .order("created_at", { ascending: true });

        if (!orders) {
          setChartData(generateDummyData());
          return;
        }

        // Group orders by date
        const groupedData: Record<string, number> = {};

        // Initialize all dates in the last 30 days with 0
        for (let i = 30; i >= 0; i--) {
          const date = format(subDays(new Date(), i), "yyyy-MM-dd");
          groupedData[date] = 0;
        }

        // Sum order amounts by date
        orders.forEach((order) => {
          const date = format(new Date(order.created_at), "yyyy-MM-dd");
          groupedData[date] =
            (groupedData[date] || 0) + Number(order.total_amount);
        });

        // Convert to chart data format
        const formattedData = Object.entries(groupedData).map(
          ([date, amount]) => ({
            date,
            amount: Number(amount.toFixed(2)),
          })
        );

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setChartData(generateDummyData());
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate dummy data if no real data is available
  const generateDummyData = () => {
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      data.push({
        date,
        amount: Math.floor(Math.random() * 500) + 100,
      });
    }
    return data;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
            const date = new Date(value);
            return format(date, "MMM d");
          }}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value: number) => [`$${value}`, "Revenue"]}
          labelFormatter={(label) => format(new Date(label), "MMMM d, yyyy")}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#2563eb"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
