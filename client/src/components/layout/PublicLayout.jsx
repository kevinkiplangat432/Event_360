import { Outlet, Link } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-indigo-600 text-white p-4 flex justify-between">
        <h1 className="font-bold text-xl">Event360</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/signup" className="hover:underline">Sign Up</Link>
        </div>
      </nav>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

      <footer className="bg-gray-100 text-center p-4">
        © 2026 Event360
      </footer>
    </div>
  );
}