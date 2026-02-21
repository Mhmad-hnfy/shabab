"use client";

import React, { useState, useEffect } from "react";

export default function AboutPage() {
  const [aboutText, setAboutText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("shababy_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.contactInfo && parsed.contactInfo.aboutUs) {
        setAboutText(parsed.contactInfo.aboutUs);
      }
    }

    if (!aboutText) {
      setAboutText(
        "متجر شبابي هو وجهتكم المثالية لكل ما هو عصري وأنيق. نحن نؤمن بأن الجودة والتصميم الراقي يجب أن يكونا في متناول الجميع. انضموا إلى عائلتنا واكتشفوا تجربة تسوق فريدة ومريحة.",
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background py-32 px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-16 animate-fade-in-up">
        {/* Header Section */}
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-6xl font-black text-foreground tracking-tighter">
            من نحن
          </h1>
          <div className="h-2 w-24 bg-secondary mx-auto rounded-full" />
        </div>

        {/* Content Section */}
        <div className="bg-card border border-border p-12 md:p-20 rounded-[4rem] shadow-2xl flex flex-col gap-10 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full -ml-16 -mb-16 blur-3xl" />

          <div className="flex flex-col gap-8 relative z-10">
            <h2 className="text-3xl font-black text-foreground leading-tight">
              قصتنا وشغفنا وراء <span className="text-blue-600">شبابى</span>
            </h2>

            <p className="text-xl font-bold text-foreground/60 leading-relaxed whitespace-pre-wrap">
              {aboutText}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <div className="flex flex-col gap-3 p-8 bg-foreground/5 rounded-[2.5rem] border border-border group hover:border-secondary/30 transition-all">
                <span className="text-4xl">🌟</span>
                <h3 className="font-black text-foreground">الجودة</h3>
                <p className="text-sm font-bold text-foreground/40">
                  نختار منتجاتنا بعناية فائقة لضمان أفضل جودة
                </p>
              </div>
              <div className="flex flex-col gap-3 p-8 bg-foreground/5 rounded-[2.5rem] border border-border group hover:border-secondary/30 transition-all">
                <span className="text-4xl">🚀</span>
                <h3 className="font-black text-foreground">السرعة</h3>
                <p className="text-sm font-bold text-foreground/40">
                  توصيل سريع وخدمة عملاء على مدار الساعة
                </p>
              </div>
              <div className="flex flex-col gap-3 p-8 bg-foreground/5 rounded-[2.5rem] border border-border group hover:border-secondary/30 transition-all">
                <span className="text-4xl">💎</span>
                <h3 className="font-black text-foreground">التميز</h3>
                <p className="text-sm font-bold text-foreground/40">
                  تصاميم حصرية تواكب أحدث صيحات الموضة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <a
            href="/products"
            className="inline-flex items-center gap-4 px-12 py-5 bg-foreground text-background font-black rounded-2xl shadow-2xl shadow-foreground/10 hover:scale-105 active:scale-95 transition-all text-xl"
          >
            ابدأ التسوق الآن
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
