"use client"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, Order } from "@/redux/slices/admin.ordersSlice";
import { RootState, AppDispatch } from "@/redux/store";

import { Button } from "@/components/ui/button-custom";
import { Input } from "@/components/ui/input-custom";
import { Layout } from "@/components/Layout";
import toast from "react-hot-toast";

import { editOrder, deleteOrder } from "@/redux/slices/admin.ordersSlice";


export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading} = useSelector((state: RootState) => state.orders);

  const [filterText, setFilterText] = useState("");
  const [filterDate, setFilterDate] = useState("");


  const [editingProductName, setEditingProductName] = useState<{ [key: string]: string | undefined}>({});
  const [editingStatus, setEditingStatus] = useState<{ [key: string]: string | undefined}>({});
  const [editingQuantity, setEditingQuantity] = useState<{ [key: string]: number | undefined }>({});

  // Local filtered orders
  const filteredOrders: Order[] = orders.filter(order => {
    const matchesText =
      filterText === "" ||
      order.product_name.toLowerCase().includes(filterText.toLowerCase()) ||
      order.customer_id.name.toLowerCase().includes(filterText.toLowerCase());

    const matchesDate =
      filterDate === "" ||
      new Date(order.createdAt).toDateString() === new Date(filterDate).toDateString();

    return matchesText && matchesDate;
  });

    useEffect(() => {
    dispatch(fetchOrders({}));
    }, [dispatch]);

    const handleFilterTextChange = (value: string) => setFilterText(value);
    const handleFilterDateChange = (value: string) => setFilterDate(value);
    const handleClearFilters = () => {
      setFilterText("");
      setFilterDate("");
    };

      // Other functions like handleDeleteOrder, handleQuantityEdit remain the same
      const handleQuantityEdit = (orderId: string, newQuantity: number) => {
      dispatch(editOrder({ id: orderId, quantity: newQuantity }))
      .unwrap()
      .then((res) => {
      toast.success(res.message, {
        position:"top-center"
      });
      setEditingQuantity((prev) => ({ ...prev, [orderId]: newQuantity }));
      })
      .catch((err) => {
      toast.error(err, {
        position:"top-center"
      });
      });
    };


    const handleProductNameEdit = (orderId: string, newName: string) => {
      dispatch(editOrder({ id: orderId, product_name: newName }))
      .unwrap()
      .then((res) => {
      toast.success(res.message,{
        position:"top-center"
      });
      setEditingProductName((prev) => ({ ...prev, [orderId]: newName }));
      })
      .catch((err) => {
      toast.error(err, {
        position:"top-center"
      });
      });
    };

    const handleStatusChange = (orderId: string, newStatus: string) => {
      dispatch(editOrder({ id: orderId, status: newStatus }))
      .unwrap()
      .then((res) => {
      toast.success(res.message, {
        position:"top-center"
      });
      setEditingStatus((prev) => ({ ...prev, [orderId]: newStatus }));
      })
      .catch((err) => {
        toast.error(err, {
          position:"top-center"
        });
      });
    };

    const handleDelete = (id: string) => {
    dispatch(deleteOrder(id))
      .unwrap() 
      .then((res) => {
        toast.success(res.message, {
          position:"top-center",
        });
      })
      .catch((err) => {
        toast.error(err || "Failed to delete order", {
          position:"top-center"
        }); 
      });
    };

  return (
        <Layout>
          
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Order Management Dashboard</h1>
              <p className="text-muted-foreground">Manage and track all customer orders</p>
            </div>

            {loading && <p>Loading orders...</p>}

            {/* Filters */}
            <div className="bg-card rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Search by Product or Customer"
              value={filterText}
              onChange={(e) => handleFilterTextChange(e.target.value)}
              placeholder="Enter product name or customer name"
            />
            <Input
              label="Filter by Date"
              type="date"
              value={filterDate}
              onChange={(e) => handleFilterDateChange(e.target.value)}
            />
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                disabled={!filterText && !filterDate}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
            </div>

            {/* Orders Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
            <p className="text-2xl font-bold text-foreground">{filteredOrders.length}</p>
          </div>
          <div className="bg-card rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
            <p className="text-2xl font-bold text-warning">
              {filteredOrders.filter(order => order.status === 'pending').length}
            </p>
          </div>
          <div className="bg-card rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Processing</h3>
            <p className="text-2xl font-bold text-primary">
              {filteredOrders.filter(order => order.status === 'processing').length}
            </p>
          </div>
          <div className="bg-card rounded-lg shadow-md p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Shipped</h3>
            <p className="text-2xl font-bold text-accent">
              {filteredOrders.filter(order => order.status === 'shipped').length}
            </p>
          </div>
            </div>

            {/* Orders Table */}
            <div className="bg-card rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">All Orders</h2>
              </div>
          
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No orders found matching your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Quantity</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm text-foreground">#{order._id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{order.customer_id.name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer_id.email}</p>
                        </div>
                      </td>
                      {/* product name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                             <input type="text" 
                              value={editingProductName[order._id] ?? order.product_name} 
                              onChange={(e) => setEditingProductName((prev) => ({ ...prev, [order._id]: e.target.value }))}
                              className="w-32 h-8 text-sm border border-border rounded px-2 focus:outline-none focus:ring-2 focus:ring-ring"/>
                              {editingProductName[order._id] && editingProductName[order._id] !== order.product_name &&
                              ( 
                              <Button variant="primary" size="sm" onClick={() => handleProductNameEdit(order._id, editingProductName[order._id] ?? order.product_name)}>
                                Save
                              </Button>
                              )}
                        </div>
                      </td>
                      
                      {/* product quantity */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={editingQuantity[order._id] ?? order.quantity}
                            onChange={(e) => setEditingQuantity(prev => ({ 
                              ...prev, 
                              [order._id]: parseInt(e.target.value) || 1 
                            }))}
                            className="w-16 h-8 text-sm border border-border rounded px-2 focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                          {editingQuantity[order._id] && editingQuantity[order._id] !== order.quantity && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleQuantityEdit(order._id, editingQuantity[order._id] ?? order.quantity)}
                            >
                              Save
                            </Button>
                          )}
                        </div>
                      </td>
                      {/* order date */}
                      <td className="py-3 px-4 text-sm text-foreground">{new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      {/* product status */}
                      <td className="py-3 px-4">
                        <select value={editingStatus[order._id] ?? order.status}
                           onChange={(e) => {
                            const newStatus = e.target.value;
                            setEditingStatus((prev) => ({ ...prev, [order._id]: newStatus }));
                            handleStatusChange(order._id, newStatus); // ✅ update immediately
                          }}
                          className="border-[1px]">
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={()=>handleDelete(order._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
            </div>
          </div>
        </Layout>
  );
}
