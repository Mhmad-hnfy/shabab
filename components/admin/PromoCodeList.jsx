"use client";

import React, { useState, useEffect } from "react";

export default function PromoCodeList() {
  const [promos, setPromos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discountPercent: 10,
    isActive: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("shababy_promos");
    if (saved) {
      setPromos(JSON.parse(saved));
    } else {
      const defaults = [
        { id: 1, code: "WELCOME10", discountPercent: 10, isActive: true },
        { id: 2, code: "SALE20", discountPercent: 20, isActive: true },
      ];
      setPromos(defaults);
      localStorage.setItem("shababy_promos", JSON.stringify(defaults));
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    let updated;
    const finalPromo = {
      ...formData,
      id: editingPromo ? editingPromo.id : Date.now(),
      code: formData.code.toUpperCase().trim(),
    };

    if (editingPromo) {
      updated = promos.map((p) => (p.id === editingPromo.id ? finalPromo : p));
    } else {
      updated = [...promos, finalPromo];
    }
    setPromos(updated);
    localStorage.setItem("shababy_promos", JSON.stringify(updated));
    closeModal();
  };

  const deletePromo = (id) => {
    if (confirm("هل أنت متأكد من حذف كود الخصم هذا؟")) {
      const updated = promos.filter((p) => p.id !== id);
      setPromos(updated);
      localStorage.setItem("shababy_promos", JSON.stringify(updated));
    }
  };

  const toggleStatus = (id) => {
    const updated = promos.map((p) =>
      p.id === id ? { ...p, isActive: !p.isActive } : p,
    );
    setPromos(updated);
    localStorage.setItem("shababy_promos", JSON.stringify(updated));
  };

  const openModal = (promo = null) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData(promo);
    } else {
      setEditingPromo(null);
      setFormData({ code: "", discountPercent: 10, isActive: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPromo(null);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black text-foreground">أكواد الخصم</h2>
          <p className="text-foreground/50 font-bold">
            إدارة قسائم التخفيض والعروض الخاصة
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-8 py-4 bg-foreground text-background font-black rounded-2xl shadow-xl shadow-foreground/10 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
        >
          <span>➕</span>
          <span>إنشاء كود</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className={`bg-card border border-border p-8 rounded-[2.5rem] shadow-sm flex flex-col gap-6 relative overflow-hidden group transition-all ${!promo.isActive ? "opacity-50 grayscale-[0.5]" : ""}`}
          >
            {!promo.isActive && (
              <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px] pointer-events-none z-0 flex items-center justify-center font-black text-foreground/20 text-xl uppercase tracking-widest rotate-12">
                غير مفعل
              </div>
            )}

            <div className="flex justify-between items-start relative z-10">
              <div className="px-5 py-2 bg-secondary/10 text-secondary font-black rounded-xl text-lg tracking-widest border border-secondary/20">
                {promo.code}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(promo.id)}
                  className="size-10 bg-foreground/5 rounded-xl flex items-center justify-center hover:bg-foreground hover:text-background transition-all"
                >
                  {promo.isActive ? "⏸️" : "▶️"}
                </button>
                <button
                  onClick={() => openModal(promo)}
                  className="size-10 bg-foreground/5 rounded-xl flex items-center justify-center hover:bg-foreground hover:text-background transition-all"
                >
                  📝
                </button>
                <button
                  onClick={() => deletePromo(promo.id)}
                  className="size-10 bg-red-500/5 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 relative z-10">
              <span className="text-4xl font-black text-foreground">
                {promo.discountPercent}%
              </span>
              <span className="text-xs font-bold text-foreground/30 uppercase tracking-widest">
                خصم على إجمالي الطلب
              </span>
            </div>
          </div>
        ))}
        {promos.length === 0 && (
          <div className="col-span-full py-20 border-2 border-dashed border-border rounded-[3rem] text-center font-bold text-foreground/20">
            لا توجد أكواد خصم نشطة حالياً
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
            onClick={closeModal}
          />
          <form
            onSubmit={handleSave}
            className="relative w-full max-w-md bg-card border border-border p-10 rounded-[3rem] shadow-2xl flex flex-col gap-8 animate-fade-in-up"
          >
            <h3 className="text-2xl font-black text-foreground">
              {editingPromo ? "تعديل الكود" : "إنشاء كود جديد"}
            </h3>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
                  كود الخصم (مثال: SAVE20)
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full bg-foreground/5 border border-border p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-black tracking-widest"
                  placeholder="CODE"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
                  نسبة الخصم (%)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={formData.discountPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPercent: e.target.value,
                    })
                  }
                  className="w-full bg-foreground/5 border border-border p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-black text-secondary"
                />
              </div>

              <div className="flex items-center gap-3 bg-foreground/5 p-4 rounded-2xl">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="size-5 accent-foreground cursor-pointer"
                />
                <label className="font-bold text-foreground text-sm cursor-pointer">
                  تفعيل الكود فوراً
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 py-4 bg-foreground text-background font-black rounded-2xl active:scale-95 transition-all"
              >
                حفظ الكود
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
