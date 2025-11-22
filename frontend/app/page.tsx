"use client";

import { useState, useEffect } from "react";
import { NavWrapper } from "@/components/NavWrapper";
import { moveHistoryService } from "@/services/MoveHistoryService";
import { Receipt, Truck } from "lucide-react";

interface Stats {
  total: number;
  late: number;
}

export default function Home() {
  const [receiptStats, setReceiptStats] = useState<Stats>({ total: 0, late: 0 });
  const [deliveryStats, setDeliveryStats] = useState<Stats>({ total: 0, late: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [receiptData, deliveryData] = await Promise.all([
          moveHistoryService.getReceiptStats(),
          moveHistoryService.getDeliveryStats(),
        ]);
        setReceiptStats(receiptData);
        setDeliveryStats(deliveryData);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <NavWrapper>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Receipt Box */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Receipt className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Receipt</h2>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Ready</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {receiptStats.total}
                  </p>
                </div>
                {receiptStats.late > 0 && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Late</p>
                    <p className="text-2xl font-bold text-red-600">
                      {receiptStats.late}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Box */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Delivery</h2>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Ready</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {deliveryStats.total}
                  </p>
                </div>
                {deliveryStats.late > 0 && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Late</p>
                    <p className="text-2xl font-bold text-red-600">
                      {deliveryStats.late}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </NavWrapper>
  );
}
