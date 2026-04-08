import type { NearbyItem } from "./pages/ItemDetails";

export type OrderStatus = "Processing" | "Packed" | "Out for Delivery" | "Delivered";

export type Order = {
  orderNumber: string;
  item: NearbyItem;
  status: OrderStatus;
  placedAt: string;
  estimatedDelivery: string;
  shippingMethod: string;
  shippingFee: number;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
  };
};
