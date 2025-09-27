"use client"

import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button-custom';
import { Input } from '@/components/ui/input-custom';

import { createOrder, resetOrderState } from "@/redux/slices/customer.orderSlice";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from '@/redux/store';

export default function OrderForm() {

  const dispatch = useAppDispatch();
  const { loading, success, fieldErrors } = useAppSelector((state) => state.order);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_number: "",
    shipping_address: "",
    product_name: "",
    quantity: 1,
  });

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(
      createOrder({
        ...formData,
        quantity: Number(formData.quantity),
        product_image: file ?? undefined,
      })
    );
  };

  useEffect(() => {
    if (success) {
      alert("Order created successfully!");
      dispatch(resetOrderState());
      setFormData({
        name: "",
        email: "",
        contact_number: "",
        shipping_address: "",
        product_name: "",
        quantity: 1,
      });
      setFile(null);

      if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    }
  }, [success, dispatch]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">Place Your Order</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="name"
                label="Name *"
                value={formData.name}
                onChange={handleChange}
                error={fieldErrors?.name}
                placeholder="Enter your full name"
                maxLength={30}
              />

              <Input
                name="email"
                label="Email Address *"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={fieldErrors?.email}
                placeholder="your@email.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="contact_number"
                label="Contact Number *"
                type="tel"
                value={formData.contact_number}
                onChange={handleChange}
                error={fieldErrors?.contact_number}
                placeholder="9892456568"
                maxLength={10}
              />

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Quantity *
                </label>
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                />
                <p className="text-sm text-destructive">{fieldErrors?.quantity}</p>
    
              </div>
            </div>

            <Input
              name="shipping_address"
              label="Shipping Address *"
              value={formData.shipping_address}
              onChange={handleChange}
              error={fieldErrors?.shipping_address}
              placeholder="Enter your complete shipping address"
              maxLength={100}
            />

            <Input
              name="product_name"
              label="Product Name *"
              value={formData.product_name}
              onChange={handleChange}
              error={fieldErrors?.product_name}
              placeholder="Enter the product name"
              maxLength={50}
            />

            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Product Image (Optional)
              </label>
              <input
                ref={fileInputRef} 
                name="product_image"
                id="productImage"
                type="file"
                accept='image/*'
                onChange={handleFileChange}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              />
              <p className="text-xs text-muted-foreground">
                JPG or PNG files only, max 2MB
              </p>
              <p className="text-sm text-destructive">{fieldErrors?.product_image}</p>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}