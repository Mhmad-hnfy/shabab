export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
      <div className="relative size-20">
        <div className="absolute inset-0 border-4 border-secondary/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-black bg-gradient-to-l from-blue-600 to-blue-400 bg-clip-text text-transparent animate-pulse">
          شبابى
        </h1>
      </div>
      <p className="text-foreground/40 font-bold animate-pulse">
        جاري تحضير التجربة الأمثل...
      </p>
    </div>
  );
}
