/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addOrder } from "@/redux/slices/admin.ordersSlice";
import toast from "react-hot-toast";
import io from "socket.io-client";

let socket: any;

export default function SocketListener() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    socket = io(`${process.env.BACKEND_URL}`); 
    console.log("Socket connected", socket.connected);

    socket.on("newOrder", (data: any) => {
      console.log("New order received:", data);
  
      const order = { ...data.order, customer_id: data.customer };
      dispatch(addOrder(order));
      toast.success("📦 New order received!");
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return null;
}
