export default function Home() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-lg p-12">
        <h1 className="text-5xl font-bold mb-4">Discover Events Around You</h1>
        <p className="text-lg">Find concerts, conferences, and experiences happening near you.</p>
      </div>

      {/* Featured Events */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Featured Experiences</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { img: "/assets/music-festival.jpg", title: "Music Festival 2026", desc: "Experience live music like never before!" },
            { img: "/assets/tech-conference.jpg", title: "Tech Conference", desc: "Join the biggest tech minds in one place." },
            { img: "/assets/art-exhibition.jpg", title: "Art Exhibition", desc: "Explore modern art from top artists." }
          ].map((event, i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition p-4">
              <img src={event.img} alt={event.title} className="w-full h-48 object-cover rounded mb-3"/>
              <h3 className="font-bold text-xl mb-1">{event.title}</h3>
              <p className="text-gray-600">{event.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Event360 */}
      <div className="bg-indigo-50 p-6 rounded-lg shadow text-center">
        <h2 className="text-2xl font-bold mb-2">Why Event360?</h2>
        <p className="text-gray-700">
          We connect people to meaningful experiences through seamless event discovery and ticketing. From music festivals to tech conferences so that you do not document experiences rather live those experiences.
        </p>
      </div>
    </div>
  );
}