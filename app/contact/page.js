"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState({
    email: "contact@shababy.com",
    phone: "0123456789",
    address: "القاهرة، مصر",
    facebook: "#",
    instagram: "#",
  });

  useEffect(() => {
    const saved = localStorage.getItem("shababy_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.contactInfo) setContactInfo(parsed.contactInfo);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background py-24 px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] right-[-10%] size-[500px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] size-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col gap-16 relative z-10">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-6xl font-black text-foreground tracking-tighter">
            تواصل معنا
          </h1>
          <p className="text-foreground/40 font-bold text-xl">
            نحن هنا دائماً لمساعدتك في الحصول على أفضل تجربة تسوق
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-4xl font-black text-foreground">
                راسلنا مباشرة
              </h2>
              <p className="text-foreground/40 font-bold">
                اترك لنا رسالتك وسنقوم بالرد عليك في أقرب وقت ممكن عبر وسيلة
                التواصل المفضلة لديك.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Email */}
              <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center gap-4 hover:scale-105 transition-all group">
                <div className="size-14 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  📧
                </div>
                <div className="flex flex-col items-center gap-1 text-center font-black">
                  <span className="text-[10px] text-foreground/30 uppercase">
                    البريد الإلكتروني
                  </span>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-foreground hover:text-secondary"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              {/* Card 2: Phone */}
              <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center gap-4 hover:scale-105 transition-all group">
                <div className="size-14 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-green-600 group-hover:text-white transition-all">
                  📞
                </div>
                <div className="flex flex-col items-center gap-1 text-center font-black">
                  <span className="text-[10px] text-foreground/30 uppercase">
                    رقم التليفون
                  </span>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-lg text-foreground hover:text-secondary"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-foreground text-background rounded-[2.5rem] p-10 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-full bg-secondary/20 skew-x-[-20deg]" />
              <div className="flex flex-col gap-2 relative z-10">
                <h3 className="text-2xl font-black">مواقع التواصل</h3>
                <p className="text-background/50 font-bold text-sm">
                  تابعونا للحصول على آخر التحديثات
                </p>
              </div>
              <div className="flex gap-4 relative z-10">
                <a
                  href={contactInfo.facebook}
                  target="_blank"
                  className="size-12 bg-white/10 rounded-xl flex items-center justify-center text-xl hover:bg-white hover:text-blue-600 transition-all"
                >
                  📘
                </a>
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  className="size-12 bg-white/10 rounded-xl flex items-center justify-center text-xl hover:bg-white hover:text-pink-600 transition-all"
                >
                  📸
                </a>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle, sending, success
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    content: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    const { error } = await supabase.from("messages").insert({
      full_name: formData.full_name,
      email: formData.email,
      content: formData.content,
      status: "new",
    });

    if (error) {
      console.error(error);
      setStatus("idle");
      alert("حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.");
    } else {
      setStatus("success");
      setFormData({ full_name: "", email: "", content: "" });
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  if (status === "success") {
    return (
      <div className="bg-card border border-border p-12 rounded-[3.5rem] shadow-2xl flex flex-col items-center gap-6 text-center animate-fade-in">
        <div className="size-24 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center text-5xl animate-bounce">
          ✓
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-3xl font-black text-foreground">
            تم الإرسال بنجاح!
          </h3>
          <p className="text-foreground/40 font-bold">
            شكراً لتواصلك معنا. سنقوم بمراجعة رسالتك والرد عليك في أقرب وقت.
          </p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 px-8 py-3 bg-foreground/5 text-foreground font-black rounded-2xl hover:bg-foreground/10 transition-all"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border p-10 md:p-12 rounded-[3.5rem] shadow-2xl flex flex-col gap-6 relative overflow-hidden"
    >
      <div className="flex flex-col gap-2">
        <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
          الاسم الكامل
        </label>
        <input
          required
          type="text"
          value={formData.full_name}
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
          placeholder="مثال: أحمد محمد"
          className="w-full bg-foreground/5 border border-border p-5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold text-lg transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
          البريد الإلكتروني
        </label>
        <input
          required
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@example.com"
          className="w-full bg-foreground/5 border border-border p-5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold text-lg transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-black text-foreground/40 pr-2 uppercase">
          رسالتك
        </label>
        <textarea
          required
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="كيف يمكننا مساعدتك اليوم؟"
          className="w-full bg-foreground/5 border border-border p-5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-secondary/50 font-bold text-lg min-h-[150px] transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-6 bg-foreground text-background font-black rounded-[2rem] shadow-xl shadow-foreground/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-xl mt-4 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
      >
        {status === "sending" ? (
          <>
            <div className="size-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            جاري الإرسال...
          </>
        ) : (
          "إرسال الرسالة"
        )}
      </button>
    </form>
  );
}
