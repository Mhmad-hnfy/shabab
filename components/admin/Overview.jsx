"use client";

import React, { useState, useEffect } from "react";

export default function Overview() {
  const [stats, setStats] = useState([
    {
      label: "إجمالي المبيعات",
      value: "EGP٠",
      icon: "💰",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "الطلبات النشطة",
      value: "٠",
      icon: "📦",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "إجمالي المنتجات",
      value: "٠",
      icon: "🏷️",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "تقييم المتجر",
      value: "٠",
      icon: "⭐",
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
  ]);
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    // Load data
    const products = JSON.parse(
      localStorage.getItem("shababy_products") || "[]",
    );
    const orders = JSON.parse(localStorage.getItem("shababy_orders") || "[]");

    // Helper to convert Arabic digits to Western digits
    const toEn = (str) => str.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

    // Calculate Stats
    const totalRevenue = orders.reduce((acc, curr) => {
      const val =
        typeof curr.total === "string"
          ? parseFloat(curr.total.replace("$", "").replace("EGP", ""))
          : curr.total;
      return acc + (val || 0);
    }, 0);
    const activeOrders = orders.filter(
      (o) => o.status === "قيد التنفيذ",
    ).length;
    const avgRating =
      products.length > 0
        ? (
            products.reduce(
              (acc, curr) => acc + (parseFloat(curr.rating) || 0),
              0,
            ) / products.length
          ).toFixed(1)
        : "٠";

    setStats([
      {
        label: "إجمالي المبيعات",
        value: `${totalRevenue.toLocaleString()} EGP`,
        icon: "💰",
        color: "text-green-500",
        bg: "bg-green-500/10",
      },
      {
        label: "الطلبات النشطة",
        value: activeOrders.toString(),
        icon: "📦",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      },
      {
        label: "إجمالي المنتجات",
        value: products.length.toString(),
        icon: "🏷️",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
      },
      {
        label: "تقييم المتجر",
        value: avgRating,
        icon: "⭐",
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
      },
    ]);

    // Calculate Dynamic Sales Chart (Last 7 Days)
    const days = [
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push({
        label: days[d.getDay()],
        dateStr: d.toLocaleDateString("ar-EG"),
        count: 0,
      });
    }

    orders.forEach((order) => {
      const dayMatch = last7Days.find(
        (d) => toEn(d.dateStr) === toEn(order.date),
      );
      if (dayMatch) dayMatch.count++;
    });

    const maxOrders = Math.max(...last7Days.map((d) => d.count), 1);
    const dynamicData = last7Days.map((d) => ({
      day: d.label,
      val: (d.count / maxOrders) * 100 || 5, // Minimum 5% height for empty days to keep it look "premium"
      count: d.count,
    }));

    setSalesData(dynamicData);
    setRecentOrders(orders.slice(-3).reverse());
    setTopProducts(products.slice(0, 3));
  }, []);

  const getStatusStyle = (status) => {
    const maps = {
      "تم التسليم": "bg-green-500/10 text-green-600 border-green-500/10",
      "قيد التنفيذ": "bg-yellow-500/10 text-yellow-600 border-yellow-500/10",
      "تم الشحن": "bg-blue-500/10 text-blue-600 border-blue-500/10",
    };
    return maps[status] || "bg-foreground/5 text-foreground/50 border-border";
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-foreground">
          نظرة عامة على المتجر
        </h2>
        <p className="text-foreground/50 font-bold">
          إليك ما يحدث في متجرك اليوم
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border p-8 rounded-[2rem] flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`size-14 ${stat.bg} rounded-2xl flex items-center justify-center text-2xl`}
            >
              {stat.icon}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-black text-foreground/40 uppercase tracking-wider">
                {stat.label}
              </span>
              <span className="text-2xl font-black text-foreground">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border p-10 rounded-[3rem] shadow-sm flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-black text-foreground">
            تحليلات المبيعات (أسبوعياً)
          </h3>
          <p className="text-foreground/40 font-bold text-xs text-right">
            معدل الطلبات اليومي خلال الـ ٧ أيام الماضية
          </p>
        </div>

        <div className="flex items-end justify-between h-64 gap-2 md:gap-4 px-4 border-b border-foreground/5 relative">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border-t border-foreground/10 w-full h-0"
              />
            ))}
          </div>

          {salesData.map((d, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center gap-4 group h-full justify-end"
            >
              <div
                className="w-full max-w-[40px] bg-secondary/10 rounded-t-xl relative overflow-hidden group-hover:bg-secondary/20 transition-all cursor-pointer"
                style={{ height: `${d.val}%` }}
              >
                <div
                  className="absolute inset-x-0 bottom-0 bg-secondary rounded-t-xl transition-all duration-1000 animate-slide-up"
                  style={{ height: `100%` }}
                />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background px-3 py-1 rounded-lg text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                  {d.count} طلب
                </div>
              </div>
              <span className="text-[10px] font-black text-foreground/30 truncate w-full text-center">
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border p-8 rounded-[2rem] flex flex-col gap-6">
          <h3 className="text-xl font-bold text-foreground">آخر الطلبات</h3>
          <div className="flex flex-col gap-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-foreground/5 rounded-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-secondary rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                      {order.id}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">
                        {order.customer}
                      </span>
                      <span className="text-[10px] font-bold text-foreground/30">
                        {order.date}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-foreground">
                    {order.total}
                  </span>
                  <span
                    className={`px-3 py-1 text-[10px] font-black rounded-full border ${getStatusStyle(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center font-bold text-foreground/20 py-10">
                لا توجد طلبات حديثة
              </p>
            )}
          </div>
        </div>

        <div className="bg-card border border-border p-8 rounded-[2rem] flex flex-col gap-6">
          <h3 className="text-xl font-bold text-foreground">
            المنتجات الأكثر مبيعاً
          </h3>
          <div className="flex flex-col gap-4">
            {topProducts.length > 0 ? (
              topProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 bg-foreground/5 rounded-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-foreground/5 rounded-xl border border-border p-2">
                      <img
                        src={
                          p.image ||
                          "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png"
                        }
                        alt="product"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">
                        {p.name}
                      </span>
                      <span className="text-[10px] font-black text-secondary">
                        {p.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-black text-foreground">
                      {p.price} EGP
                    </span>
                    <span className="text-[10px] font-bold text-yellow-600">
                      ⭐ {p.rating}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center font-bold text-foreground/20 py-10">
                لا توجد منتجات مضافة
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
