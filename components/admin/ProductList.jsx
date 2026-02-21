"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    rating: 5,
    stock: 10,
    hasDiscount: false,
    category: "",
    category_id: null,
    image: "",
    imageSource: "link",
    discountPercent: 0,
    images: [],
    paymentSettings: { visa: true, wallet: true, cash: true, fawry: true },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Fetch Categories
    const { data: cats, error: catErr } = await supabase
      .from("categories")
      .select("*");
    if (catErr) console.error(catErr);
    setCategories(cats || []);

    // Fetch Products
    const { data: prods, error: prodErr } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (prodErr) {
      console.error(prodErr);
    } else {
      // Map database fields to UI fields if naming differs
      const mappedProds = (prods || []).map((p) => ({
        ...p,
        hasDiscount: p.has_discount,
        discountPercent: p.discount_percent,
        paymentSettings: p.payment_settings,
      }));
      setProducts(mappedProds);
    }
    setLoading(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result,
          imageSource: "upload",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const dbData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      rating: Number(formData.rating),
      stock: Number(formData.stock),
      has_discount: formData.hasDiscount,
      discount_percent: Number(formData.discountPercent),
      category_name: formData.category,
      category_id: formData.category_id,
      image: formData.image,
      images: formData.images,
      payment_settings: formData.paymentSettings,
      updated_at: new Date(),
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(dbData)
        .eq("id", editingProduct.id);

      if (error) {
        alert("خطأ في تحديث المنتج");
        console.error(error);
      }
    } else {
      const { error } = await supabase.from("products").insert([dbData]);

      if (error) {
        alert("خطأ في إضافة المنتج");
        console.error(error);
      }
    }

    fetchData();
    closeModal();
  };

  const deleteProduct = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      alert("خطأ في حذف المنتج");
      console.error(error);
    } else {
      fetchData();
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        imageSource: product.image?.startsWith("data:") ? "upload" : "link",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        rating: 5,
        stock: 10,
        hasDiscount: false,
        category: categories.length > 0 ? categories[0].name : "",
        category_id: categories.length > 0 ? categories[0].id : null,
        image: "",
        imageSource: "link",
        discountPercent: 0,
        images: [],
        paymentSettings: { visa: true, wallet: true, cash: true, fawry: true },
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black text-foreground">
            إدارة المنتجات
          </h2>
          <p className="text-foreground/50 font-bold">
            عرض وتعديل وإضافة منتجات جديدة للمتجر
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-8 py-4 bg-foreground text-background font-black rounded-2xl shadow-xl shadow-foreground/10 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
        >
          <span>➕</span>
          <span>إضافة منتج</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-right border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-foreground/5 text-foreground/40 text-xs font-black uppercase tracking-widest">
              <th className="px-8 py-6 text-right">المنتج</th>
              <th className="px-8 py-6 text-right">التصنيف</th>
              <th className="px-8 py-6 text-center">السعر</th>
              <th className="px-8 py-6 text-center">المخزون</th>
              <th className="px-8 py-6 text-center">التقييم</th>
              <th className="px-8 py-6 text-left">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-8 py-20 text-center font-bold text-foreground/20 animate-pulse"
                >
                  جاري تحميل المنتجات...
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-foreground/[0.02] transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-14 bg-foreground/5 rounded-xl border border-border p-2 shrink-0">
                        <img
                          src={
                            p.image ||
                            "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png"
                          }
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <span className="font-bold text-foreground truncate max-w-[200px]">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-foreground/30 truncate max-w-[200px] font-bold">
                          {p.description}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-foreground/50">
                    {p.category_name || p.category}
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-foreground text-center">
                    {p.price} EGP
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black ${p.stock < 5 ? "bg-red-500/10 text-red-600" : "bg-green-500/10 text-green-600"}`}
                    >
                      {p.stock} قطعة
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-yellow-600 text-center flex items-center justify-center gap-1">
                    ⭐ {p.rating}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openModal(p)}
                        className="size-10 bg-foreground/5 rounded-xl flex items-center justify-center hover:bg-foreground hover:text-background transition-all"
                      >
                        📝
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="size-10 bg-red-500/5 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-8 py-20 text-center font-bold text-foreground/20"
                >
                  لا توجد منتجات مضافة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
            onClick={closeModal}
          />
          <form
            onSubmit={handleSave}
            className="relative w-full max-w-2xl bg-card border border-border p-8 md:p-10 rounded-[2.5rem] shadow-2xl animate-fade-in-up flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-black text-foreground">
              {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
                  اسم المنتج
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-foreground/5 border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold"
                  placeholder="مثال: حذاء كاجوال"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
                  السعر (EGP)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full bg-foreground/5 border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
                  نسبة الخصم (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPercent: e.target.value,
                    })
                  }
                  className="w-full bg-foreground/5 border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold text-secondary"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
                وصف المنتج
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-foreground/5 border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold min-h-[100px] resize-none"
                placeholder="اكتب وصفاً جذاباً للمنتج..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
                  التصنيف
                </label>
                <select
                  value={formData.category_id || ""}
                  onChange={(e) => {
                    const cat = categories.find((c) => c.id === e.target.value);
                    setFormData({
                      ...formData,
                      category_id: e.target.value,
                      category: cat?.name,
                    });
                  }}
                  className="w-full bg-foreground/5 border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold appearance-none"
                >
                  <option value="" disabled>
                    اختر التصنيف
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                  {categories.length === 0 && (
                    <option disabled>لا توجد تصنيفات</option>
                  )}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
                  المخزون (قطعة)
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="w-full bg-foreground/5 border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
                التقييم (النجوم)
              </label>
              <div className="flex gap-2 p-2 bg-foreground/5 rounded-2xl border border-border inline-flex w-fit">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`size-10 rounded-xl flex items-center justify-center text-xl transition-all ${formData.rating >= star ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/20" : "bg-background text-foreground/20"}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 p-6 bg-foreground/5 rounded-3xl border border-border">
              <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-black text-foreground/40 uppercase">
                  صورة المنتج الرئيسية
                </label>
                <div className="flex gap-2 p-1 bg-background rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, imageSource: "link" })
                    }
                    className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${formData.imageSource === "link" ? "bg-secondary text-white" : "text-foreground/40"}`}
                  >
                    رابط
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, imageSource: "upload" })
                    }
                    className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${formData.imageSource === "upload" ? "bg-secondary text-white" : "text-foreground/40"}`}
                  >
                    رفع ملف
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-3">
                  {formData.imageSource === "link" ? (
                    <input
                      type="text"
                      value={
                        formData.imageSource === "link" ? formData.image : ""
                      }
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full bg-background border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold text-xs"
                      placeholder="https://example.com/image.png"
                    />
                  ) : (
                    <div className="relative w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="w-full bg-background border-2 border-dashed border-border p-4 rounded-2xl text-center text-xs font-black text-foreground/30">
                        {formData.imageSource === "upload" &&
                        formData.image &&
                        formData.image.startsWith("data:")
                          ? "✅ تم اختيار ملف"
                          : "انقر لاختيار ملف صورة"}
                      </div>
                    </div>
                  )}
                </div>
                <div className="size-20 bg-background rounded-2xl border border-border shrink-0 p-2 flex items-center justify-center overflow-hidden group/thumb relative">
                  {formData.image ? (
                    <>
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            formData.image &&
                            !formData.images.includes(formData.image)
                          ) {
                            setFormData({
                              ...formData,
                              images: [...formData.images, formData.image],
                            });
                          }
                        }}
                        className="absolute inset-0 bg-secondary/80 text-white text-[10px] font-black opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-center p-2"
                      >
                        إضافة للجاليري
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] font-black text-foreground/20 text-center">
                      لا توجد معاينة
                    </span>
                  )}
                </div>
              </div>

              {/* Multi-Image Gallery Manager */}
              <div className="mt-4 flex flex-col gap-3">
                <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mr-2">
                  صور المنتج الإضافية (Gallery)
                </label>
                <div className="flex flex-wrap gap-3">
                  {formData.images?.map((img, idx) => (
                    <div
                      key={idx}
                      className="size-16 bg-background rounded-xl border border-border p-1 relative group/gal overflow-hidden"
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImgs = [...formData.images];
                          newImgs.splice(idx, 1);
                          setFormData({ ...formData, images: newImgs });
                        }}
                        className="absolute inset-0 bg-red-500/80 text-white font-black opacity-0 group-hover/gal:opacity-100 transition-opacity flex items-center justify-center text-xs"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                  {(!formData.images || formData.images.length === 0) && (
                    <div className="w-full py-4 border-2 border-dashed border-border rounded-xl text-center text-[10px] font-bold text-foreground/20">
                      اضغط على الصورة الرئيسية لإضافتها هنا
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-6 bg-foreground/5 rounded-3xl border border-border">
              <label className="text-xs font-black text-foreground/40 uppercase tracking-widest mr-2">
                طرق الدفع المسموحة لهذا المنتج
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-3 bg-background px-4 py-2 rounded-xl border border-border cursor-pointer hover:border-blue-500/50 transition-all select-none opacity-80 has-[:checked]:opacity-100 has-[:checked]:border-blue-500">
                  <input
                    type="checkbox"
                    checked={formData.paymentSettings?.visa}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentSettings: {
                          ...formData.paymentSettings,
                          visa: e.target.checked,
                        },
                      })
                    }
                    className="accent-blue-500 size-4"
                  />
                  <span className="text-xs font-black">فيزا / كارت</span>
                </label>
                <label className="flex items-center gap-3 bg-background px-4 py-2 rounded-xl border border-border cursor-pointer hover:border-purple-500/50 transition-all select-none opacity-80 has-[:checked]:opacity-100 has-[:checked]:border-purple-500">
                  <input
                    type="checkbox"
                    checked={formData.paymentSettings?.wallet}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentSettings: {
                          ...formData.paymentSettings,
                          wallet: e.target.checked,
                        },
                      })
                    }
                    className="accent-purple-500 size-4"
                  />
                  <span className="text-xs font-black">محفظة إلكترونية</span>
                </label>
                <label className="flex items-center gap-3 bg-background px-4 py-2 rounded-xl border border-border cursor-pointer hover:border-green-500/50 transition-all select-none opacity-80 has-[:checked]:opacity-100 has-[:checked]:border-green-500">
                  <input
                    type="checkbox"
                    checked={formData.paymentSettings?.cash}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentSettings: {
                          ...formData.paymentSettings,
                          cash: e.target.checked,
                        },
                      })
                    }
                    className="accent-green-500 size-4"
                  />
                  <span className="text-xs font-black">عند الاستلام</span>
                </label>
                <label className="flex items-center gap-3 bg-background px-4 py-2 rounded-xl border border-border cursor-pointer hover:border-orange-500/50 transition-all select-none opacity-80 has-[:checked]:opacity-100 has-[:checked]:border-orange-500">
                  <input
                    type="checkbox"
                    checked={formData.paymentSettings?.fawry}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentSettings: {
                          ...formData.paymentSettings,
                          fawry: e.target.checked,
                        },
                      })
                    }
                    className="accent-orange-500 size-4"
                  />
                  <span className="text-xs font-black">فوري</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-secondary/5 p-4 rounded-2xl border border-secondary/10">
              <input
                type="checkbox"
                checked={formData.hasDiscount}
                onChange={(e) =>
                  setFormData({ ...formData, hasDiscount: e.target.checked })
                }
                className="size-5 accent-secondary cursor-pointer"
              />
              <label className="font-bold text-secondary text-sm cursor-pointer select-none">
                إضافة ملصق "خصم خاص" (Special Offer)
              </label>
            </div>

            <div className="flex gap-4 mt-2">
              <button
                type="submit"
                className="flex-1 py-4 bg-foreground text-background font-black rounded-2xl shadow-xl shadow-foreground/10 active:scale-95 transition-all text-lg"
              >
                حفظ المنتج
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
