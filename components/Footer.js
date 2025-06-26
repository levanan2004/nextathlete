"use client";

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
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-[#3b82f6] to-[#f97316] p-2 rounded-lg">
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
                  className="lucide lucide-zap h-6 w-6 text-white"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold">Ignite</span>
                <span className="text-xl font-bold text-[#93c5fd]">
                  Athlete
                </span>
              </div>
            </a>
            <p className="text-gray-300 mb-6 max-w-md">
              Empowering young athletes worldwide with personalized guidance,
              opportunities, and connections to achieve their dreams.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                aria-label="Facebook"
              >
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
                  className="lucide lucide-facebook h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                aria-label="Twitter"
              >
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
                  className="lucide lucide-twitter h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                aria-label="Instagram"
              >
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
                  className="lucide lucide-instagram h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                aria-label="YouTube"
              >
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
                  className="lucide lucide-youtube h-5 w-5"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                  <path d="m10 15 5-3-5-3z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="/"
                >
                  Sports Roadmaps
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="/tournaments"
                >
                  Find Tournaments
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="/showcase"
                >
                  Video Showcase
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="/community"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="/help"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="/contact"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="/safety"
                >
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="/report"
                >
                  Report Issue
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="/privacy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="/terms"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="/cookies"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="/coppa"
                >
                  COPPA Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
              <p className="text-gray-300">
                Get the latest updates on tournaments, success stories, and
                training tips.
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <div className="flex-1 md:flex-none">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
              <button
                onClick={handleSubscribe}
                className="bg-[#3b82f6] text-white px-6 py-2 rounded-r-lg hover:bg-[#2563eb] transition-colors flex items-center"
              >
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
                  className="lucide lucide-mail h-4 w-4 mr-2"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="py-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 IgniteAthlete. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Empowering the next generation of athletes worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
