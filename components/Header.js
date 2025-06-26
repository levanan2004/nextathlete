"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="w-full bg-white shadow-md px-2 sm:px-4 md:px-8 h-16 flex items-center sticky top-0 z-20">
      {/* Logo bên trái */}
      <a
        href="/"
        className="flex items-center gap-2 no-underline flex-shrink-0"
      >
        <Image
          src="/assets/images/logo.webp"
          alt="IgniteAthlete Logo"
          height={56}
          width={56}
          className="h-14 w-auto object-contain"
          priority
        />
      </a>
      {/* Menu giữa */}
      <nav className="hidden md:flex flex-1 justify-center gap-2">
        <a
          href="/"
          className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
            pathname === "/"
              ? "bg-blue-100 text-blue-700 font-bold"
              : "text-gray-800 font-medium hover:bg-gray-100"
          }`}
        >
          🏆 Sports
        </a>
        <a
          href="/tournaments"
          className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
            pathname === "/tournaments"
              ? "bg-blue-100 text-blue-700 font-bold"
              : "text-gray-800 font-medium hover:bg-gray-100"
          }`}
        >
          🏆 Tournaments
        </a>
        <a
          href="/showcase"
          className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
            pathname === "/showcase"
              ? "bg-blue-100 text-blue-700 font-bold"
              : "text-gray-800 font-medium hover:bg-gray-100"
          }`}
        >
          📹 Showcase
        </a>
        <a
          href="/community"
          className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
            pathname === "/community"
              ? "bg-blue-100 text-blue-700 font-bold"
              : "text-gray-800 font-medium hover:bg-gray-100"
          }`}
        >
          👥 Community
        </a>
      </nav>
      {/* Action bên phải */}
      <div className="hidden md:flex items-center gap-4 flex-shrink-0">
        {user ? (
          <>
            <a
              href="/information"
              className="font-medium text-gray-900 truncate max-w-[120px] hover:underline"
              title="Xem thông tin cá nhân"
            >
              {user.user_metadata?.full_name || user.email}
            </a>
            <button
              onClick={handleLogout}
              className="bg-gray-100 text-blue-600 border border-blue-600 rounded-lg px-5 py-2 font-bold hover:bg-gray-200 transition"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <a
              href="/auth/login"
              className="px-4 py-2 rounded-lg text-gray-800 font-medium hover:bg-gray-100"
            >
              Sign In
            </a>
            <a
              href="/auth/register"
              className="bg-blue-600 text-white rounded-lg px-6 py-2 font-bold hover:bg-blue-700 transition"
            >
              Get Started
            </a>
          </>
        )}
      </div>
      {/* Mobile hamburger */}
      <button
        className="md:hidden flex items-center ml-auto"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Open menu"
      >
        <svg
          className="w-7 h-7 text-gray-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {/* Mobile menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 bg-black/30 z-50 flex md:hidden"
        >
          <div className="bg-white shadow-lg w-4/5 max-w-xs h-full flex flex-col items-start px-6 py-6 gap-2">
            <button
              className="self-end mb-2"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="#333"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <a
              href="/"
              className={`py-2 flex items-center gap-1 w-full ${
                pathname === "/"
                  ? "text-blue-600 font-bold"
                  : "text-gray-800 font-medium"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              🏆 Sports
            </a>
            <a
              href="/tournaments"
              className={`py-2 flex items-center gap-1 w-full ${
                pathname === "/tournaments"
                  ? "text-blue-600 font-bold"
                  : "text-gray-800 font-medium"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              🏆 Tournaments
            </a>
            <a
              href="/showcase"
              className={`py-2 flex items-center gap-1 w-full ${
                pathname === "/showcase"
                  ? "text-blue-600 font-bold"
                  : "text-gray-800 font-medium"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              📹 Showcase
            </a>
            <a
              href="/community"
              className={`py-2 flex items-center gap-1 w-full ${
                pathname === "/community"
                  ? "text-blue-600 font-bold"
                  : "text-gray-800 font-medium"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              👥 Community
            </a>
            <div className="border-t w-full my-2" />
            {user ? (
              <>
                <span className="font-medium text-gray-900 py-2 truncate max-w-[150px]">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="bg-gray-100 text-blue-600 border border-blue-600 rounded-lg px-5 py-2 font-bold w-full text-left mt-1"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="py-2 text-gray-800 font-medium w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </a>
                <a
                  href="/auth/register"
                  className="bg-blue-600 text-white rounded-lg px-6 py-2 font-bold w-full text-center mt-1"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </a>
              </>
            )}
          </div>
          {/* Click vùng tối để đóng menu */}
          <div className="flex-1" onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
