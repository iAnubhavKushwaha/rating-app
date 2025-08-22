import { useEffect, useState } from "react";
import { getAdminStats } from "../api/admin";

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminStats().then(setStats);
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl">{stats.totalUsers}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Stores</h2>
          <p className="text-2xl">{stats.totalStores}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Ratings</h2>
          <p className="text-2xl">{stats.totalRatings}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Users by Role</h2>
      <ul>
        {stats.roleCounts.map((r) => (
          <li key={r.role}>
            {r.role}: {r._count.role}
          </li>
        ))}
      </ul>
    </div>
  );
};
