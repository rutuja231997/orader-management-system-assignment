// shared types
export interface Customer {
  _id: string;
  name: string;
  email: string;
  contact_number: string;
}

export interface Order {
  _id: string;
  customer_id: Customer;
  email: string;
  product_name: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "processing" | "shipped" | string;
}

// Customer Side Types
export interface OrderPayload {
  name: string;
  email: string;
  contact_number: string;
  shipping_address: string;
  product_name: string;
  quantity: number;
  product_image?: File;
}

export interface OrderState {
  loading: boolean;
  success: boolean;
  error: string | null;
  fieldErrors: Record<string, string> | null; // for Zod validation errors
}

export const initialOrderState: OrderState = {
  loading: false,
  success: false,
  error: null,
  fieldErrors: null,
};

//Admin Side Types
export interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export const initialOrdersState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
  successMessage: null,
};

// ---------- Edit Order Payload ----------
export interface EditOrderPayload {
  id: string;
  product_name?: string;
  quantity?: number;
  status?: string;
}



// export interface OrderPayload {
//   name: string;
//   email: string;
//   contact_number: string;
//   shipping_address: string;
//   product_name: string;
//   quantity: number;
//   product_image?: File;
// }

// export interface OrderState {
//   loading: boolean;
//   success: boolean;
//   error: string | null;
//   fieldErrors: Record<string, string> | null; // for Zod validation errors
// }

// export const initialState: OrderState = {
//   loading: false,
//   success: false,
//   error: null,
//   fieldErrors: null,
// };

