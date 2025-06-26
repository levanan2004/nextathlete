import { useState, useEffect, useRef } from "react";

const stories = [
  {
    name: "Emma Johnson",
    age: 15,
    sport: "Gymnastics",
    location: "London, UK",
    image: "/assets/images/thumbnail_1.webp",
    rating: 5,
    badge: "National Championship",
    quote:
      "The mental preparation modules were as important as physical training. I overcame my fear of difficult routines and qualified for the British Championships.",
  },
  {
    name: "Aisha Patel",
    age: 16,
    sport: "Swimming",
    location: "Mumbai, India",
    image: "/assets/images/thumbnail_2.webp",
    rating: 5,
    badge: "National Qualifier",
    quote:
      "The personalized training plans helped me drop 15 seconds off my 400m freestyle. I discovered local competitions I never knew existed and now I'm training for the Asian Youth Championships.",
  },
  {
    name: "Lucas Nguyen",
    age: 17,
    sport: "Football",
    location: "Hanoi, Vietnam",
    image: "/assets/images/thumbnail_3.webp",
    rating: 5,
    badge: "Youth League MVP",
    quote:
      "IgniteAthlete connected me with top coaches and scouts. I improved my skills and earned a scholarship to play at the national level.",
  },
];

export default function SuccessStories() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef();

  // Auto slide
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((c) => (c + 1) % stories.length);
    }, 10000);
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  const prev = () => setCurrent((c) => (c === 0 ? stories.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === stories.length - 1 ? 0 : c + 1));

  return (
    <section className="w-full bg-gradient-to-br from-[#f4f8ff] via-white to-[#fff8f4] py-16">
      <div className="max-w-5xl mx-auto px-2">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-gray-900">
          Success Stories
        </h2>
        <p className="text-center text-gray-500 text-lg mb-12 max-w-2xl mx-auto">
          Real athletes, real achievements. See how IgniteAthlete has helped
          young talents transform their dreams into reality.
        </p>
        {/* Slider */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl flex flex-col items-center">
            <div className="relative w-full flex bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[350px]">
              {/* Left: Large image */}
              <div className="w-1/2 min-w-[220px] relative flex flex-col justify-end">
                <img
                  src={stories[current].image}
                  alt={stories[current].name}
                  className="w-full h-full object-cover object-center"
                  style={{ minHeight: 300, maxHeight: 400 }}
                />
                {/* Prev button */}
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center text-2xl z-10"
                  aria-label="Previous"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#222"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {/* Rating & badge */}
                <div className="absolute bottom-5 left-5">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: stories[current].rating }).map(
                      (_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">
                          ★
                        </span>
                      )
                    )}
                  </div>
                  <span className="inline-block bg-blue-600 text-white text-sm px-4 py-1 rounded-full font-semibold shadow">
                    {stories[current].badge}
                  </span>
                </div>
              </div>
              {/* Right: Quote & info */}
              <div className="w-1/2 flex flex-col justify-between p-10 border-l border-gray-100 relative">
                <div>
                  <div className="text-4xl text-gray-400 mb-2 font-bold">”</div>
                  <div className="text-lg text-gray-800 mb-8">
                    {stories[current].quote}
                  </div>
                </div>
                <hr className="pb-5 text-gray-400"></hr>
                <div>
                  <div className="font-bold text-xl text-gray-900">
                    {stories[current].name}
                  </div>
                  <div className="text-gray-600 text-base">
                    Age {stories[current].age} • {stories[current].sport}
                  </div>
                  <div className="text-gray-400 text-base">
                    {stories[current].location}
                  </div>
                </div>
                {/* Next button */}
                <button
                  onClick={next}
                  className="absolute right-5 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center text-2xl z-10"
                  aria-label="Next"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#222"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Dots */}
            <div className="flex gap-2 mt-6">
              {stories.map((_, i) => (
                <button
                  key={i}
                  className={`w-4 h-3 rounded-full transition-all ${
                    i === current ? "bg-blue-600 w-8" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to story ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto">
          <StatBox value="2,500+" label="Success Stories" />
          <StatBox value="85%" label="Goal Achievement Rate" />
          <StatBox value="1,200+" label="Scholarships Earned" />
          <StatBox value="50+" label="Countries Represented" />
        </div>
      </div>
    </section>
  );
}

function StatBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-1">
        {value}
      </div>
      <div className="text-gray-700 text-lg text-center">{label}</div>
    </div>
  );
}
