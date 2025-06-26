"use client";

export default function OurMission() {
  return (
    <section className="w-full bg-[#111827] py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">
            Our Mission
          </h2>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-300 text-lg leading-relaxed">
          {/* Main mission statement */}
          <p className="text-center max-w-5xl mx-auto">
            IgniteAthlete exists to provide access to the pathway of athleticism
            for all students, regardless of socioeconomic status, geographic
            location, or exposure. While we believe that talent exists
            universally, opportunities do not. This platform exists to create
            opportunity, systematically sourcing credible, quality, and
            practical information, so students can take real action on the
            pathway towards their athletic success.
          </p>

          {/* Key question */}
          <div className="text-center py-6">
            <p className="text-xl">
              This idea came from our original question:{" "}
              <span className="text-purple-400 font-semibold">
                Why do so many talented kids disappear?
              </span>
            </p>
          </div>

          {/* Brazil example */}
          <p className="text-center max-w-5xl mx-auto">
            Take Brazil for instance. In cities and towns across the country,
            thousands of kids play football in the streets with raw talent,
            creativity and passion that rivals professional athletes. Those same
            kids grow up playing football with unstructured coaching, as they do
            not have access to training equipment or a scouting opportunity.
            Without the structured coaching, they transition to the background
            as many kids do.
          </p>

          {/* Solution statement */}
          <div className="text-center py-6">
            <p className="text-xl text-purple-400 font-semibold">
              IgniteAthlete is created to rewrite that story.
            </p>
          </div>

          {/* Platform vision */}
          <p className="text-center max-w-5xl mx-auto">
            Our platform will be like a digital mentor to students everywhere; a
            teenager in Ho Chi Minh City who wants to be a tennis player, a
            runner in rural Kenya at 14 years old, and a volleyball player in
            the Philippines. With our tools, they can understand where to begin,
            how to develop, and where to go next.
          </p>
        </div>
      </div>
    </section>
  );
}
