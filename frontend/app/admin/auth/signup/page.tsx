"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { signUp } from "@/redux/slices/authSlice";

import { Button } from "@/components/ui/button-custom";
import {Input }from "@/components/ui/input-custom"
import { Layout } from "@/components/Layout";


export default function Signup() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, loading, fieldErrors } = useAppSelector((s) => s.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  useEffect(() => {
    if (isAuthenticated) router.push("/admin/dashboard"); // Auto redirect after signup
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signUp(form));
  };

  return (
        <Layout>
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-6 md:p-8 space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Admin Login</h1>
            <p className="text-muted-foreground mt-2">
              Access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
          <Input
          error={fieldErrors?.name}
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border w-full mb-3 p-2 rounded"
          required
          />
          <Input
          type="email"
          name="email"
          error={fieldErrors?.email}
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border w-full mb-3 p-2 rounded"
          required
          />
          <Input
          type="password"
          name="password"
           error={fieldErrors?.password}
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border w-full mb-3 p-2 rounded"
          required
          />

         <Input
          type="password"
          name="confirmPassword"
          error={fieldErrors?.confirmPassword}
          placeholder="confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="border w-full mb-3 p-2 rounded"
          required
          />
    
          <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? "Login" : "Sign up"}
          </Button>

        </form>

          <div className="">
            <Button size="lg" className="w-full" onClick={()=>router.push("/auth/login")}>Login</Button>
          </div>

        </div>
      </div>
    </Layout>
  );
}

