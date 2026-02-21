"use client";

import React, { useState, useEffect } from "react";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const openOrder = (order) => {
    setSelectedOrder(order);
    if (!order.status || order.status === "new") {
      const updated = orders.map((o) =>
        o.id === order.id ? { ...o, status: "viewed" } : o,
      );
      setOrders(updated);
      localStorage.setItem("shababy_orders", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    }
  };

  useEffect(() => {
    const fetchOrders = () => {
      const saved = localStorage.getItem("shababy_orders");
      if (saved) setOrders(JSON.parse(saved));
    };
    fetchOrders();
    window.addEventListener("storage", fetchOrders);
    return () => window.removeEventListener("storage", fetchOrders);
  }, []);

  const updateStatus = (id, newStatus) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: newStatus } : o,
    );
    setOrders(updated);
    localStorage.setItem("shababy_orders", JSON.stringify(updated));
  };

  const deleteOrder = (id) => {
    if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      const updated = orders.filter((o) => o.id !== id);
      setOrders(updated);
      localStorage.setItem("shababy_orders", JSON.stringify(updated));
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "تم التسليم":
        return "bg-green-500/10 text-green-600 border-green-500/10";
      case "قيد التنفيذ":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/10";
      case "تم الشحن":
        return "bg-blue-500/10 text-blue-600 border-blue-500/10";
      case "new":
        return "bg-secondary/10 text-secondary border-secondary/10";
      default:
        return "bg-foreground/5 text-foreground/40 border-foreground/5";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black text-foreground">الطلبات الواردة</h2>
        <p className="text-foreground/50 font-bold">
          تتبع وإدارة طلبات العملاء وتفاصيل الشحن
        </p>
      </div>

      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-right border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-foreground/5 text-foreground/40 text-xs font-black uppercase tracking-widest">
              <th className="px-8 py-6">رقم الطلب</th>
              <th className="px-8 py-6">العميل</th>
              <th className="px-8 py-6 text-center">المنتج</th>
              <th className="px-8 py-6 text-center">الإجمالي</th>
              <th className="px-8 py-6 text-center">الحالة</th>
              <th className="px-8 py-6 text-left">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-foreground/[0.02] transition-colors group"
              >
                <td className="px-8 py-6 font-black text-secondary">
                  {order.id}
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-foreground">
                      {order.customer}
                    </span>
                    <span className="text-[10px] font-bold text-foreground/30">
                      {order.phones?.[0]}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm font-bold text-foreground/70 text-center">
                  {order.product} (x{order.quantity})
                </td>
                <td className="px-8 py-6 font-black text-foreground text-center">
                  {order.total}
                </td>
                <td className="px-8 py-6 text-center">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`px-4 py-2 rounded-full text-[10px] font-black border outline-none cursor-pointer appearance-none text-center ${getStatusStyle(order.status)}`}
                  >
                    <option value="new">طلب جديد</option>
                    <option value="قيد التنفيذ">قيد التنفيذ</option>
                    <option value="تم الشحن">تم الشحن</option>
                    <option value="تم التسليم">تم التسليم</option>
                  </select>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openOrder(order)}
                      className="size-10 bg-foreground/5 rounded-xl flex items-center justify-center hover:bg-foreground hover:text-background transition-all"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="size-10 bg-red-500/5 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-8 py-20 text-center font-bold text-foreground/20"
                >
                  لا توجد طلبات واردة حالياً
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/60 backdrop-blur-md animate-fade-in">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative w-full max-w-lg bg-card border border-border p-10 rounded-[2.5rem] shadow-2xl flex flex-col gap-8 animate-zoom-in">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-black text-foreground">
                تفاصيل الطلب {selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="size-8 bg-foreground/5 rounded-full flex items-center justify-center font-bold"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                  العميل
                </span>
                <span className="font-bold text-foreground">
                  {selectedOrder.customer}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                  الهواتف
                </span>
                <span className="font-bold text-foreground">
                  {selectedOrder.phones?.join(" / ")}
                </span>
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                  العنوان
                </span>
                <span className="font-bold text-foreground leading-relaxed">
                  {selectedOrder.address}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                  طريقة الدفع
                </span>
                <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full font-black text-[10px] w-fit">
                  {selectedOrder.paymentMethod}
                </span>
              </div>
              {selectedOrder.promoCode && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                    كود الخصم
                  </span>
                  <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full font-black text-[10px] w-fit">
                    {selectedOrder.promoCode}
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                  التاريخ
                </span>
                <span className="font-bold text-foreground">
                  {selectedOrder.date}
                </span>
              </div>
            </div>

            <div className="p-6 bg-foreground/5 rounded-2xl flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-lg font-black text-foreground">
                  {selectedOrder.product}
                </span>
                <span className="text-sm font-bold text-foreground/40">
                  الكمية: {selectedOrder.quantity}
                </span>
              </div>
              <span className="text-2xl font-black text-secondary">
                {selectedOrder.total}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
