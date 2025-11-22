"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { moveHistoryService, type ProductLog } from "@/services/MoveHistoryService";
import { Button } from "@/components/ui/button";

export default function DeliveryPage() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<ProductLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        const data = await moveHistoryService.getDeliveries();
        // Group by reference_id and take first entry of each group
        const grouped = new Map<string, ProductLog>();
        data.forEach((delivery) => {
          if (!grouped.has(delivery.reference_id)) {
            grouped.set(delivery.reference_id, delivery);
          }
        });
        setDeliveries(Array.from(grouped.values()));
      } catch (error) {
        console.error("Failed to fetch deliveries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Delivery</h1>
        <Button onClick={() => router.push("/operations/delivery/create")}>
          Create Delivery
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Schedule Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No deliveries found.
                  </TableCell>
                </TableRow>
              ) : (
                deliveries.map((delivery) => (
                  <TableRow
                    key={delivery.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      router.push(
                        `/operations/delivery/create?reference_id=${encodeURIComponent(delivery.reference_id)}`
                      )
                    }
                  >
                    <TableCell className="font-medium">
                      {delivery.reference_id}
                    </TableCell>
                    <TableCell>{delivery.from}</TableCell>
                    <TableCell>{delivery.to}</TableCell>
                    <TableCell>{delivery.responsible}</TableCell>
                    <TableCell>{formatDate(delivery.schedule_at)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          delivery.status === "Done"
                            ? "bg-green-100 text-green-800"
                            : delivery.status === "Ready"
                            ? "bg-blue-100 text-blue-800"
                            : delivery.status === "Waiting"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {delivery.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
