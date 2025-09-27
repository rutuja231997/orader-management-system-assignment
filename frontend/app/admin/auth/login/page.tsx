"use client"

import { useAppDispatch, useAppSelector } from "@/redux/store";
import { signIn } from "@/redux/slices/authSlice";

import {Button} from "@/components/ui/button-custom"
import {Input} from "@/components/ui/input-custom";
import { Layout } from "@/components/Layout";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {

  const dispatch = useAppDispatch();
  const router = useRouter();
  const {loading, fieldErrors, isAuthenticated} = useAppSelector(
    (state)=> state.auth
  )

  const [formData, setFormData] = useState({email: "", password: ""});

  useEffect(()=>{
    if(isAuthenticated) router.push("/admin/dashboard")
  },[isAuthenticated, router])

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>)=> setFormData({
    ...formData, [e.target.name]: e.target.value
  });

  const handleLogin = (e:React.FormEvent)=>{
    e.preventDefault();
    dispatch(signIn({email: formData.email, password: formData.password}))
  }

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

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={fieldErrors?.email}
              placeholder="admin@example.com"
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              error={fieldErrors?.password}
              value={formData.password}
              onChange={handleInputChange}
              // error={errors.password}
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Sign Up" : "Login"}
            </Button>

          </form>

          <div className="space-y-6">
            <p className="text-center">forgot password</p>
            <Button size="lg" className="w-full" onClick={()=>router.push('/admin/auth/signup')}>Sign up</Button>
          </div>

        </div>
      </div>
    </Layout>
  );
}