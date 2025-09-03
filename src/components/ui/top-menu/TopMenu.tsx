"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { useCart } from "@/context/cart/CartContext";
import { SearchBox } from "./SearchBox";

export default function TopMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount } = useCart();

  const pathname = usePathname();

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false);
  };

  const getNavItemClass = (path: string) => {
    const baseClass = "text-left relative pb-2 hover:opacity-80";
    const activeClass =
      "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white after:block";

    return `${baseClass} ${pathname === path ? activeClass : ""}`;
  };

  return (
    <>
      <nav className="bg-pink-500 text-white py-4 px-16 relative">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            <Image
              src="/assets/Logo.svg"
              alt="D&N Magic Cosmetics Logo"
              width={100}
              height={50}
              priority
              className="w-auto h-auto max-h-12"
            />
          </Link>

          {/* Mobile Icons and Hamburger */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleSearch} className="hover:opacity-80">
              <IoSearchOutline className="w-6 h-6" />
            </button>
            <Link href="/cart" className="relative hover:opacity-80">
              <IoCartOutline className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-100dn text-500dn rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:opacity-80"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } md:flex flex-col md:flex-row absolute md:relative top-16 md:top-0 left-0 md:left-auto w-full md:w-auto bg-pink-500 md:bg-transparent p-4 md:p-0 gap-6 z-40`}
          >
            <Link 
              className={getNavItemClass("/")} 
              href="/"
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link 
              className={getNavItemClass("/products")} 
              href="/products"
              onClick={() => setIsMenuOpen(false)}
            >
              Productos
            </Link>
            <Link
              className={getNavItemClass("/promotions")}
              href="/promotions?size=set"
              onClick={() => setIsMenuOpen(false)}
            >
              Promociones
            </Link>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex gap-4">
            <button onClick={toggleSearch}>
              <IoSearchOutline className="w-8 h-8" />
            </button>
            <Link href="/cart" className="relative">
              <IoCartOutline className="w-8 h-8" />
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-2 bg-100dn text-500dn rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Search Box Component */}
      <SearchBox isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
