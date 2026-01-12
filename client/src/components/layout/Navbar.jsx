import React from "react";

function Navbar(){
    return(
        <nav className = "flex items-center justify-between px-8 py-4 bg-white shadow">
            <h1 className="text-xl font-bold">Event 360</h1>

            <ul className="flex gap-6 text-gray-600">
                <li>Home</li>
                <li>Upcoming Events</li>
                 <li>Pricing</li>
        <li>How it works</li>
      </ul>

      <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">
        Contact Us
      </button>
    </nav>
  );
}

export default Navbar;



         