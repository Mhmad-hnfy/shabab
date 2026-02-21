"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/Card";
import { supabase } from "@/lib/supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: cats } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    setCategories(["الكل", ...(cats || []).map((c) => c.name)]);

    const { data: prods } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });

    setProducts(
      (prods || []).map((p) => ({
        ...p,
        category_name: p.categories?.name,
        category: p.categories?.name || p.category_name,
      })),
    );

    setLoading(false);
  };

  const filteredProducts = products.filter((p) => {
    if (!p.name) return false;
    const searchTerm = search.trim().toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm) ||
      (p.description && p.description.toLowerCase().includes(searchTerm));
    const matchesCategory =
      selectedCategory === "الكل" ||
      p.category === selectedCategory ||
      p.category_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-6xl font-black text-foreground tracking-tighter">
              منتجاتنا
            </h1>
            <p className="text-foreground/40 font-bold text-xl">
              اكتشف أحدث التشكيلات والقطع المميزة لدينا
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-96">
            <div className="relative group">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="w-full bg-card border border-border p-5 pr-14 rounded-3xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold text-lg transition-all shadow-xl shadow-foreground/[0.02]"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl opacity-30 group-focus-within:opacity-100 transition-opacity">
                🔍
              </span>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-4 rounded-2xl font-black whitespace-nowrap transition-all border-2 ${
                selectedCategory === cat
                  ? "bg-foreground text-background border-foreground shadow-xl shadow-foreground/10 scale-105"
                  : "bg-card border-border text-foreground/40 hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-card border border-border rounded-[2.5rem] animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((p, idx) => (
              <Card key={p.id} product={p} index={idx} />
            ))}
          </div>
        ) : (
          <div className="bg-card border-2 border-dashed border-border p-20 rounded-[4rem] text-center flex flex-col items-center gap-6 animate-fade-in">
            <div className="size-32 bg-foreground/5 rounded-full flex items-center justify-center text-6xl">
              📦
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-3xl font-black text-foreground">
                لايوجد نتائج
              </h3>
              <p className="text-foreground/40 font-bold">
                جرّب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً
              </p>
            </div>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("الكل");
              }}
              className="mt-4 px-10 py-4 bg-foreground text-background font-black rounded-2xl hover:opacity-90 transition-all"
            >
              عرض الكل
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
