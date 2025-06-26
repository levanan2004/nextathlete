"use client";

import Link from "next/link";
import { useState } from "react";

export default function FooterComponent() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribed with email:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo và description */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-white"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold">Ignite</span>
                <span className="text-xl font-bold text-purple-400">
                  Athlete
                </span>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Creating opportunities for talented athletes worldwide, regardless
              of background or location. Every student deserves a chance to
              pursue their athletic dreams.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  className="text-gray-400 hover:text-white transition-colors"
                  href="/"
                >
                  Sports
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-white transition-colors"
                  href="/marketplace"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-white transition-colors"
                  href="/tournaments"
                >
                  Tournaments
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-white transition-colors"
                  href="/academies"
                >
                  Academies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <span>support@igniteathlete.org</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>+84329373743</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Hanoi, Vietnam</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="py-6 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            © 2025 IgniteAthlete. All rights reserved. Created by Cao Dang Dung.
          </p>
        </div>
      </div>
    </footer>
  );
}
