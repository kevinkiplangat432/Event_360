import { Routes, Route } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import DashboardLayout from "../components/layout/DashboardLayout";

import Home from "../../pages/Home";
import LoginPage from "../components/auth/LoginPage";
import SignUpPage from "../components/auth/SignUp";
import Dashboard from "../../pages/Dashboard";
import Profile from "../../pages/Profile";


import { useAuth } from "../components/context/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <h2 className="mt-20 text-center">Please log in to access the dashboard.</h2>;
}


export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
      </Route>

      {/* Dashboard Pages */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
       <Route index element={<Dashboard />} />
       <Route path="profile" element={<Profile />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<h1 className="text-center mt-20">404 Page Not Found</h1>} />
    </Routes>
  );
}