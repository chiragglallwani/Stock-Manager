"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deliverySchema,
  type DeliveryFormData,
  type DeliveryProduct,
} from "@/lib/validations/delivery";
import { moveHistoryService } from "@/services/MoveHistoryService";
import { warehouseService, type Warehouse } from "@/services/WarehouseService";
import { productService, type Product } from "@/services/ProductService";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2 } from "lucide-react";

export default function CreateDeliveryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const referenceId = searchParams.get("reference_id");

  const form = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      warehouse_short_code: "",
      schedule_at: "",
      to: "",
      products: [{ product_id: 0, quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [warehousesData, productsData] = await Promise.all([
          warehouseService.getAllWarehouses(),
          productService.getAllProducts(),
        ]);
        setWarehouses(warehousesData);
        setProducts(productsData);

        // If reference_id is provided, load existing delivery
        if (referenceId) {
          const existingLogs = await moveHistoryService.getByReferenceId(
            referenceId
          );
          if (existingLogs.length > 0) {
            const firstLog = existingLogs[0];
            form.reset({
              warehouse_short_code: firstLog.from,
              schedule_at: new Date(firstLog.schedule_at).toISOString().split("T")[0],
              to: firstLog.to,
              products: existingLogs.map((log) => ({
                product_id: log.product_id,
                quantity: log.quantity,
              })),
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [referenceId, form]);

  const onSubmit = async (data: DeliveryFormData) => {
    try {
      setSubmitting(true);
      if (referenceId) {
        // Update status
        await moveHistoryService.updateDeliveryStatus(referenceId);
      } else {
        // Create new delivery
        await moveHistoryService.createDelivery(data);
      }
      router.push("/operations/delivery");
    } catch (error) {
      console.error("Failed to save delivery:", error);
      alert(
        error instanceof Error ? error.message : "Failed to save delivery"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/operations/delivery");
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {referenceId ? "Edit Delivery" : "Create Delivery"}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={submitting}>
            Validate
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="warehouse_short_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warehouse</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!!referenceId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem
                          key={warehouse.id}
                          value={warehouse.short_code}
                        >
                          {warehouse.short_code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schedule_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deliver To</FormLabel>
                <FormControl>
                  <Input placeholder="Enter deliver to" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Responsible</FormLabel>
            <Input
              value={user?.username || ""}
              disabled
              className="mt-2 bg-gray-50"
            />
          </div>

          <div>
            <FormLabel className="mb-4 block">Products</FormLabel>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 mb-4">
                <FormField
                  control={form.control}
                  name={`products.${index}.product_id`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value, 10))
                          }
                          value={field.value?.toString() || ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem
                                key={product.id}
                                value={product.id!.toString()}
                              >
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`products.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Qty"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ product_id: 0, quantity: 1 })}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
