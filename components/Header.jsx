"use client";

import React, { useState, useEffect } from "react";

function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("shababy_theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("shababy_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("shababy_theme", "light");
    }
  };

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("shababy_cart") || "[]");
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("cart-updated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cart-updated", updateCount);
    };
  }, []);

  // Handle scroll lock when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "المنتجات", href: "/products" },
    { name: "تواصل معنا", href: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-4 z-50 flex items-center justify-between px-6 py-4 shadow-sm max-w-5xl rounded-full mx-auto w-[95%] bg-card/80 backdrop-blur-xl border border-border transition-all duration-300">
        <a href="/" className="flex items-center gap-2 group">
          <h1 className="text-2xl font-black bg-gradient-to-l from-blue-600 to-blue-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform drop-shadow-sm">
            شبابى
          </h1>
        </a>

        <nav className="hidden md:flex items-center justify-center gap-10 text-foreground/70 text-sm font-bold">
          {navLinks.map((link) => (
            <a
              key={link.name}
              className="hover:text-foreground transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:right-0 after:w-0 after:h-[2px] after:bg-secondary after:transition-all hover:after:w-full"
              href={link.href}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="size-10 flex items-center justify-center hover:bg-foreground/5 transition-all border border-border rounded-full text-foreground active:scale-90"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Shopping Cart */}
          <a
            href="/cart"
            className="relative size-10 flex items-center justify-center bg-foreground text-background rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg shadow-foreground/10"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 size-5 bg-secondary text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-card animate-bounce">
                {cartCount}
              </span>
            )}
          </a>

          {/* Mobile Menu Open Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden text-foreground size-10 flex items-center justify-center active:scale-90 transition-transform"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16M4 12h16M12 18h8" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay & Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Blur Overlay */}
          <div
            className="absolute inset-0 bg-background/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute top-0 right-0 h-full w-[80%] max-w-sm bg-card border-l border-border shadow-2xl animate-slide-in-right p-8 flex flex-col gap-10">
            <div className="flex items-center justify-between border-b border-border pb-6">
              <h2 className="text-2xl font-black text-blue-600">شبابى</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="size-10 flex items-center justify-center rounded-full bg-foreground/5 text-foreground active:scale-90 transition-all"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-6 text-xl font-bold">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-foreground/70 hover:text-foreground transition-colors py-2 border-b border-border/10"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="mt-auto pt-10 border-t border-border">
              <button className="w-full py-4 bg-foreground text-background font-black rounded-2xl shadow-xl shadow-foreground/10 active:scale-95 transition-all">
                تسوق الآن
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
