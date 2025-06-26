import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-[#f4f8ff] via-white to-[#fff8f4]">
      <div className="max-w-3xl w-full mx-auto text-center pt-16 pb-10">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Ignite Your <br />
          <span className="bg-gradient-to-r from-blue-700 via-purple-600 to-orange-400 bg-clip-text text-transparent">
            Athletic Dreams
          </span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-8">
          From raw talent to real opportunity – your personalized journey to
          athletic excellence starts here
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/auth/register"
            className="bg-blue-700 hover:bg-purple-700 text-white font-semibold rounded-xl px-8 py-4 text-lg shadow transition flex items-center justify-center gap-2"
          >
            Start Your Journey
            <span className="ml-1">→</span>
          </Link>
          <Link
            href="/success-stories"
            className="bg-white border border-gray-200 hover:border-purple-400 text-blue-700 font-semibold rounded-xl px-8 py-4 text-lg shadow transition flex items-center justify-center gap-2"
          >
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="#6d28d9"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Watch Success Stories
          </Link>
        </div>
      </div>
      {/* Stats */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
        <StatBox
          icon={
            <span className="inline-block bg-gradient-to-br from-blue-700 via-purple-600 to-orange-400 p-2 rounded-lg">
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
              </svg>
            </span>
          }
          value="10,000+"
          label="Active Athletes"
        />
        <StatBox
          icon={
            <span className="inline-block bg-gradient-to-br from-blue-700 via-purple-600 to-orange-400 p-2 rounded-lg">
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 8v8m0 0l-3-3m3 3l3-3" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </span>
          }
          value="2,500+"
          label="Success Stories"
        />
        <StatBox
          icon={
            <span className="inline-block bg-gradient-to-br from-blue-700 via-purple-600 to-orange-400 p-2 rounded-lg">
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </span>
          }
          value="15+"
          label="Available Sports"
        />
      </div>
    </section>
  );
}

function StatBox({ icon, value, label }) {
  return (
    <div className="bg-white rounded-2xl shadow-md px-8 py-7 flex flex-col items-center min-w-[200px]">
      <div className="mb-3">{icon}</div>
      <div className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">
        {value}
      </div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  );
}
