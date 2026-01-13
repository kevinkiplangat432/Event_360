import React from "react";

const sampleTickets = [
  {
    id: 1,
    event: "Music Festival 2026",
    date: "2026-02-20",
    venue: "Nairobi Arena",
    ticketType: "VIP",
    price: 120,
  },
  {
    id: 2,
    event: "Tech Conference",
    date: "2026-03-05",
    venue: "Strathmore University",
    ticketType: "Regular",
    price: 50,
  },
  {
    id: 3,
    event: "Comedy Night",
    date: "2026-02-28",
    venue: "Carnivore Grounds",
    ticketType: "Early Bird",
    price: 30,
  },
];

function MyTickets() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Tickets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-2">{ticket.event}</h3>
            <p className="text-gray-500 mb-1">
              <span className="font-semibold">Date:</span> {ticket.date}
            </p>
            <p className="text-gray-500 mb-1">
              <span className="font-semibold">Venue:</span> {ticket.venue}
            </p>
            <p className="text-gray-500 mb-1">
              <span className="font-semibold">Ticket:</span> {ticket.ticketType}
            </p>
            <p className="text-gray-500 mb-1">
              <span className="font-semibold">Price:</span> ${ticket.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTickets;
