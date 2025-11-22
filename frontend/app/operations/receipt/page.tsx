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

export default function ReceiptPage() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<ProductLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true);
        const data = await moveHistoryService.getReceipts();
        // Group by reference_id and take first entry of each group
        const grouped = new Map<string, ProductLog>();
        data.forEach((receipt) => {
          if (!grouped.has(receipt.reference_id)) {
            grouped.set(receipt.reference_id, receipt);
          }
        });
        setReceipts(Array.from(grouped.values()));
      } catch (error) {
        console.error("Failed to fetch receipts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
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
        <h1 className="text-3xl font-bold">Receipt</h1>
        <Button onClick={() => router.push("/operations/receipt/create")}>
          Create Receipt
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
              {receipts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No receipts found.
                  </TableCell>
                </TableRow>
              ) : (
                receipts.map((receipt) => (
                  <TableRow
                    key={receipt.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      router.push(
                        `/operations/receipt/create?reference_id=${encodeURIComponent(receipt.reference_id)}`
                      )
                    }
                  >
                    <TableCell className="font-medium">
                      {receipt.reference_id}
                    </TableCell>
                    <TableCell>{receipt.from}</TableCell>
                    <TableCell>{receipt.to}</TableCell>
                    <TableCell>{receipt.responsible}</TableCell>
                    <TableCell>{formatDate(receipt.schedule_at)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          receipt.status === "Done"
                            ? "bg-green-100 text-green-800"
                            : receipt.status === "Ready"
                            ? "bg-blue-100 text-blue-800"
                            : receipt.status === "Waiting"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {receipt.status}
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
