import { useEffect, useState } from "react";
import { getAdminStats } from "../api/admin";
import { Bar } from "react-chartjs-2"; // Importing the Bar chart component
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"; // Import necessary Chart.js components

// Registering the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load stats. Please try again.");
      }
    };
    fetchStats();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users by Role Chart */}
        <div className="bg-white p-4 rounded-lg shadow h-80">
          <h2 className="text-xl font-bold mb-4">Users by Role</h2>
          {stats.roleCounts.length > 0 ? (
            <RoleChart roleCounts={stats.roleCounts} />
          ) : (
            <p className="text-gray-600">No users found.</p>
          )}
        </div>

        {/* Stats Display */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <StatCard title="Total Users" value={stats.totalUsers} bgColor="bg-blue-100" />
          <StatCard title="Total Stores" value={stats.totalStores} bgColor="bg-green-100" />
          <StatCard title="Total Ratings" value={stats.totalRatings} bgColor="bg-purple-100" />
        </div>
      </div>
    </div>
  );
};

// StatCard component for displaying stats
const StatCard = ({ title, value, bgColor }) => (
  <div className={`${bgColor} p-3 rounded-lg shadow transition-transform hover:scale-105 h-32`}>
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

// RoleChart component for displaying user roles in a chart
const RoleChart = ({ roleCounts }) => {
  const roles = roleCounts.map((r) => r.role);
  const counts = roleCounts.map((r) => r._count.role);

  const chartData = {
    labels: roles,
    datasets: [
      {
        label: 'Number of Users',
        data: counts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Customize the background color
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,  // Responsive height based on container
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Distribution by Role',
      },
    },
  };

  return (
    <div style={{ height: 'calc(100% - 50px)' }}> {/* Adjust height based on title */}
      <Bar data={chartData} options={options} />
    </div>
  );
};