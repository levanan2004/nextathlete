export default function EverythingYouNeed() {
  return (
    <section className="w-full py-16 bg-gradient-to-br from-purple-900 via-black to-[#111827]">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-white via-purple-500 to-purple-900 bg-clip-text text-transparent">
          Everything You Need to Succeed
        </h2>

        <p className="text-center text-gray-500 text-lg mb-12 max-w-2xl mx-auto">
          Our comprehensive platform provides all the tools, guidance, and
          opportunities young athletes need to reach their full potential.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={
              <span className="inline-block bg-blue-600 p-4 rounded-xl">
                <svg
                  width="32"
                  height="32"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M16 3v4M8 3v4" />
                </svg>
              </span>
            }
            title="Personalized Roadmaps"
            desc="Step-by-step guidance from beginner to pro level, tailored to your sport and goals with monthly milestones and progress tracking."
            stat="50+ detailed pathways"
          />
          <FeatureCard
            icon={
              <span className="inline-block bg-orange-500 p-4 rounded-xl">
                <svg
                  width="32"
                  height="32"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>
              </span>
            }
            title="Global Opportunities"
            desc="Discover tournaments, academies, and tryouts worldwide with age and location filters. Never miss an opportunity to showcase your skills."
            stat="10,000+ opportunities"
          />
          <FeatureCard
            icon={
              <span className="inline-block bg-purple-600 p-4 rounded-xl">
                <svg
                  width="32"
                  height="32"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="4" y="7" width="16" height="10" rx="2" />
                  <circle cx="8" cy="12" r="1" />
                </svg>
              </span>
            }
            title="Showcase Your Talent"
            desc="Upload training videos and match footage for coaches and scouts to discover you. Build your athletic portfolio and get noticed."
            stat="500K+ videos uploaded"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, stat }) {
  return (
    <div className="bg-[#e1e1e1] rounded-2xl shadow px-7 py-8 flex flex-col min-h-[260px]">
      <div className="mb-4">{icon}</div>
      <div className="text-2xl font-bold text-gray-900 mb-2">{title}</div>
      <div className="text-gray-600 text-base mb-4">{desc}</div>
      <div className="text-blue-700 font-semibold mt-auto">{stat}</div>
    </div>
  );
}
