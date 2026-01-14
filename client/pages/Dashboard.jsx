import DashboardCard from "../src/components/dashboard/DashboardCard";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <DashboardCard title="Tickets Purchased" value="5" />
        <DashboardCard title="Reviews Left" value="3" />
        <DashboardCard title="Events Attended" value="12" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">My Tickets</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Event</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-2">Music Festival 2026</td>
              <td className="p-2">Jan 20, 2026</td>
              <td className="p-2 text-green-600">Confirmed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
