// components/EventCard.jsx
import React from 'react';

const EventCard = ({ event, onBookTicket }) => {
  const {
    title,
    category,
    date,
    time,
    location,
    description,
    tickets,
    price,
    originalPrice,
    discountText,
    urgencyText,
    specialTag,
    categoryColor,
    buttonColor,
    imageUrl,
    ticketTypes,
    organizer
  } = event;

  const getTicketsText = () => {
    if (tickets > 1000) {
      return <span className="text-green-600 font-semibold text-sm">{tickets.toLocaleString()} tickets available</span>;
    } else if (tickets > 100) {
      return <span className="text-green-600 font-semibold text-sm">{tickets} tickets available</span>;
    } else if (tickets > 0) {
      return <span className="text-orange-600 font-semibold text-sm">Only {tickets} tickets left!</span>;
    } else {
      return <span className="text-red-600 font-semibold text-sm">Sold Out</span>;
    }
  };

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-0 left-0 bg-gradient-to-r ${categoryColor} px-5 py-2`}>
          <span className="text-white font-semibold text-sm uppercase tracking-wider">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-5">
          {title}
        </h2>
        
        <div className="space-y-3 mb-5">
          <div className="flex items-center text-gray-600">
            <span className="text-xl mr-3">📅</span>
            <span className="text-base">{date}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <span className="text-xl mr-3">🕐</span>
            <span className="text-base">{time}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <span className="text-xl mr-3">📍</span>
            <span className="text-base">{location}</span>
          </div>
          
          {organizer && (
            <div className="flex items-center text-gray-600">
              <span className="text-xl mr-3">🎵</span>
              <span className="text-base">Organized by {organizer}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 leading-relaxed mb-6">
          {description}
        </p>

        {ticketTypes ? (
          <div className="pt-5 border-t border-gray-200">
            {getTicketsText()}
            <div className="space-y-2 mb-4 mt-3">
              {ticketTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="font-semibold text-gray-700">{type.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-bold text-lg">{type.price}</span>
                    {type.originalPrice && (
                      <span className="text-gray-400 text-sm line-through">{type.originalPrice}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {discountText && (
              <span className="text-orange-600 font-semibold text-xs uppercase block mb-3">
                {discountText}
              </span>
            )}
            <button 
              className={`w-full bg-gradient-to-r ${buttonColor} text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg`}
              onClick={() => onBookTicket(title)}
            >
              Book Now
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-5 border-t border-gray-200">
            <div className="flex flex-col gap-1">
              {getTicketsText()}
              <div className="flex items-center gap-2">
                <span className="text-gray-900 text-2xl font-bold">
                  ${price === 0 ? "FREE" : price.toLocaleString()}
                </span>
                {originalPrice && (
                  <span className="text-gray-400 text-lg line-through">
                    ${originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {discountText && (
                <span className="text-orange-600 font-semibold text-xs uppercase">
                  {discountText}
                </span>
              )}
              {specialTag && (
                <span className="text-purple-700 font-bold text-xs uppercase">
                  {specialTag}
                </span>
              )}
              {urgencyText && (
                <span className="text-red-700 font-bold text-xs uppercase animate-pulse">
                  {urgencyText}
                </span>
              )}
            </div>
            
            <button 
              className={`bg-gradient-to-r ${buttonColor} text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity duration-300 shadow-lg`}
              onClick={() => onBookTicket(title)}
            >
              Book Now
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default EventCard;