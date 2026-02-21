"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const deleteMessage = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;

    const { error } = await supabase.from("messages").delete().eq("id", id);

    if (error) {
      alert("خطأ في حذف الرسالة");
      console.error(error);
    } else {
      fetchMessages();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    }
  };

  const markAsRead = async (id) => {
    const { error } = await supabase
      .from("messages")
      .update({ status: "read" })
      .eq("id", id);

    if (error) {
      console.error(error);
    } else {
      fetchMessages();
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black text-foreground">رسائل العملاء</h2>
          <p className="text-foreground/50 font-bold">
            إدارة الاستفسارات والطلبات الواردة من صفحة التواصل
          </p>
        </div>
        <div className="bg-secondary/10 text-secondary px-6 py-2 rounded-full font-black text-sm">
          {messages.length} رسالة
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Messages List */}
        <div className="xl:col-span-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
          {loading ? (
            <div className="bg-card border-2 border-dashed border-border p-12 rounded-[3rem] text-center flex flex-col items-center gap-4 animate-pulse">
              <p className="font-bold text-foreground/40">
                جاري تحميل الرسائل...
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="bg-card border-2 border-dashed border-border p-12 rounded-[3rem] text-center flex flex-col items-center gap-4">
              <span className="text-5xl opacity-20">📥</span>
              <p className="font-bold text-foreground/40">
                لا توجد رسائل حالياً
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMessage(m);
                  if (m.status === "new") markAsRead(m.id);
                }}
                className={`p-6 rounded-[2rem] border transition-all cursor-pointer group relative ${
                  selectedMessage?.id === m.id
                    ? "bg-foreground border-foreground shadow-2xl shadow-foreground/10"
                    : "bg-card border-border hover:border-foreground/20"
                }`}
              >
                {m.status === "new" && (
                  <div className="absolute top-4 left-4 size-3 bg-secondary rounded-full animate-pulse" />
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-black text-lg ${selectedMessage?.id === m.id ? "text-background" : "text-foreground"}`}
                    >
                      {m.full_name}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${selectedMessage?.id === m.id ? "text-background/50" : "text-foreground/30"}`}
                    >
                      {new Date(m.created_at).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                  <p
                    className={`text-sm font-bold line-clamp-1 ${selectedMessage?.id === m.id ? "text-background/70" : "text-foreground/50"}`}
                  >
                    {m.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Content */}
        <div className="xl:col-span-7">
          {selectedMessage ? (
            <div className="bg-card border border-border p-10 md:p-12 rounded-[3.5rem] shadow-sm flex flex-col gap-10 animate-fade-in-up">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
                <div className="flex flex-col gap-2">
                  <h3 className="text-4xl font-black text-foreground tracking-tighter">
                    {selectedMessage.full_name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-background bg-foreground px-3 py-1 rounded-full uppercase">
                      المرسل
                    </span>
                    <span className="text-sm font-bold text-foreground/40">
                      {new Date(selectedMessage.created_at).toLocaleString(
                        "ar-EG",
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="size-14 bg-red-500/10 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-500/5 active:scale-95"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-black text-foreground/30 uppercase tracking-widest mr-2">
                    وسيلة التواصل (البريد الإلكتروني)
                  </span>
                  <div className="bg-foreground/5 p-6 rounded-3xl border border-border flex items-center justify-between">
                    <span className="text-xl font-black text-foreground">
                      {selectedMessage.email}
                    </span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="px-6 py-2 bg-foreground text-background rounded-full text-xs font-black hover:scale-105 active:scale-95 transition-all"
                    >
                      تواصل الآن
                    </a>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-xs font-black text-foreground/30 uppercase tracking-widest mr-2">
                    محتوى الرسالة
                  </span>
                  <div className="bg-foreground/5 p-8 rounded-[2.5rem] border border-border min-h-[200px]">
                    <p className="text-lg font-bold text-foreground leading-relaxed">
                      {selectedMessage.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] bg-foreground/5 border-2 border-dashed border-border rounded-[3.5rem] flex flex-col items-center justify-center gap-6 text-center p-12 opacity-40">
              <div className="size-24 border-4 border-foreground/10 rounded-full flex items-center justify-center text-4xl">
                📄
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-2xl font-black text-foreground">
                  اختر رسالة لعرضها
                </p>
                <p className="font-bold">
                  سيتم عرض تفاصيل الرسالة المختارة هنا
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
