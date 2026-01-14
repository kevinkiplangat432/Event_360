import DashboardSidebar from "../dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}