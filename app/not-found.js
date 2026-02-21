export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-8">
      <div className="text-[12rem] font-black text-foreground/5 leading-none select-none">
        404
      </div>
      <div className="flex flex-col gap-4 max-w-md -mt-16 relative z-10">
        <h1 className="text-4xl font-black text-foreground">
          عفواً، الصفحة غير موجودة!
        </h1>
        <p className="text-foreground/40 font-bold text-lg">
          يبدو أنك سلكت طريقاً غير موجود، أو تم نقل الصفحة إلى مكان آخر في عالم
          "شبابى".
        </p>
      </div>
      <a
        href="/"
        className="px-10 py-5 bg-foreground text-background font-black rounded-[2rem] shadow-2xl shadow-foreground/20 hover:scale-105 active:scale-95 transition-all text-xl"
      >
        العودة للرئيسية
      </a>
      <div className="size-64 bg-secondary/5 blur-[100px] absolute pointer-events-none rounded-full" />
    </div>
  );
}
