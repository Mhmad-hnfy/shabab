"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function InvoicePage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("shababy_orders") || "[]");
    const found = orders.find((o) => o.id === id);
    if (found) setOrder(found);
  }, [id]);

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center font-black">
        جاري جلب الفاتورة...
      </div>
    );

  return (
    <div className="min-h-screen bg-foreground/10 py-20 px-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-card rounded-[3rem] shadow-2xl p-12 md:p-16 flex flex-col gap-10 relative overflow-hidden">
        {/* Decoration */}
        <div className="absolute top-0 left-0 w-full h-3 bg-secondary" />

        <div className="flex flex-col items-center text-center gap-4">
          <div className="size-24 bg-green-500 rounded-full flex items-center justify-center text-white text-5xl animate-bounce">
            ✓
          </div>
          <h1 className="text-4xl font-black text-foreground">شكراً لطلبك!</h1>
          <p className="text-foreground/40 font-bold">
            تم تسجيل طلبك بنجاح وجاري التحضير للشحن
          </p>
        </div>

        <div className="flex flex-col gap-6 py-10 border-y-2 border-dashed border-foreground/5">
          <div className="flex justify-between items-center">
            <span className="text-foreground/30 font-black uppercase tracking-widest text-xs">
              رقم الفاتورة
            </span>
            <span className="font-black text-foreground">{order.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground/30 font-black uppercase tracking-widest text-xs">
              التاريخ
            </span>
            <span className="font-black text-foreground">{order.date}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground/30 font-black uppercase tracking-widest text-xs">
              العميل
            </span>
            <span className="font-black text-foreground">{order.customer}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground/30 font-black uppercase tracking-widest text-xs">
              طريقة الدفع
            </span>
            <span className="px-4 py-1.5 bg-foreground/5 rounded-full font-black text-xs">
              {order.paymentMethod}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-xs font-black text-foreground/40 uppercase tracking-widest">
            تفاصيل الطلب
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-black text-foreground">
                {order.product}
              </span>
              <span className="text-sm font-bold text-foreground/40">
                الكمية: {order.quantity}
              </span>
            </div>
            <span className="text-xl font-black text-secondary">
              {order.total}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-8 bg-foreground/5 rounded-[2.5rem]">
          <h3 className="text-xs font-black text-foreground/40 uppercase tracking-widest">
            عنوان الشحن
          </h3>
          <p className="font-bold text-foreground leading-relaxed">
            {order.address} <br />
            تلفون: {order.phones[0]}{" "}
            {order.phones[1] ? ` / ${order.phones[1]}` : ""}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="w-full py-5 border-2 border-foreground text-foreground rounded-2xl font-black hover:bg-foreground hover:text-background transition-all"
        >
          تحميل / طباعة الفاتورة
        </button>

        <a
          href="/"
          className="text-center font-black text-foreground/30 hover:text-foreground transition-colors text-sm"
        >
          العودة للرئيسية
        </a>
      </div>
    </div>
  );
}
