/* overview for tickets purchased, reviews and etc */

import React from "react"

function DashboardCard({ title, value }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default DashboardCard;