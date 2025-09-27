/* eslint-disable @typescript-eslint/no-explicit-any */

// redux/adminEvents.ts
import { addOrder } from "@/redux/slices/admin.ordersSlice";
import { AppDispatch } from "@/redux/store"; // from your store.ts
import toast from "react-hot-toast";
import socket from "./socket";

export const registerAdminEvents = (dispatch: AppDispatch) => {
  socket.on("newOrder", (data: { order: any }) => {
    console.log("New order received:", data);
    dispatch(addOrder(data.order));
    toast.success("📦 New order received!");
  });
};
