"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const { user, userProfile, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  // Đóng menu khi click ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Đăng xuất
  const handleLogout = async () => {
    await signOut();
    router.push("/auth/login");
  };

  // Get display info from userProfile or user
  const getDisplayName = () => {
    if (pathname === "/add_information") return "";
    if (!user) return "";
    return userProfile?.username || userProfile?.full_name || user.email || "User";
  };

  const getProfilePicture = () => {
    if (pathname === "/add_information") return "";
    return userProfile?.profile_picture_url || "";
  };

  const displayName = getDisplayName();
  const profilePicture = getProfilePicture();

  return (
    <header className="w-full bg-black border-b border-gray-700 shadow-lg px-2 sm:px-4 md:px-8 h-16 flex items-center sticky top-0 z-20">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 no-underline flex-shrink-0"
      >
        <Image
          src="/assets/images/logo.webp"
          alt="IgniteAthlete Logo"
          width={40}
          height={40}
          className="rounded-lg"
          quality={100}
          priority
        />
        <span className="text-xl font-bold text-white">
          Ignite<span className="text-purple-400">Athlete</span>
        </span>
      </Link>

      {/* Main navigation */}
      <nav className="hidden md:flex flex-1 justify-center gap-2">
        <Link
          href="/sport"
          className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
            pathname === "/sport"
              ? "bg-purple-600 text-white font-bold"
              : "text-gray-300 font-medium hover:bg-gray-800 hover:text-white"
          }`}
        >
          Sports
        </Link>
        <Link
          href="/gear"
          className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
            pathname === "/gear"
              ? "bg-purple-600 text-white font-bold"
              : "text-gray-300 font-medium hover:bg-gray-800 hover:text-white"
          }`}
        >
          Marketplace
        </Link>
        <Link
          href="/tournaments"
          className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
            pathname === "/tournaments"
              ? "bg-purple-600 text-white font-bold"
              : "text-gray-300 font-medium hover:bg-gray-800 hover:text-white"
          }`}
        >
          Tournaments
        </Link>
        <Link
          href="/academy"
          className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
            pathname === "/academy"
              ? "bg-purple-600 text-white font-bold"
              : "text-gray-300 font-medium hover:bg-gray-800 hover:text-white"
          }`}
        >
          Academy
        </Link>
        <Link
          href="/showcase"
          className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
            pathname === "/showcase"
              ? "bg-purple-600 text-white font-bold"
              : "text-gray-300 font-medium hover:bg-gray-800 hover:text-white"
          }`}
        >
          Showcase
        </Link>
        <Link
          href="/community"
          className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
            pathname === "/community"
              ? "bg-purple-600 text-white font-bold"
              : "text-gray-300 font-medium hover:bg-gray-800 hover:text-white"
          }`}
        >
          Community
        </Link>
        {/* Thêm menu Admin nếu user là admin */}
        {userProfile?.role === "admin" && (
          <Link
            href="/admin"
            className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
              pathname === "/admin"
                ? "bg-gradient-to-r from-purple-700 to-purple-900 text-white font-bold border-2 border-purple-500 shadow-lg"
                : "text-purple-400 font-bold border-2 border-purple-700 hover:bg-purple-900 hover:text-white hover:border-purple-400 transition-all duration-200"
            }`}
            style={{ marginLeft: 8 }}
          >
            Admin
          </Link>
        )}
      </nav>

      {/* User actions */}
      {pathname !== "/add_information" && (
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          {user ? (
            <>
              <Link
                href="/information"
                className="flex items-center gap-2 font-medium text-white hover:text-purple-400 transition-colors"
                title="Xem thông tin cá nhân"
              >
                {profilePicture ? (
                  <Image
                    src={profilePicture}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                    quality={90}
                  />
                ) : (
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="truncate max-w-[120px]">{displayName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-800 text-white border border-gray-600 rounded-lg px-5 py-2 font-bold hover:bg-gray-700 hover:border-gray-500 transition-all duration-200"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-lg text-gray-300 font-medium hover:bg-gray-800 hover:text-white transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-purple-600 to-purple-700 border-2 border-purple-500 text-white rounded-lg px-6 py-2 font-bold hover:from-purple-700 hover:to-purple-800 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Start free trial
              </Link>
            </>
          )}
        </div>
      )}

      {/* Mobile menu button */}
      <button
        className="md:hidden flex items-center ml-auto"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Open menu"
      >
        <svg
          className="w-7 h-7 text-gray-300"
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
          className="fixed inset-0 bg-black/50 z-50 flex md:hidden"
        >
          <div className="bg-gray-900 shadow-xl w-4/5 max-w-xs h-full flex flex-col items-start px-6 py-6 gap-2">
            <button
              className="self-end mb-2"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="#fff"
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

            <Link
              href="/sport"
              className={`py-2 flex items-center gap-1 w-full ${
                pathname === "/sport"
                  ? "text-purple-400 font-bold"
                  : "text-gray-300 font-medium"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Sports
            </Link>
            <Link
              href="/gear"
              className={`py-2 flex items-center gap-1 w-full ${
                pathname === "/gear"
                  ? "text-purple-400 font-bold"
                  : "text-gray-300 font-medium"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/tournaments"
              className={`py-2 flex items-center gap-1 w-full ${
                pathname === "/tournaments"
                  ? "text-purple-400 font-bold"
                  : "text-gray-300 font-medium"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Tournaments
            </Link>
            <Link
              href="/academy"
              className={`py-2 flex items-center gap-1 w-full ${
                pathname === "/academy"
                  ? "text-purple-400 font-bold"
                  : "text-gray-300 font-medium"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Academy
            </Link>
            <Link
              href="/showcase"
              className={`py-2 flex items-center gap-1 w-full ${
                pathname === "/showcase"
                  ? "text-purple-400 font-bold"
                  : "text-gray-300 font-medium"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Showcase
            </Link>
            <Link
              href="/community"
              className={`py-2 flex items-center gap-1 w-full ${
                pathname === "/community"
                  ? "text-purple-400 font-bold"
                  : "text-gray-300 font-medium"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Community
            </Link>
            {userProfile?.role === "admin" && (
              <Link
                href="/admin"
                className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                  pathname === "/admin"
                    ? "bg-gradient-to-r from-purple-700 to-purple-900 text-white font-bold border-2 border-purple-500 shadow-lg"
                    : "text-purple-400 font-bold border-2 border-purple-700 hover:bg-purple-900 hover:text-white hover:border-purple-400 transition-all duration-200"
                }`}
                style={{ marginLeft: 8 }}
              >
                Admin
              </Link>
            )}
            <div className="border-t border-gray-700 w-full my-2" />

            {user ? (
              <>
                <Link
                  href="/information"
                  className="flex items-center gap-2 py-2 w-full hover:bg-gray-800 rounded-lg px-2 transition-colors"
                  onClick={() => setMenuOpen(false)}
                  title="Xem thông tin cá nhân"
                >
                  {profilePicture ? (
                    <Image
                      src={profilePicture}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                      quality={90}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium text-white truncate max-w-[120px]">
                    {displayName}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-800 text-white border border-gray-600 rounded-lg px-5 py-2 font-bold w-full text-left mt-1 hover:bg-gray-700 hover:border-gray-500 transition-all duration-200"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="py-2 text-gray-300 font-medium w-full hover:text-white transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 border-2 border-purple-500 text-white rounded-lg px-6 py-2 font-bold w-full text-center mt-1 hover:from-purple-700 hover:to-purple-800 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Start free trial
                </Link>
              </>
            )}
          </div>
          <div className="flex-1" onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
