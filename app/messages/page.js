"use client";

import React, { useState } from "react";

export default function MessagesPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen py-24 px-6 max-w-[1400px] mx-auto flex flex-col gap-16">
      <div className="flex flex-col gap-4 animate-fade-in-up">
        <span className="text-secondary font-black tracking-[0.2em] uppercase text-xs">
          اتصل بنا
        </span>
        <h2 className="text-5xl md:text-7xl font-black text-foreground leading-[1.1] tracking-tight">
          نحن هنا <br />{" "}
          <span className="text-foreground/20">لمساعدتك دائماً</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="bg-card border border-border p-10 rounded-[3.5rem] shadow-2xl flex flex-col gap-10">
          {!sent ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <label className="text-xs font-black text-foreground/40 mr-2 uppercase">
                  الاسم
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-foreground/5 border border-border p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold"
                  placeholder="أدخل اسمك"
                />
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-xs font-black text-foreground/40 mr-2 uppercase">
                  البريد الإلكتروني أو الهاتف
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-foreground/5 border border-border p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold"
                  placeholder="كيف نتواصل معك؟"
                />
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-xs font-black text-foreground/40 mr-2 uppercase">
                  رسالتك
                </label>
                <textarea
                  required
                  className="w-full bg-foreground/5 border border-border p-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold min-h-[150px] resize-none"
                  placeholder="اكتب استفسارك هنا..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-6 bg-foreground text-background font-black text-xl rounded-2xl shadow-xl shadow-foreground/10 hover:opacity-90 active:scale-[0.98] transition-all"
              >
                ارسال الرسالة
              </button>
            </form>
          ) : (
            <div className="py-20 flex flex-col items-center text-center gap-6 animate-fade-in">
              <div className="size-20 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl">
                ✓
              </div>
              <h3 className="text-3xl font-black text-foreground">
                تم الإرسال بنجاح!
              </h3>
              <p className="text-foreground/40 font-bold">
                شكراً لتواصلك معنا، سنقوم بالرد عليك في أقرب وقت ممكن.
              </p>
              <button
                onClick={() => setSent(false)}
                className="px-8 py-3 bg-foreground/5 rounded-xl font-black text-sm hover:bg-foreground/10"
              >
                إرسال رسالة أخرى
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-black text-foreground">
              معلومات التواصل
            </h3>
            <p className="text-foreground/40 font-bold leading-relaxed">
              يمكنك أيضاً الوصول إلينا مباشرة عبر القنوات التالية:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-card border border-border rounded-[2.5rem] flex flex-col gap-4">
              <span className="text-3xl">📧</span>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                  البريد الإلكتروني
                </span>
                <span className="font-bold text-foreground">
                  support@shababy.com
                </span>
              </div>
            </div>
            <div className="p-8 bg-card border border-border rounded-[2.5rem] flex flex-col gap-4">
              <span className="text-3xl">📱</span>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">
                  واتساب
                </span>
                <span className="font-bold text-foreground">
                  +20 123 456 789
                </span>
              </div>
            </div>
          </div>

          <div className="p-10 bg-secondary/5 rounded-[3rem] border border-secondary/10 flex flex-col gap-4">
            <span className="text-secondary font-black text-lg">
              ساعات العمل
            </span>
            <p className="font-bold text-secondary/60 leading-relaxed">
              نعمل طوال أيام الأسبوع <br />
              من الساعة 9 صباحاً وحتى 10 مساءً
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
