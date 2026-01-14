import { useAuth } from "../src/components/context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-2xl font-bold">Profile</h2>
      {user ? (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}