/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { Order, Customer, initialOrdersState } from "@/types/order";

// ---------------- Types ----------------
// export interface Customer {
//   _id: string;
//   name: string;
//   email: string;
//   contact_number: string;
// }

// export interface Order {
//   _id: string;
//   customer_id: Customer;
//   email: string;
//   product_name: string;
//   quantity: number;
//   createdAt: string;
//   updatedAt: string;
//   status: "pending" | "processing" | "shipped" | string;
// }

// interface OrdersState {
//   orders: Order[];
//   loading: boolean;
//   error: string | null;
//   successMessage: string | null;
// }

// const initialState: OrdersState = {
//   orders: [],
//   loading: false,
//   error: null,
//   successMessage: null,
// };

// ---------------- Thunks ----------------

// ✅ Fetch Orders
export const fetchOrders = createAsyncThunk<
  Order[],
  { date?: string; product_name?: string },
  { rejectValue: string }
>("orders/fetchOrders", async (filters, thunkAPI) => {
  try {
    const query = new URLSearchParams(
      filters as Record<string, string>
    ).toString();

    const state = thunkAPI.getState() as any;
    const token = state.auth?.token || "";

    const { data } = await axios.get(
       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/ordersbyfilter?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return data.orders;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch orders"
      );
    }
    return thunkAPI.rejectWithValue("An unexpected error occurred");
  }
});

// ✅ Edit Order
export interface EditOrderPayload {
  id: string;
  product_name?: string;
  quantity?: number;
  status?: string;
}

export const editOrder = createAsyncThunk<
  { updatedOrder: Order; customer: Customer; message: string },
  EditOrderPayload,
  { rejectValue: string }
>("orders/editOrder", async (payload, thunkAPI) => {
  try {
    const { id, ...updateData } = payload;

    const state = thunkAPI.getState() as any;
    const token = state.auth?.token || "";

    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/edit-order/${id}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return {
      updatedOrder: data.updatedOrder,
      customer: data.customer,
      message: data.message,
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update order"
      );
    }
    return thunkAPI.rejectWithValue("An unexpected error occurred");
  }
});

// ✅ Delete Order
export const deleteOrder = createAsyncThunk<
  { id: string; message: string },
  string, // orderId
  { rejectValue: string }
>("orders/deleteOrder", async (id, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as any;
    const token = state.auth?.token || "";

    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/order/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return { id, message: data.message };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete order"
      );
    }
    return thunkAPI.rejectWithValue("An unexpected error occurred");
  }
});

// ---------------- Slice ----------------
const ordersSlice = createSlice({
  name: "orders",
  initialState: initialOrdersState,
  reducers: {
    clearOrders(state) {
      state.orders = [];
      state.error = null;
      state.successMessage = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload);
      state.successMessage = "New order received!";
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Orders ---
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // --- Edit Order ---
      .addCase(editOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        editOrder.fulfilled,
        (
          state,
          action: PayloadAction<{
            updatedOrder: Order;
            customer: Customer;
            message: string;
          }>
        ) => {
          state.loading = false;
          state.successMessage = action.payload.message;

          // ✅ Update the order in state.orders array
          state.orders = state.orders.map((order) =>
            order._id === action.payload.updatedOrder._id
              ? action.payload.updatedOrder
              : order
          );
        }
      )
      .addCase(editOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update order";
      })

      // --- Delete Order ---
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        deleteOrder.fulfilled,
        (state, action: PayloadAction<{ id: string; message: string }>) => {
          state.loading = false;
          state.successMessage = action.payload.message;

          // ✅ Remove deleted order from state.orders
          state.orders = state.orders.filter(
            (order) => order._id !== action.payload.id
          );
        }
      )
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete order";
      })
  },
});

export const { clearOrders, clearSuccessMessage, addOrder } = ordersSlice.actions;
export default ordersSlice.reducer;





