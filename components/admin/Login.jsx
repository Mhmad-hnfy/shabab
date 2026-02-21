"use client";

import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple mock authentication for demonstration
    if (password === "hmwhnfy3@gmail.com") {
      onLogin(true);
    } else {
      setError("كلمة المرور غير صحيحة");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background p-6"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-card border border-border p-10 rounded-[2.5rem] shadow-2xl shadow-foreground/5 animate-fade-in-up">
        <div className="flex flex-col gap-3 text-center mb-10">
          <h1 className="text-4xl font-black text-foreground">
            شبابى Dashboard
          </h1>
          <p className="text-foreground/50 font-bold">
            مرحباً بك مجدداً، يرجى تسجيل الدخول للمتابعة
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-black text-foreground/70 pr-2">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-foreground/5 border border-border p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/50 placeholder:text-foreground/20 font-bold transition-all"
              placeholder="••••••••"
              required
            />
            {error && (
              <p className="text-red-500 text-xs font-bold pr-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-foreground text-background font-black rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-foreground/10"
          >
            دخول المسؤول
          </button>
        </form>

        <p className="mt-10 text-center text-xs text-foreground/30 font-bold">
          &copy; ٢٠٢٤ شبابى. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
}
