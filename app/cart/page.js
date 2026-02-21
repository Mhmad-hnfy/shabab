"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("shababy_cart") || "[]");
    setCartItems(savedCart);
  }, []);

  const updateQuantity = (id, delta) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem("shababy_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("shababy_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-6 py-20 animate-fade-in-up">
        <h1 className="text-4xl font-black text-foreground mb-12">
          سلة التسوق
        </h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items List */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card border border-border p-6 rounded-[2.5rem] flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="size-24 bg-foreground/5 rounded-2xl flex items-center justify-center overflow-hidden p-2 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <h3 className="text-lg font-black text-foreground">
                      {item.name}
                    </h3>
                    <p className="text-secondary font-bold">{item.price} EGP</p>
                  </div>

                  <div className="flex items-center gap-4 bg-foreground/5 p-2 rounded-xl">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="size-8 bg-background rounded-lg font-black hover:bg-secondary hover:text-white transition-all"
                    >
                      -
                    </button>
                    <span className="font-black text-lg">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="size-8 bg-background rounded-lg font-black hover:bg-secondary hover:text-white transition-all"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="size-10 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="h-fit sticky top-32">
              <div className="bg-card border border-border p-8 rounded-[3rem] shadow-xl flex flex-col gap-8">
                <h3 className="text-xl font-black text-foreground border-b border-border pb-4">
                  ملخص الطلب
                </h3>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between font-bold text-foreground/50">
                    <span>المجموع الفرعي</span>
                    <span>{subtotal.toFixed(2)} EGP</span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground/50">
                    <span>الشحن</span>
                    <span className="text-green-500">مجاني</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-xl font-black">الإجمالي</span>
                  <span className="text-3xl font-black text-secondary">
                    {subtotal.toFixed(2)} EGP
                  </span>
                </div>

                <a
                  href={`/checkout/cart`}
                  className="w-full py-4 bg-foreground text-background font-black rounded-2xl text-center shadow-xl shadow-foreground/10 hover:opacity-90 active:scale-95 transition-all"
                >
                  إتمام الشراء
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-foreground/5 rounded-[3rem] p-20 text-center flex flex-col items-center gap-6">
            <div className="size-20 bg-foreground/5 rounded-full flex items-center justify-center text-4xl">
              🛒
            </div>
            <p className="text-2xl font-black text-foreground/20">
              سلة التسوق فارغة حالياً
            </p>
            <a
              href="/"
              className="px-8 py-3 bg-secondary text-white font-black rounded-xl hover:opacity-90 transition-all"
            >
              ابدأ التسوق
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
