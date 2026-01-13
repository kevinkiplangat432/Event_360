/* will contain data about my tickets the profile and etc */

import React from "react";
import {Link} from "react-router-dom"
function DashboardSIdebar(){
    return(
        <div className="w-64 bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <Link to ="/dashboard" className="hover:text-blue-600">Overview</Link>
        </li>
        <li>
          <Link to ="/dashboard/my-tickets" className="hover:text-blue-600">My Tickets</Link>
        </li>
        <li>
          <Link to ="/profile" className="hover:text-blue-600">Profile</Link>
        </li>
        <li>
          <Link to="/" className="hover:text-blue-600">Home</Link>
        </li>
      </ul>
    </div>
  );
}

export default DashboardSIdebar;
    
