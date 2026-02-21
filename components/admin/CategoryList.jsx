"use client";

import React, { useState, useEffect } from "react";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", icon: "📦" });

  useEffect(() => {
    const saved = localStorage.getItem("shababy_categories");
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      const defaults = [
        { id: 1, name: "أحذية", productCount: 0, icon: "👟" },
        { id: 2, name: "ملابس", productCount: 0, icon: "👕" },
        { id: 3, name: "إكسسوارات", productCount: 0, icon: "⌚" },
      ];
      setCategories(defaults);
      localStorage.setItem("shababy_categories", JSON.stringify(defaults));
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    let updated;
    if (editingCategory) {
      updated = categories.map((c) =>
        c.id === editingCategory.id ? { ...c, ...formData } : c,
      );
    } else {
      updated = [
        ...categories,
        { ...formData, id: Date.now(), productCount: 0 },
      ];
    }
    setCategories(updated);
    localStorage.setItem("shababy_categories", JSON.stringify(updated));
    closeModal();
  };

  const deleteCategory = (id) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    localStorage.setItem("shababy_categories", JSON.stringify(updated));
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, icon: category.icon });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", icon: "📦" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black text-foreground">التصنيفات</h2>
          <p className="text-foreground/50 font-bold">
            تنظيم المنتجات في مجموعات لتسهيل التسوق
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-8 py-4 bg-foreground text-background font-black rounded-2xl shadow-xl shadow-foreground/10 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
        >
          <span>➕</span>
          <span>إضافة تصنيف</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-card border border-border p-10 rounded-[2.5rem] flex flex-col items-center gap-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className="size-20 bg-foreground/5 rounded-3xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
              {cat.icon}
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-foreground">
                {cat.name}
              </h3>
              <p className="text-sm font-bold text-foreground/40">
                تصنيف فعّال في المتجر
              </p>
            </div>
            <div className="flex gap-2 w-full mt-4">
              <button
                onClick={() => openModal(cat)}
                className="flex-1 py-3 bg-foreground/5 rounded-xl font-bold hover:bg-foreground hover:text-background transition-all"
              >
                تعديل
              </button>
              <button
                onClick={() => deleteCategory(cat.id)}
                className="px-5 py-3 bg-red-500/5 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
            onClick={closeModal}
          />
          <form
            onSubmit={handleSave}
            className="relative w-full max-w-md bg-card border border-border p-10 rounded-[2.5rem] shadow-2xl animate-fade-in-up flex flex-col gap-6"
          >
            <h3 className="text-2xl font-black text-foreground">
              {editingCategory ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-foreground/40 pr-2">
                اسم التصنيف
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-foreground/5 border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold"
                placeholder="مثال: ساعات ذكية"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-foreground/40 pr-2">
                أيقونة (Emoji)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="w-full bg-foreground/5 border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold text-center text-2xl"
                placeholder="📦"
                maxLength={2}
                required
              />
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 py-4 bg-foreground text-background font-black rounded-2xl shadow-lg shadow-foreground/10 active:scale-95 transition-all"
              >
                حفظ
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-8 py-4 bg-foreground/5 text-foreground font-black rounded-2xl active:scale-95 transition-all"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
