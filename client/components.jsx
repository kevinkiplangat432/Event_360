// Events.jsx
import React from 'react';
import EventCard from './components/EventCard';

function Events() {
  const events = [
    {
      id: 1,
      title: "The Grape Escape",
      category: "Wine Tasting",
      date: "January 21, 2026",
      time: "03:00 - 09:00",
      location: "Grand Wine Hall",
      description: "Join us for an exquisite wine tasting experience featuring premium selections from renowned vineyards. Discover the art of wine appreciation with expert sommeliers guiding you through each pour.",
      tickets: 500,
      price: 75,
      originalPrice: null,
      discountText: null,
      urgencyText: null,
      categoryColor: "from-purple-600 to-indigo-600",
      buttonColor: "from-purple-600 to-indigo-600",
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Tomorrow Land",
      category: "Summer Festival",
      date: "June 1-5, 2026",
      time: "All Day",
      location: "Belgium",
      description: "Experience the best EDM festival of the summer! Four days of non-stop electronic music featuring world-renowned DJs and spectacular stage productions. Join thousands of music lovers for an unforgettable experience.",
      tickets: 3000,
      price: 150,
      originalPrice: 300,
      discountText: "Early Bird - 50% Off!",
      urgencyText: null,
      categoryColor: "from-yellow-500 to-orange-600",
      buttonColor: "from-yellow-500 to-orange-600",
      imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "FIFA World Cup",
      category: "World Sport Event",
      date: "June - July 2026",
      time: "Various Times",
      location: "USA, Mexico & Canada",
      description: "Witness the greatest football tournament on earth! The FIFA World Cup returns to North America with matches across USA, Mexico, and Canada. Experience the passion, drama, and glory of the beautiful game.",
      tickets: 150,
      price: 800,
      originalPrice: 400,
      discountText: "Last Minute - Double Price!",
      urgencyText: "⚠️ Almost Sold Out!",
      categoryColor: "from-green-600 to-blue-600",
      buttonColor: "from-green-600 to-blue-600",
      imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Super Bowl LX",
      category: "Sports Championship",
      date: "February 8, 2025",
      time: "Evening",
      location: "Levi's Stadium, California",
      description: "The biggest game in American football! Join us at Levi's Stadium in California for Super Bowl LX. Experience the ultimate championship showdown with electrifying halftime performances.",
      tickets: 200,
      price: 1200,
      originalPrice: 600,
      discountText: "Last Minute Sale",
      urgencyText: null,
      categoryColor: "from-red-600 to-blue-800",
      buttonColor: "from-red-600 to-blue-800",
      imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Cannes Lion",
      category: "Tech Conference",
      date: "June 2026",
      time: "08:00 - 17:00",
      location: "Palace of Festivals, France",
      description: "Join the world's most prestigious tech and creativity conference at the Palace of Festivals. Network with industry leaders, attend inspiring talks, and discover the latest innovations.",
      tickets: 5000,
      price: 0,
      originalPrice: null,
      discountText: "Early Bird - 50% Off VIP & VVIP!",
      urgencyText: null,
      categoryColor: "from-indigo-600 to-purple-700",
      buttonColor: "from-indigo-600 to-purple-700",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ticketTypes: [
        { name: "Regular", price: "FREE", originalPrice: null },
        { name: "VIP", price: "£100", originalPrice: "£200" },
        { name: "VVIP", price: "£200", originalPrice: "£400" }
      ]
    },
    {
      id: 6,
      title: "Summer Tides",
      category: "Beach Summer Festival",
      date: "July 21-23, 2026",
      time: "All Day",
      location: "Mombasa, Kenya",
      description: "Experience the ultimate beach festival in Mombasa! Three days of music, sun, and fun on Kenya's beautiful coast. Dance to amazing beats with your toes in the sand.",
      tickets: 2000,
      price: 100,
      originalPrice: null,
      discountText: null,
      urgencyText: null,
      specialTag: "Die Hard Tickets",
      categoryColor: "from-cyan-500 to-blue-600",
      buttonColor: "from-cyan-500 to-blue-600",
      imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      organizer: "Summertides KE"
    },
    {
      id: 7,
      title: "Artemis II",
      category: "Science",
      date: "TBC by NASA",
      time: "Launch Time TBD",
      location: "Kennedy Space Center",
      description: "Witness history in the making! Be part of the first crewed lunar flyby in over 50 years. Limited exclusive viewing access at Kennedy Space Center for this monumental moment in space exploration.",
      tickets: 50,
      price: 4000,
      originalPrice: null,
      discountText: null,
      urgencyText: "Only 50 tickets left!",
      specialTag: "🚀 Limited Access",
      categoryColor: "from-indigo-900 to-slate-700",
      buttonColor: "from-indigo-900 to-slate-700",
      imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      organizer: "NASA"
    }
  ];

  const handleBookTicket = (eventName) => {
    alert(`Booking ticket for ${eventName}!`);
    // In a real app, you would handle routing or API calls here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-5">
      <div className="max-w-7xl mx-auto">
        <header className="text-center text-white mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Upcoming Events</h1>
          <p className="text-lg md:text-xl opacity-90">Discover and book your next amazing experience</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard 
              key={event.id}
              event={event}
              onBookTicket={handleBookTicket}
            />
          ))}
        </section>
      </div>
    </div>
  );
}

export default Events;