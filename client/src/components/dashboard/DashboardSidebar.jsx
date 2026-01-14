import { Link } from "react-router-dom";

export default function DashboardSidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col space-y-4 min-h-screen">
      <h2 className="font-bold text-xl mb-4">Dashboard</h2>
      <Link to="/dashboard" className="hover:text-blue-400">Home</Link>
      <Link to="/dashboard/profile" className="hover:text-blue-400">Profile</Link>
    </aside>
  );
}