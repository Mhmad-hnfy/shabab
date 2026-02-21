"use client";

import React from "react";

export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
  notifications = { orders: 0, messages: 0 },
}) {
  const menuItems = [
    { id: "overview", label: "نظرة عامة", icon: "📊" },
    { id: "products", label: "المنتجات", icon: "📦" },
    { id: "categories", label: "التصنيفات", icon: "🏷️" },
    { id: "orders", label: "الطلبات", icon: "🛒", count: notifications.orders },
    {
      id: "messages",
      label: "الرسائل",
      icon: "💬",
      count: notifications.messages,
    },
    { id: "promos", label: "أكواد الخصم", icon: "🎟️" },
    { id: "settings", label: "الإعدادات", icon: "⚙️" },
  ];

  return (
    <aside className="w-72 bg-card border-l border-border flex flex-col p-8 gap-10 shadow-xl hidden md:flex">
      <div className="flex items-center gap-3">
        <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-background text-xl font-black">
          ش
        </div>
        <h1 className="text-2xl font-black text-blue-600">شبابى</h1>
      </div>

      <nav className="flex flex-col gap-2">
        <a
          href="/"
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-secondary hover:bg-secondary/5 transition-all mb-4 border border-secondary/10"
        >
          <span className="text-xl">🏠</span>
          <span>عرض المتجر</span>
        </a>

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all ${
              activeTab === item.id
                ? "bg-foreground text-background shadow-lg shadow-foreground/10"
                : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.count > 0 && (
              <span className="size-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-background animate-pulse">
                {item.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-500/5 transition-all"
        >
          <span className="text-xl">🚪</span>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
