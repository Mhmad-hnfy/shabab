"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone1: "",
    phone2: "",
    address: "",
    paymentMethod: "عند الاستلام",
    visaDetails: { number: "", expiry: "", cvc: "" },
    walletNumber: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [productsInCart, setProductsInCart] = useState([]);
  const [isCartMode, setIsCartMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [settings, setSettings] = useState({
    paymentMethods: { cash: true, visa: true, wallet: true },
  });

  useEffect(() => {
    fetchCheckoutData();
  }, [id]);

  const fetchCheckoutData = async () => {
    setLoading(true);

    if (id === "cart") {
      setIsCartMode(true);
      const cart = JSON.parse(localStorage.getItem("shababy_cart") || "[]");
      if (cart.length > 0) {
        const ids = cart.map((item) => item.id);
        const { data: dbProducts } = await supabase
          .from("products")
          .select("*")
          .in("id", ids);
        const enriched = cart.map((item) => {
          const full = dbProducts?.find((p) => p.id === item.id);
          return { ...item, ...full };
        });
        setProductsInCart(enriched);
      }
    } else {
      const { data: found } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (found) {
        setProduct(found);
        setProductsInCart([{ ...found, quantity: 1 }]);
        setActiveImage(found.image);
      }
    }

    const savedSettings = localStorage.getItem("shababy_settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      if (parsed.paymentMethods.cash)
        setFormData((prev) => ({ ...prev, paymentMethod: "عند الاستلام" }));
      else if (parsed.paymentMethods.visa)
        setFormData((prev) => ({ ...prev, paymentMethod: "فيزا" }));
      else if (parsed.paymentMethods.wallet)
        setFormData((prev) => ({ ...prev, paymentMethod: "محفظة" }));
    }
    setLoading(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black">
        جاري تحميل البيانات...
      </div>
    );

  if (!isCartMode && !product)
    return (
      <div className="min-h-screen flex items-center justify-center font-black">
        عذراً، المنتج غير موجود
      </div>
    );

  // Calculate pricing based on productsInCart
  // discount_percent comes from Supabase (snake_case), discountPercent from localStorage (legacy)
  const subtotal = productsInCart.reduce((sum, p) => {
    const discPct = p.discount_percent ?? p.discountPercent ?? 0;
    const disc = discPct > 0 ? parseFloat(p.price) * (discPct / 100) : 0;
    return sum + (parseFloat(p.price) - disc) * p.quantity;
  }, 0);

  // Shipping cost - 0 means free
  const shippingCost = settings?.shippingCost
    ? parseFloat(settings.shippingCost)
    : 0;

  let promoDiscount = 0;
  if (appliedPromo) {
    promoDiscount = subtotal * (appliedPromo.discountPercent / 100);
  }

  const total = subtotal - promoDiscount + shippingCost;

  const handleApplyPromo = async () => {
    setPromoError("");
    // Promo codes still from localStorage as they haven't been moved to DB
    const promos = JSON.parse(localStorage.getItem("shababy_promos") || "[]");
    const found = promos.find(
      (p) => p.code === promoCode.toUpperCase() && p.isActive,
    );
    if (found) {
      setAppliedPromo(found);
      setPromoCode("");
    } else {
      setPromoError("كود الخصم غير صالح أو منتهي الصلاحية");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const items = productsInCart.map((p) => ({
      id: p.id,
      name: p.name,
      price: parseFloat(p.price) * (1 - (p.discount_percent || 0) / 100),
      quantity: p.quantity,
    }));

    const newOrder = {
      customer_name: formData.name,
      customer_phone: formData.phone1,
      customer_phone2: formData.phone2,
      customer_address: formData.address,
      items: items,
      subtotal_amount: parseFloat(subtotal.toFixed(2)),
      promo_code: appliedPromo ? appliedPromo.code : null,
      promo_discount: parseFloat(promoDiscount.toFixed(2)),
      total_amount: parseFloat(total.toFixed(2)),
      payment_method: formData.paymentMethod,
      status: "new",
    };

    const { data, error } = await supabase
      .from("orders")
      .insert(newOrder)
      .select()
      .single();

    if (error) {
      alert("حدث خطأ أثناء تسجيل الطلب، يرجى المحاولة مرة أخرى.");
      console.error(error);
      return;
    }

    if (isCartMode) {
      localStorage.removeItem("shababy_cart");
      window.dispatchEvent(new Event("cart-updated"));
    }

    router.push(`/invoice/${data.id}`);
  };

  const allImages = isCartMode
    ? []
    : [product.image, ...(product.images || [])].filter(Boolean);

  const isMethodSupported = (method) => {
    const globalEnabled = settings?.paymentMethods?.[method];
    if (!globalEnabled) return false;
    // payment_settings comes from Supabase (snake_case), paymentSettings from legacy
    return productsInCart.every((p) => {
      const ps = p.payment_settings ?? p.paymentSettings;
      return !ps || ps[method] === true;
    });
  };

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Order Summary */}
        <div className="flex flex-col gap-10">
          <h1 className="text-4xl font-black text-foreground">مراجعة طلبك</h1>

          <div className="bg-card border border-border p-8 rounded-[3rem] shadow-xl flex flex-col gap-8">
            {!isCartMode ? (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 border-b border-border pb-8">
                <div className="flex flex-col gap-4 shrink-0">
                  <div className="size-48 bg-foreground/5 rounded-[2.5rem] border border-border p-6 shadow-sm overflow-hidden flex items-center justify-center relative">
                    <img
                      src={
                        activeImage ||
                        "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png"
                      }
                      alt=""
                      className="w-full h-full object-contain animate-fade-in"
                      key={activeImage}
                    />
                  </div>
                  {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none justify-center">
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImage(img)}
                          className={`size-12 shrink-0 rounded-xl border-2 transition-all p-1 overflow-hidden ${activeImage === img ? "border-secondary bg-secondary/5 shadow-lg shadow-secondary/10" : "border-border bg-foreground/5 hover:border-foreground/20"}`}
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black rounded-full w-fit">
                    {product.category || product.category_name}
                  </span>
                  <h2 className="text-3xl font-black text-foreground">
                    {product.name}
                  </h2>
                  {product.description && (
                    <p className="text-sm font-bold text-foreground/50 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  {product.details && (
                    <p className="text-xs font-bold text-foreground/35 leading-relaxed border-t border-border/50 pt-2 mt-1 whitespace-pre-wrap">
                      {product.details}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-black text-secondary">
                      {(
                        parseFloat(product.price) *
                        (1 - (product.discount_percent ?? 0) / 100)
                      ).toFixed(2)}{" "}
                      EGP
                    </span>
                    {(product.discount_percent ?? 0) > 0 && (
                      <span className="text-sm font-bold text-foreground/20 line-through">
                        {product.price} EGP
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 border-b border-border pb-8 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
                {productsInCart.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-foreground/5 p-4 rounded-2xl"
                  >
                    <div className="size-16 bg-foreground/5 rounded-xl border border-border p-2 shrink-0">
                      <img
                        src={p.image}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <span className="font-black text-foreground text-sm truncate">
                        {p.name}
                      </span>
                      <span className="text-xs font-bold text-secondary">
                        {(
                          parseFloat(p.price) *
                          (1 -
                            (p.discount_percent ?? p.discountPercent ?? 0) /
                              100)
                        ).toFixed(2)}{" "}
                        EGP x {p.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isCartMode && (
              <div className="flex items-center justify-between p-6 bg-foreground/5 rounded-2xl">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-foreground">الكمية</span>
                  {product?.stock > 0 && (
                    <span className="text-[10px] font-bold text-foreground/30">
                      متاح: {product.stock} قطعة
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <button
                    type="button"
                    onClick={() => {
                      const newQty = Math.max(
                        1,
                        productsInCart[0]?.quantity - 1,
                      );
                      setProductsInCart([
                        { ...productsInCart[0], quantity: newQty },
                      ]);
                    }}
                    className="size-10 bg-foreground/5 border border-border rounded-xl font-black active:scale-90 transition-all"
                  >
                    -
                  </button>
                  <span className="text-xl font-black">
                    {productsInCart[0]?.quantity ?? 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const maxStock = product?.stock ?? 999;
                      const currentQty = productsInCart[0]?.quantity ?? 1;
                      if (currentQty >= maxStock) return;
                      setProductsInCart([
                        { ...productsInCart[0], quantity: currentQty + 1 },
                      ]);
                    }}
                    disabled={
                      (productsInCart[0]?.quantity ?? 1) >=
                      (product?.stock ?? 999)
                    }
                    className="size-10 bg-foreground/5 border border-border rounded-xl font-black active:scale-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Promo Code Input */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest mr-2">
                كود الخصم
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-foreground/5 border border-border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-black tracking-widest text-sm"
                  placeholder="CODE"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-6 bg-foreground text-background font-black rounded-xl hover:opacity-90 active:scale-95 transition-all text-xs"
                >
                  تطبيق
                </button>
              </div>
              {promoError && (
                <span className="text-[10px] font-bold text-red-500 mr-2">
                  {promoError}
                </span>
              )}
              {appliedPromo && (
                <span className="text-[10px] font-bold text-green-600 mr-2">
                  ✅ تم تطبيق خصم {appliedPromo.discountPercent}% بنجاح!
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-border pt-8">
              <div className="flex justify-between text-foreground/40 font-bold">
                <span>المجموع الفرعي</span>
                <span>{subtotal.toFixed(2)} EGP</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-secondary font-bold">
                  <span>خصم الكود ({appliedPromo.code})</span>
                  <span>-{promoDiscount.toFixed(2)} EGP</span>
                </div>
              )}
              <div className="flex justify-between text-foreground/40 font-bold">
                <span>تكلفة الشحن</span>
                {shippingCost > 0 ? (
                  <span className="text-foreground font-black">
                    {shippingCost.toFixed(2)} EGP
                  </span>
                ) : (
                  <span className="text-green-500 font-black">مجاني 🎉</span>
                )}
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-2xl font-black">الإجمالي</span>
                <span className="text-4xl font-black text-secondary">
                  {total.toFixed(2)} EGP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border p-10 rounded-[3.5rem] shadow-2xl flex flex-col gap-8"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-black text-foreground">
              معلومات الشحن
            </h2>
            <p className="text-foreground/40 font-bold">
              يرجى إدخال تفاصيلك بدقة لضمان وصول الطلب
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-foreground/40 mr-2 uppercase tracking-widest">
                الاسم الكامل
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-foreground/5 border border-border p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold"
                placeholder="أدخل اسمك بالكامل"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-foreground/40 mr-2 uppercase">
                  رقم الهاتف 1
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone1}
                  onChange={(e) =>
                    setFormData({ ...formData, phone1: e.target.value })
                  }
                  className="w-full bg-foreground/5 border border-border p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold"
                  placeholder="010XXXXXXXX"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-foreground/40 mr-2 uppercase">
                  رقم الهاتف 2
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone2}
                  onChange={(e) =>
                    setFormData({ ...formData, phone2: e.target.value })
                  }
                  className="w-full bg-foreground/5 border border-border p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold"
                  placeholder="رقم هاتف بديل للأهمية"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-foreground/40 mr-2 uppercase tracking-widest">
                العنوان بالتفصيل
              </label>
              <textarea
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full bg-foreground/5 border border-border p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold min-h-[100px] resize-none"
                placeholder="المحافظة، المدينة، اسم الشارع، رقم المبنى والشقة"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-xs font-black text-foreground/40 mr-2 uppercase">
                طريقة الدفع
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {isMethodSupported("visa") && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: "فيزا" })
                    }
                    className={`py-4 rounded-xl text-xs font-black transition-all border-2 ${formData.paymentMethod === "فيزا" ? "bg-foreground text-background border-foreground" : "bg-transparent border-border text-foreground/40 hover:border-foreground/20"}`}
                  >
                    فيزا
                  </button>
                )}
                {isMethodSupported("wallet") && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: "محفظة" })
                    }
                    className={`py-4 rounded-xl text-xs font-black transition-all border-2 ${formData.paymentMethod === "محفظة" ? "bg-foreground text-background border-foreground" : "bg-transparent border-border text-foreground/40 hover:border-foreground/20"}`}
                  >
                    محفظة
                  </button>
                )}
                {isMethodSupported("fawry") && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: "فوري" })
                    }
                    className={`py-4 rounded-xl text-xs font-black transition-all border-2 ${formData.paymentMethod === "فوري" ? "bg-foreground text-background border-foreground" : "bg-transparent border-border text-foreground/40 hover:border-foreground/20"}`}
                  >
                    فوري
                  </button>
                )}
                {isMethodSupported("cash") && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        paymentMethod: "عند الاستلام",
                      })
                    }
                    className={`py-4 rounded-xl text-xs font-black transition-all border-2 ${formData.paymentMethod === "عند الاستلام" ? "bg-foreground text-background border-foreground" : "bg-transparent border-border text-foreground/40 hover:border-foreground/20"}`}
                  >
                    عند الاستلام
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-3xl flex items-center gap-4">
              <span className="text-2xl">📞</span>
              <p className="text-sm font-black text-blue-600">
                {settings.contactInfo?.checkoutNotice ||
                  "سيتم التواصل خلال 24 ساعة لتأكيد طلبكم"}
              </p>
            </div>

            {/* Conditional Payment Info */}
            {formData.paymentMethod === "فيزا" && (
              <div className="p-6 bg-foreground/5 rounded-3xl border border-border flex flex-col gap-4 animate-fade-in">
                <input
                  type="text"
                  placeholder="رقم البطاقة"
                  className="w-full bg-foreground/5 border border-border p-4 rounded-xl font-bold"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="bg-foreground/5 border border-border p-4 rounded-xl font-bold"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="bg-foreground/5 border border-border p-4 rounded-xl font-bold"
                  />
                </div>
              </div>
            )}

            {formData.paymentMethod === "محفظة" && (
              <div className="p-6 bg-foreground/5 rounded-3xl border border-border flex flex-col gap-4 animate-fade-in">
                <input
                  type="tel"
                  placeholder="رقم المحفظة (فودافون كاش، الخ)"
                  className="w-full bg-foreground/5 border border-border p-4 rounded-xl font-bold"
                />
              </div>
            )}

            {formData.paymentMethod === "فوري" && (
              <div className="p-6 bg-foreground/5 rounded-3xl border border-border text-center animate-fade-in">
                <p className="text-sm font-bold text-foreground/60">
                  سيتم إرسال كود فوري لهاتفك بعد إتمام الطلب
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-6 bg-foreground text-background font-black text-xl rounded-2xl shadow-2xl shadow-foreground/10 hover:opacity-90 active:scale-[0.98] transition-all mt-4"
            >
              إتمام الشراء والطلب
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
