export default function ReadyToStart() {
  return (
    <section className="w-full flex justify-center py-12">
      <div className="w-full max-w-5xl">
        <div className="rounded-2xl bg-gradient-to-r from-[#f2f7fe] to-[#fff7ee] px-6 py-12 flex flex-col items-center shadow">
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 text-center">
            Ready to Start Your Journey?
          </h3>
          <p className="text-gray-600 text-lg mb-7 text-center">
            Join thousands of athletes who are already on their path to success.
          </p>
          <a
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-8 py-4 text-lg shadow transition"
          >
            Get Started Free
          </a>
        </div>
      </div>
    </section>
  );
}
