import React, { useState } from 'react';

const Events = () => {
  const [events] = useState([
    {
      id: 1,
      name: "The Grape Escape",
      category: "Wine Tasting",
      date: "January 21, 2026",
      time: "03:00 - 09:00",
      availableTickets: 500,
      status: "upcoming",
      description: "Join us for an exquisite wine tasting experience featuring premium selections from renowned vineyards.",
      location: "Grand Wine Hall",
      price: 75
    },
    {
      id: 2,
      name: "Tomorrow Land",
      category: "Summer Festival",
      date: "June 1-5, 2026",
      time: "All Day",
      availableTickets: 3000,
      status: "upcoming",
      description: "Experience the best EDM festival of the summer! Four days of non-stop electronic music featuring world-renowned DJs and spectacular stage productions.",
      location: "Belgium",
      price: 150,
      originalPrice: 300,
      isEarlyBird: true,
      ticketType: "Early Bird"
    },
    {
      id: 3,
      name: "FIFA World Cup",
      category: "World Sport Event",
      date: "June - July 2026",
      time: "Various Times",
      availableTickets: 150,
      status: "upcoming",
      description: "Witness the greatest football tournament on earth! The FIFA World Cup returns to North America with matches across USA, Mexico, and Canada.",
      location: "USA, Mexico & Canada",
      price: 800,
      originalPrice: 400,
      isLastMinute: true,
      almostSoldOut: true,
      ticketType: "Last Minute"
    },
    {
      id: 4,
      name: "Super Bowl LX",
      category: "Sports Championship",
      date: "February 8, 2025",
      time: "Evening",
      availableTickets: 200,
      status: "upcoming",
      description: "The biggest game in American football! Join us at Levi's Stadium in California for Super Bowl LX. Experience the ultimate championship showdown.",
      location: "Levi's Stadium, California",
      price: 1200,
      originalPrice: 600,
      isLastMinute: true,
      ticketType: "Last Minute Sale"
    },
    {
      id: 5,
      name: "Cannes Lion",
      category: "Tech Conference",
      date: "June 2026",
      time: "08:00 - 17:00",
      availableTickets: 5000,
      status: "upcoming",
      description: "Join the world's most prestigious tech and creativity conference at the Palace of Festivals. Network with industry leaders and innovators.",
      location: "Palace of Festivals, France",
      ticketTiers: [
        { type: "Regular", price: 0 },
        { type: "VIP", price: 100, originalPrice: 200 },
        { type: "VVIP", price: 200, originalPrice: 400 }
      ],
      isEarlyBird: true,
      hasMultipleTiers: true
    },
    {
      id: 6,
      name: "Summer Tides",
      category: "Beach Summer Festival",
      date: "July 21-23, 2026",
      time: "All Day",
      availableTickets: 2000,
      status: "upcoming",
      description: "Experience the ultimate beach festival in Mombasa! Three days of music, sun, and fun organized by Summertides KE. Die-hard tickets available now.",
      location: "Mombasa, Kenya",
      price: 100,
      ticketType: "Die Hard",
      organizer: "Summertides KE"
    },
    {
      id: 7,
      name: "Artemis II",
      category: "Science",
      date: "TBC by NASA",
      time: "Launch Time TBD",
      availableTickets: 50,
      status: "upcoming",
      description: "Witness history in the making! Be part of the first crewed lunar flyby in over 50 years. Limited exclusive viewing access at Kennedy Space Center.",
      location: "Kennedy Space Center",
      price: 4000,
      organizer: "NASA",
      isLimited: true,
      ticketType: "Limited Access"
    }
  ]);

  const upcomingEvents = events.filter(event => event.status === "upcoming");

  const handleBookTicket = (eventId) => {
    console.log(`Booking ticket for event ${eventId}`);
    // Add booking logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-5">
      <div className="max-w-7xl mx-auto">
        <header className="text-center text-white mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Upcoming Events</h1>
          <p className="text-lg md:text-xl opacity-90">Discover and book your next amazing experience</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map(event => {
            // Define gradient colors based on event category
            const gradientColors = {
              "Wine Tasting": "from-purple-600 to-indigo-600",
              "Summer Festival": "from-yellow-500 to-orange-600",
              "World Sport Event": "from-green-600 to-blue-600",
              "Sports Championship": "from-red-600 to-blue-800",
              "Tech Conference": "from-indigo-600 to-purple-700",
              "Beach Summer Festival": "from-cyan-500 to-blue-600",
              "Science": "from-indigo-900 to-slate-700"
            };

            const gradientClass = gradientColors[event.category] || "from-purple-600 to-indigo-600";

            return (
              <article 
                key={event.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`bg-gradient-to-r ${gradientClass} px-5 py-4`}>
                  <span className="text-white font-semibold text-sm uppercase tracking-wider">
                    {event.category}
                  </span>
                </div>
              
              <div className="p-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-5">
                  {event.name}
                </h2>
                
                <div className="space-y-3 mb-5">
                  <div className="flex items-center text-gray-600">
                    <span className="text-xl mr-3">📅</span>
                    <span className="text-base">{event.date}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <span className="text-xl mr-3">🕐</span>
                    <span className="text-base">{event.time}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <span className="text-xl mr-3">📍</span>
                    <span className="text-base">{event.location}</span>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {event.description}
                </p>

                <div className="flex items-center justify-between pt-5 border-t border-gray-200">
                  {event.hasMultipleTiers ? (
                    <div className="w-full">
                      <span className="text-green-600 font-semibold text-sm mb-3 block">
                        {event.availableTickets} tickets available
                      </span>
                      <div className="space-y-2 mb-4">
                        {event.ticketTiers.map((tier, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span className="font-semibold text-gray-700">{tier.type}</span>
                            <div className="flex items-center gap-2">
                              {tier.price === 0 ? (
                                <span className="text-green-600 font-bold text-lg">FREE</span>
                              ) : (
                                <>
                                  <span className="text-gray-900 font-bold text-lg">£{tier.price}</span>
                                  {tier.originalPrice && (
                                    <span className="text-gray-400 text-sm line-through">£{tier.originalPrice}</span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {event.isEarlyBird && (
                        <span className="text-orange-600 font-semibold text-xs uppercase block mb-3">
                          Early Bird - 50% Off VIP & VVIP!
                        </span>
                      )}
                      <button 
                        className={`w-full bg-gradient-to-r ${gradientClass} text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg`}
                        onClick={() => handleBookTicket(event.id)}
                      >
                        Book Now
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-1">
                        <span className="text-green-600 font-semibold text-sm">
                          {event.availableTickets} tickets available
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 text-2xl font-bold">
                            ${event.price}
                          </span>
                          {event.originalPrice && (
                            <span className="text-gray-400 text-lg line-through">
                              ${event.originalPrice}
                            </span>
                          )}
                        </div>
                        {event.isEarlyBird && !event.hasMultipleTiers && (
                          <span className="text-orange-600 font-semibold text-xs uppercase">
                            {event.ticketType} - 50% Off!
                          </span>
                        )}
                        {event.isLastMinute && (
                          <span className="text-red-600 font-semibold text-xs uppercase">
                            {event.ticketType}
                          </span>
                        )}
                        {event.almostSoldOut && (
                          <span className="text-red-700 font-bold text-xs uppercase animate-pulse">
                            ⚠️ Almost Sold Out!
                          </span>
                        )}
                        {event.ticketType && !event.isEarlyBird && !event.isLastMinute && !event.isLimited && (
                          <span className="text-blue-600 font-semibold text-xs uppercase">
                            {event.ticketType}
                          </span>
                        )}
                        {event.isLimited && (
                          <span className="text-purple-700 font-bold text-xs uppercase">
                            🚀 {event.ticketType}
                          </span>
                        )}
                      </div>
                      
                      <button 
                        className={`bg-gradient-to-r ${gradientClass} text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg`}
                        onClick={() => handleBookTicket(event.id)}
                      >
                        Book Now
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default Events;
