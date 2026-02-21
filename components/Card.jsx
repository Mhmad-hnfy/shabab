"use client";

import React from "react";

const Card = ({ product, index = 0 }) => {
  const [count, setCount] = React.useState(0);

  // Fallback for missing product data
  const data = product || {
    name: "منتج تجريبي",
    description: "وصف تجريبي قصير للمنتج يوضح مميزاته الأساسية.",
    category: "تصنيف الموضة",
    price: 0,
    offerPrice: 0,
    rating: 5,
    image:
      "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png",
    hasDiscount: false,
  };

  const hasActualDiscount = data.discountPercent > 0;
  const finalPrice = hasActualDiscount
    ? (parseFloat(data.price) * (1 - data.discountPercent / 100)).toFixed(2)
    : data.price;

  return (
    <div
      className="group premium-card p-5 flex flex-col gap-5 transition-all duration-500 animate-fade-in-up h-full"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image Wrapper */}
      <div className="relative aspect-[4/5] rounded-[2rem] bg-foreground/[0.03] overflow-hidden flex items-center justify-center p-6">
        <a
          href={`/product/${data.id}`}
          className="w-full h-full flex items-center justify-center"
        >
          <img
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
            src={
              data.image ||
              (data.images && data.images[0]) ||
              "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png"
            }
            alt={data.name}
            onError={(e) => {
              e.target.src =
                "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png";
            }}
          />
        </a>
        {data.stock <= 0 && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-20">
            <span className="bg-red-500 text-white px-6 py-2 rounded-full font-black text-xs rotate-[-15deg] shadow-2xl">
              نفذت الكمية
            </span>
          </div>
        )}
        {(data.hasDiscount || hasActualDiscount) && (
          <div className="absolute top-5 left-5 px-4 py-1.5 bg-secondary  text-[10px] font-black rounded-full shadow-xl shadow-secondary/30">
            {hasActualDiscount ? `خصم ${data.discountPercent}%` : "خصم خاص"}
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col gap-1 overflow-hidden">
            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.15em]">
              {data.category}
            </span>
            <a
              href={`/product/${data.id}`}
              className="text-xl font-black text-foreground leading-tight group-hover:text-secondary transition-colors truncate"
            >
              {data.name}
            </a>
          </div>
          <div className="flex items-center gap-1.5 border border-foreground/5 px-2.5 py-1.5 rounded-2xl bg-foreground/[0.02] shrink-0">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-yellow-500"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs font-black text-foreground/50">
              {data.rating || "٥.٠"}
            </span>
          </div>
        </div>

        <p className="text-xs font-bold text-foreground/40 line-clamp-2 leading-relaxed h-8">
          {data.description || "لا يوجد وصف متاح لهذا المنتج حالياً."}
        </p>

        <div className="flex items-center gap-3 mt-1">
          <span className="text-3xl font-black text-foreground tracking-tight">
            {finalPrice} EGP
          </span>
          {hasActualDiscount && (
            <span className="text-lg font-bold text-foreground/20 line-through">
              {data.price} EGP
            </span>
          )}
        </div>
      </div>

      {/* Button Action */}
      <div className="mt-auto pt-2 flex flex-col gap-3">
        <button
          onClick={() => {
            const cart = JSON.parse(
              localStorage.getItem("shababy_cart") || "[]",
            );
            const existing = cart.find((item) => item.id === data.id);
            if (existing) {
              existing.quantity += 1;
              localStorage.setItem("shababy_cart", JSON.stringify(cart));
            } else {
              const newItem = {
                id: data.id,
                name: data.name,
                price: finalPrice,
                image: data.image || (data.images && data.images[0]),
                quantity: 1,
              };
              localStorage.setItem(
                "shababy_cart",
                JSON.stringify([...cart, newItem]),
              );
            }
            window.dispatchEvent(new Event("cart-updated"));
            // Minor feedback animation or state if needed
          }}
          disabled={data.stock <= 0}
          className="w-full py-4 bg-foreground text-background font-black rounded-2xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 group/btn shadow-xl shadow-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>أضف إلى السلة</span>
          <svg
            className="group-hover/btn:translate-x-[-4px] transition-transform"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>

        <a
          href={data.stock <= 0 ? "#" : `/checkout/${data.id}`}
          className={`w-full py-4 bg-secondary font-black text-center rounded-2xl shadow-xl shadow-secondary/20 hover:bg-secondary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/buy ${data.stock <= 0 ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
        >
          <span>اشتري الآن</span>
          <svg
            className="size-4 group-hover/buy:translate-x-[-4px] transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Card;
