"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/Card";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    const allProducts = JSON.parse(
      localStorage.getItem("shababy_products") || "[]",
    );
    const found = allProducts.find((p) => p.id.toString() === id);

    if (found) {
      setProduct(found);
      setActiveImage(found.image);

      // Related products (same category, excluding current)
      const related = allProducts
        .filter((p) => p.category === found.category && p.id.toString() !== id)
        .slice(0, 4);
      setRelatedProducts(related);

      // Load reviews
      const savedReviews = JSON.parse(
        localStorage.getItem(`shababy_reviews_${id}`) || "[]",
      );
      setReviews(savedReviews);
    }
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("shababy_cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
      localStorage.setItem("shababy_cart", JSON.stringify(cart));
    } else {
      const finalPrice =
        product.discountPercent > 0
          ? (
              parseFloat(product.price) *
              (1 - product.discountPercent / 100)
            ).toFixed(2)
          : product.price;

      const newItem = {
        id: product.id,
        name: product.name,
        price: finalPrice,
        image: product.image,
        quantity: 1,
      };
      localStorage.setItem("shababy_cart", JSON.stringify([...cart, newItem]));
    }
    window.dispatchEvent(new Event("cart-updated"));
    router.push("/cart");
  };

  const submitReview = (e) => {
    e.preventDefault();
    const updated = [
      {
        ...newReview,
        date: new Date().toLocaleDateString("ar-EG"),
        id: Date.now(),
      },
      ...reviews,
    ];
    setReviews(updated);
    localStorage.setItem(`shababy_reviews_${id}`, JSON.stringify(updated));
    setNewReview({ name: "", rating: 5, comment: "" });
  };

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center font-black">
        جاري التحميل...
      </div>
    );

  const finalPrice =
    product.discountPercent > 0
      ? (
          parseFloat(product.price) *
          (1 - product.discountPercent / 100)
        ).toFixed(2)
      : product.price;

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-background py-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-24">
        {/* Main Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Gallery Section */}
          <div className="flex flex-col gap-6 sticky top-32">
            <div className="aspect-[4/5] bg-card border border-border rounded-[3rem] overflow-hidden p-10 flex items-center justify-center shadow-2xl relative group">
              {product.discountPercent > 0 && (
                <div className="absolute top-8 left-8 px-6 py-2 bg-secondary text-white font-black rounded-full shadow-xl shadow-secondary/30 z-10 animate-bounce">
                  خصم {product.discountPercent}%
                </div>
              )}
              <img
                src={activeImage || product.image}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none justify-center">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`size-24 shrink-0 rounded-2xl border-2 transition-all p-2 bg-card overflow-hidden ${activeImage === img ? "border-secondary scale-110 shadow-lg" : "border-border hover:border-foreground/20"}`}
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

          {/* Details Section */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <span className="px-4 py-1.5 bg-secondary/10 text-secondary text-xs font-black rounded-full w-fit uppercase tracking-widest">
                {product.category}
              </span>
              <h1 className="text-5xl lg:text-6xl font-black text-foreground leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex text-yellow-500">
                  {"⭐".repeat(product.rating)}
                </div>
                <span className="text-foreground/40 font-bold">
                  ({reviews.length} تقييم)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-5xl font-black text-foreground">
                {finalPrice} EGP
              </span>
              {product.discountPercent > 0 && (
                <span className="text-2xl font-bold text-foreground/20 line-through">
                  {product.price} EGP
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-black text-foreground">وصف المنتج</h3>
              <p className="text-lg font-bold text-foreground/50 leading-relaxed whitespace-pre-wrap">
                {product.description || "لا يوجد وصف متاح لهذا المنتج حالياً."}
              </p>
            </div>

            {/* Inventory Status */}
            <div className="flex items-center gap-4 p-6 bg-foreground/5 rounded-[2rem] border border-border">
              <div
                className={`size-4 rounded-full animate-pulse ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="font-black text-foreground">
                {product.stock > 0
                  ? `متوفر في المخزون (${product.stock} قطعة)`
                  : "نفذت الكمية"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-6 bg-foreground text-background font-black text-xl rounded-2xl shadow-2xl shadow-foreground/10 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>أضف إلى السلة</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0" />
                </svg>
              </button>
              <a
                href={`/checkout/${product.id}`}
                className="flex-1 py-6 bg-secondary text-white font-black text-xl rounded-2xl shadow-2xl shadow-secondary/20 hover:bg-secondary/90 active:scale-95 transition-all text-center flex items-center justify-center gap-4"
              >
                <span>شراء الآن</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M13 5l7 7-7 7M5 12h14" />
                </svg>
              </a>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-background border border-border rounded-2xl flex items-center gap-3">
                <span className="text-2xl">🚚</span>
                <span className="text-xs font-bold text-foreground/60">
                  توصيل سريع
                </span>
              </div>
              <div className="p-4 bg-background border border-border rounded-2xl flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <span className="text-xs font-bold text-foreground/60">
                  ضمان الجودة
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="flex flex-col gap-12 pt-24 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-black text-foreground">
                تقييمات العملاء
              </h2>
              <p className="text-foreground/40 font-bold">
                بناءً على {reviews.length} تجربة تسوق
              </p>
            </div>

            <form
              onSubmit={submitReview}
              className="w-full md:w-[500px] flex flex-col gap-4 bg-card border border-border p-8 rounded-[2.5rem] shadow-xl"
            >
              <h3 className="font-black text-foreground pr-2">أضف تقييمك</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="الاسم"
                  required
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                  className="flex-1 bg-foreground/5 p-4 rounded-xl focus:outline-none font-bold text-sm"
                />
                <select
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      rating: Number(e.target.value),
                    })
                  }
                  className="bg-foreground/5 p-4 rounded-xl focus:outline-none font-black text-yellow-500"
                >
                  <option value="5">⭐⭐⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="1">⭐</option>
                </select>
              </div>
              <textarea
                placeholder="ما رأيك في المنتج؟"
                required
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                className="bg-foreground/5 p-4 rounded-xl focus:outline-none font-bold text-sm min-h-[100px] resize-none"
              />
              <button
                type="submit"
                className="w-full py-4 bg-foreground text-background font-black rounded-xl hover:opacity-90 transition-all"
              >
                ارسال التقييم
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-card border border-border p-8 rounded-[2.5rem] flex flex-col gap-4 shadow-sm group hover:border-secondary/30 transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="font-black text-foreground">
                    {review.name}
                  </span>
                  <span className="text-[10px] font-bold text-foreground/20">
                    {review.date}
                  </span>
                </div>
                <div className="text-yellow-500 text-xs">
                  {"⭐".repeat(review.rating)}
                </div>
                <p className="text-foreground/60 font-medium leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="col-span-full py-20 text-center text-foreground/20 font-black text-3xl">
                كن أول من يقيم هذا المنتج ✍️
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="flex flex-col gap-12 pt-24 border-t border-border">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-black text-foreground">
                منتجات قد تعجبك
              </h2>
              <p className="text-foreground/40 font-bold">
                تشكيلة مختارة من نفس التصنيف
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p, idx) => (
                <Card key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
