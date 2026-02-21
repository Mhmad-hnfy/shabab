"use client";

import React, { useState, useEffect } from "react";
import Card from "./Card";

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("الكل");

  useEffect(() => {
    const fetchAll = () => {
      const savedProducts = localStorage.getItem("shababy_products");
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedCats = localStorage.getItem("shababy_categories");
      if (savedCats) setCategories(JSON.parse(savedCats));
    };

    fetchAll();
    window.addEventListener("storage", fetchAll);
    return () => window.removeEventListener("storage", fetchAll);
  }, []);

  const filteredProducts =
    activeCategory === "الكل"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col gap-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in-up">
        <div className="flex flex-col gap-4 text-right">
          <h2 className="text-4xl md:text-6xl font-black text-foreground leading-tight">
            اكتشف <span className="text-secondary">الجودة والفخامة</span>
          </h2>
          <p className="text-foreground/50 text-xl max-w-2xl leading-relaxed">
            مجموعتنا المختارة بعناية تعكس ذوقك الرفيع، صُممت لتمنحك الراحة
            والأناقة التي تستحقها.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveCategory("الكل")}
            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${activeCategory === "الكل" ? "bg-foreground text-background shadow-lg shadow-foreground/20" : "bg-foreground/5 text-foreground/40 hover:bg-foreground/10"}`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap flex items-center gap-2 ${activeCategory === cat.name ? "bg-foreground text-background shadow-lg shadow-foreground/20" : "bg-foreground/5 text-foreground/40 hover:bg-foreground/10"}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredProducts.map((product, i) => (
            <Card key={product.id || i} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="bg-foreground/5 rounded-[3rem] p-20 text-center animate-fade-in-up">
          <p className="text-2xl font-black text-foreground/20">
            لا توجد منتجات معروضة حالياً في هذا التصنيف.
          </p>
        </div>
      )}
    </section>
  );
}

export default ProductGrid;
