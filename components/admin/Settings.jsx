"use client";

import React, { useState, useEffect } from "react";

export default function Settings() {
  const [paymentMethods, setPaymentMethods] = useState({
    cash: true,
    visa: true,
    wallet: true,
    fawry: true,
  });

  const [contactInfo, setContactInfo] = useState({
    checkoutNotice: "سيتم التواصل خلال 24 ساعة لتأكيد طلبكم",
    email: "contact@shababy.com",
    phone: "0123456789",
    address: "القاهرة، مصر",
    facebook: "https://facebook.com/shababy",
    instagram: "https://instagram.com/shababy",
    aboutUs:
      "متجر شبابي هو وجهتكم المثالية لكل ما هو عصري وأنيق. نحن نؤمن بأن الجودة والتصميم الراقي يجب أن يكونا في متناول الجميع. انضموا إلى عائلتنا واكتشفوا تجربة تسوق فريدة ومريحة.",
  });

  useEffect(() => {
    const saved = localStorage.getItem("shababy_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.paymentMethods) setPaymentMethods(parsed.paymentMethods);
      if (parsed.contactInfo) setContactInfo(parsed.contactInfo);
    } else {
      localStorage.setItem(
        "shababy_settings",
        JSON.stringify({ paymentMethods, contactInfo }),
      );
    }
  }, []);

  const updateSetting = (key, value, isPayment = false) => {
    if (isPayment) {
      const updatedMethods = { ...paymentMethods, [key]: value };
      setPaymentMethods(updatedMethods);
      localStorage.setItem(
        "shababy_settings",
        JSON.stringify({ paymentMethods: updatedMethods, contactInfo }),
      );
    } else {
      const updatedInfo = { ...contactInfo, [key]: value };
      setContactInfo(updatedInfo);
      localStorage.setItem(
        "shababy_settings",
        JSON.stringify({ paymentMethods, contactInfo: updatedInfo }),
      );
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black text-foreground">إعدادات المتجر</h2>
        <p className="text-foreground/50 font-bold">
          إدارة طرق الدفع وخيارات التواصل
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Payment Methods Control */}
        <div className="bg-card border border-border p-10 rounded-[3rem] shadow-sm flex flex-col gap-8">
          <h3 className="text-xl font-black text-foreground border-b border-border pb-4 flex items-center gap-2">
            <span>💳</span> طرق الدفع المتاحة
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-6 bg-foreground/5 rounded-2xl">
              <div className="flex flex-col gap-1">
                <span className="font-black text-foreground text-lg">
                  الدفع عند الاستلام
                </span>
                <span className="text-xs font-bold text-foreground/40 italic">
                  التحصيل يدوياً عند التسليم
                </span>
              </div>
              <button
                onClick={() =>
                  updateSetting("cash", !paymentMethods.cash, true)
                }
                className={`w-14 h-8 rounded-full relative transition-all duration-300 ${paymentMethods.cash ? "bg-secondary" : "bg-foreground/20"}`}
              >
                <div
                  className={`absolute top-1 size-6 bg-white rounded-full transition-all duration-300 ${paymentMethods.cash ? "right-7" : "right-1"}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-6 bg-foreground/5 rounded-2xl">
              <div className="flex flex-col gap-1">
                <span className="font-black text-foreground text-lg">
                  البطاقة البنكية (Visa/MasterCard)
                </span>
                <span className="text-xs font-bold text-foreground/40 italic">
                  الدفع المسبق أونلاين
                </span>
              </div>
              <button
                onClick={() =>
                  updateSetting("visa", !paymentMethods.visa, true)
                }
                className={`w-14 h-8 rounded-full relative transition-all duration-300 ${paymentMethods.visa ? "bg-secondary" : "bg-foreground/20"}`}
              >
                <div
                  className={`absolute top-1 size-6 bg-white rounded-full transition-all duration-300 ${paymentMethods.visa ? "right-7" : "right-1"}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-6 bg-foreground/5 rounded-2xl">
              <div className="flex flex-col gap-1">
                <span className="font-black text-foreground text-lg">
                  المحافظ الإلكترونية (Vodafone Cash)
                </span>
                <span className="text-xs font-bold text-foreground/40 italic">
                  تحويل عبر رقم التليفون
                </span>
              </div>
              <button
                onClick={() =>
                  updateSetting("wallet", !paymentMethods.wallet, true)
                }
                className={`w-14 h-8 rounded-full relative transition-all duration-300 ${paymentMethods.wallet ? "bg-secondary" : "bg-foreground/20"}`}
              >
                <div
                  className={`absolute top-1 size-6 bg-white rounded-full transition-all duration-300 ${paymentMethods.wallet ? "right-7" : "right-1"}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-6 bg-foreground/5 rounded-2xl">
              <div className="flex flex-col gap-1">
                <span className="font-black text-foreground text-lg">
                  فوري (Fawry)
                </span>
                <span className="text-xs font-bold text-foreground/40 italic">
                  الدفع عبر منافذ فوري
                </span>
              </div>
              <button
                onClick={() =>
                  updateSetting("fawry", !paymentMethods.fawry, true)
                }
                className={`w-14 h-8 rounded-full relative transition-all duration-300 ${paymentMethods.fawry ? "bg-secondary" : "bg-foreground/20"}`}
              >
                <div
                  className={`absolute top-1 size-6 bg-white rounded-full transition-all duration-300 ${paymentMethods.fawry ? "right-7" : "right-1"}`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-10 rounded-[3rem] shadow-sm flex flex-col gap-8">
          <h3 className="text-xl font-black text-foreground border-b border-border pb-4 flex items-center gap-2">
            <span>📞</span> خيارات التواصل والموقع
          </h3>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
                تنبيه صفحة الشراء
              </label>
              <textarea
                value={contactInfo.checkoutNotice}
                onChange={(e) =>
                  updateSetting("checkoutNotice", e.target.value)
                }
                className="w-full bg-foreground/5 border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold min-h-[80px] text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => updateSetting("email", e.target.value)}
                  className="w-full bg-foreground/5 border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
                  رقم التليفون الأساسي
                </label>
                <input
                  type="text"
                  value={contactInfo.phone}
                  onChange={(e) => updateSetting("phone", e.target.value)}
                  className="w-full bg-foreground/5 border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
                العنوان
              </label>
              <input
                type="text"
                value={contactInfo.address}
                onChange={(e) => updateSetting("address", e.target.value)}
                className="w-full bg-foreground/5 border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
                من نحن (نص تعريفي للمتجر)
              </label>
              <textarea
                value={contactInfo.aboutUs}
                onChange={(e) => updateSetting("aboutUs", e.target.value)}
                className="w-full bg-foreground/5 border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold min-h-[120px] text-sm"
                placeholder="اكتب نبذة عن المتجر لتظهر في صفحة من نحن والفوتر..."
              />
            </div>

            <div className="flex flex-col gap-4 border-t border-border pt-6">
              <h4 className="text-xs font-black text-foreground/40 uppercase tracking-widest">
                روابط التواصل الاجتماعي
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-foreground/5 p-4 rounded-2xl">
                  <span className="text-xl">📘</span>
                  <input
                    type="text"
                    placeholder="رابط فيسبوك"
                    value={contactInfo.facebook}
                    onChange={(e) => updateSetting("facebook", e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none font-bold text-xs"
                  />
                </div>
                <div className="flex items-center gap-3 bg-foreground/5 p-4 rounded-2xl">
                  <span className="text-xl">📸</span>
                  <input
                    type="text"
                    placeholder="رابط انستجرام"
                    value={contactInfo.instagram}
                    onChange={(e) => updateSetting("instagram", e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none font-bold text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
