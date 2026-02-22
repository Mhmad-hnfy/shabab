"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Login from "@/components/admin/Login";
import Overview from "@/components/admin/Overview";
import Products from "@/components/admin/ProductList";
import Categories from "@/components/admin/CategoryList";
import Orders from "@/components/admin/OrderList";
import Promos from "@/components/admin/PromoCodeList";
import Settings from "@/components/admin/Settings";
import Messages from "@/components/admin/MessageList";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState({
    orders: 0,
    messages: 0,
  });
  const [toast, setToast] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("shababy_theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("shababy_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("shababy_theme", "light");
    }
  };

  useEffect(() => {
    const checkNotifications = async () => {
      const { data: dbOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("status", "new")
        .order("created_at", { ascending: false });

      const { data: dbMessages } = await supabase
        .from("messages")
        .select("*")
        .eq("status", "new")
        .order("created_at", { ascending: false });

      const newOrders = dbOrders || [];
      const newMessages = dbMessages || [];

      setNotifications((prev) => {
        const hasMoreOrders = newOrders.length > prev.orders;
        const hasMoreMessages = newMessages.length > prev.messages;

        if (hasMoreOrders) {
          const latest = newOrders[0];
          setToast({
            type: "order",
            title: "طلب جديد!",
            text: `من: ${latest.customer_name || latest.customer}`,
          });
          const audio = new Audio(
            "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
          );
          audio.play().catch(() => {});
        } else if (hasMoreMessages) {
          const latest = newMessages[0];
          setToast({
            type: "message",
            title: "رسالة جديدة!",
            text: `من: ${latest.full_name || latest.name}`,
          });
          const audio = new Audio(
            "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
          );
          audio.play().catch(() => {});
        }
        return { orders: newOrders.length, messages: newMessages.length };
      });
    };

    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }

    checkNotifications();
    const interval = setInterval(checkNotifications, 5000); // Check every 5s
    return () => clearInterval(interval);
  }, [toast]);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
    if (status) {
      localStorage.setItem("shababy_admin_auth", "true");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("shababy_admin_auth");
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground" dir="rtl">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        notifications={notifications}
      />

      {/* Global Notification Toast */}
      {toast && (
        <div className="fixed top-8 right-8 z-[200] animate-in slide-in-from-right-full duration-500">
          <div className="bg-foreground text-background px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-5 border border-white/10 min-w-[320px] backdrop-blur-xl">
            <div
              className={`size-12 rounded-2xl flex items-center justify-center text-2xl animate-bounce ${toast.type === "order" ? "bg-secondary text-white" : "bg-blue-500 text-white"}`}
            >
              {toast.type === "order" ? "🛒" : "💬"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white">
                {toast.title}
              </span>
              <span className="text-xs font-bold text-white/50">
                {toast.text}
              </span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="mr-auto text-white/40 hover:text-white transition-colors font-black text-lg p-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex items-center justify-between bg-card border border-border p-4 px-8 rounded-[2rem] shadow-sm">
            <h3 className="text-xl font-black text-foreground">لوحة التحكم</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="size-12 flex items-center justify-center bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-2xl transition-all border border-border"
              >
                {isDarkMode ? "☀️" : "🌙"}
              </button>
              <div className="flex items-center gap-3 pr-4 border-r border-border">
                <div className="size-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-black">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black">مدير النظام</span>
                  <span className="text-[10px] text-foreground/40 font-bold">
                    Admin Store
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up">
            {activeTab === "overview" && <Overview />}
            {activeTab === "products" && <Products />}
            {activeTab === "categories" && <Categories />}
            {activeTab === "orders" && <Orders />}
            {activeTab === "messages" && <Messages />}
            {activeTab === "promos" && <Promos />}
            {activeTab === "settings" && <Settings />}
          </div>
        </div>
      </main>
    </div>
  );
}
