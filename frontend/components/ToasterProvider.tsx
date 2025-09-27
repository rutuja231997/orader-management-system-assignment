// components/ToasterProvider.tsx
"use client";
import { Toaster } from "react-hot-toast";

export default function ToasterProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}
