export default function Footer() {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-16 w-full text-foreground/60 bg-background/50 backdrop-blur-sm border-t border-border">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 pb-10">
        <div className="md:max-w-96 flex flex-col gap-4">
          <h2 className="text-2xl font-black bg-gradient-to-l from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
            شبابى
          </h2>
          <p className="text-sm leading-relaxed">
            متجر شبابي هو وجهتكم المثالية لكل ما هو عصري وأنيق. نحن نؤمن بأن
            الجودة والتصميم الراقي يجب أن يكونا في متناول الجميع. انضموا إلى
            عائلتنا واكتشفوا تجربة تسوق فريدة ومريحة.
          </p>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-16 md:gap-24">
          <div>
            <h2 className="font-bold mb-5 text-foreground">الشركة</h2>
            <ul className="text-sm space-y-3">
              <li>
                <a href="/" className="hover:text-accent transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-accent transition-colors"
                >
                  من نحن
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-accent transition-colors"
                >
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold mb-5 text-foreground">تواصل معنا</h2>
            <div className="text-sm space-y-3">
              <p
                dir="ltr"
                className="hover:text-accent transition-colors cursor-pointer"
              >
                01222354609
              </p>
              <p className="hover:text-accent transition-colors cursor-pointer">
                hmwhnfy3@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-8 border-t border-border/50 text-center text-xs md:text-sm">
        <p>
          حقوق الطبع والنشر 2026 ©{" "}
          <span className="font-bold text-blue-600">شبابى</span>. جميع الحقوق
          محفوظة.
        </p>
      </div>
    </footer>
  );
}
