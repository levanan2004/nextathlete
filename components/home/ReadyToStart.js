"use client";

import Link from "next/link";

export default function ReadyToStart() {
  return (
    <section className="w-full bg-gradient-to-br from-purple-900 via-black to-[#111827] py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Start Your Athletic Journey?
        </h2>
        <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
          Join thousands of students already pursuing their dreams
        </p>

        <Link
          href="/auth/register"
          className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold text-lg px-8 py-4 rounded-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Get Started Today
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
