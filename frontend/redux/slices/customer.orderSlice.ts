/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { OrderSchema, fileMetaSchema } from "@/schemas/order"; 
import { OrderPayload, initialOrderState } from "@/types/order";


export const createOrder = createAsyncThunk<
  unknown, // response type
  OrderPayload,
  { rejectValue: string | { fieldErrors: Record<string, string> } }
>(
  "order/create",
  async (payload, { rejectWithValue }) => {
    try {
      // --- Validate form data using Zod ---
      const validation = OrderSchema.safeParse(payload);
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.issues.forEach((issue) => {
          fieldErrors[issue.path[0] as string] = issue.message;
        });
        return rejectWithValue({ fieldErrors });
      }

      // --- Validate file separately ---
      const fileValidation = fileMetaSchema.safeParse({
      file: payload.product_image, // could be undefined
      mimetype: payload.product_image?.type ?? "",
      size: payload.product_image?.size ?? 0,
      });

      if (!fileValidation.success) {
      const fieldErrors: Record<string, string> = {};
      fileValidation.error.issues.forEach((issue) => {
      fieldErrors["product_image"] = issue.message;
      });
      return rejectWithValue({ fieldErrors });
}


      // --- Prepare FormData ---
      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("email", payload.email);
      formData.append("contact_number", payload.contact_number);
      formData.append("shipping_address", payload.shipping_address);
      formData.append("product_name", payload.product_name);
      formData.append("quantity", String(payload.quantity));

      if (payload.product_image) {
        formData.append("product_image", payload.product_image);
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/orders`,
        formData
      );

      return res.data;
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        return rejectWithValue(axiosErr.response?.data?.message ?? "Something went wrong");
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

//slice
const orderSlice = createSlice({
  name: "order",
  initialState: initialOrderState,
  reducers: {
    resetOrderState(state) {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.fieldErrors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Pending ---
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = null;
        state.success = false;
      })
      // --- Fulfilled ---
      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.fieldErrors = null;
      })
      // --- Rejected ---
      .addCase(
        createOrder.rejected,
        (state, action: PayloadAction<any, string, any, any>) => {
          state.loading = false;
          state.success = false;

          // Check if it's field errors from Zod
          if (action.payload && typeof action.payload === "object" && "fieldErrors" in action.payload) {
            state.fieldErrors = action.payload.fieldErrors;
            state.error = null;
          } else {
            state.error = action.payload ?? "Failed to create order";
            state.fieldErrors = null;
          }
        }
      );
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;





