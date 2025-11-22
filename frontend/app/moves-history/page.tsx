"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { moveHistoryService, type ProductLog } from "@/services/MoveHistoryService";

export default function MovesHistoryPage() {
  const [moveHistory, setMoveHistory] = useState<ProductLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoveHistory = async () => {
      try {
        setLoading(true);
        const data = await moveHistoryService.getAllMoveHistory();
        setMoveHistory(data);
      } catch (error) {
        console.error("Failed to fetch move history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoveHistory();
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
      <h1 className="text-3xl font-bold mb-6">Move History</h1>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moveHistory.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-gray-500"
                  >
                    No move history found.
                  </TableCell>
                </TableRow>
              ) : (
                moveHistory.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {log.reference_id}
                    </TableCell>
                    <TableCell>{formatDate(log.schedule_at)}</TableCell>
                    <TableCell>{log.responsible}</TableCell>
                    <TableCell>{log.from}</TableCell>
                    <TableCell>{log.to}</TableCell>
                    <TableCell>{log.quantity}</TableCell>
                    <TableCell>{log.product_name || "N/A"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.status === "Done"
                            ? "bg-green-100 text-green-800"
                            : log.status === "Ready"
                            ? "bg-blue-100 text-blue-800"
                            : log.status === "Waiting"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {log.status}
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
