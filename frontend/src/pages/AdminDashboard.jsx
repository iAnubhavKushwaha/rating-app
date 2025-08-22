import { useEffect, useState } from "react";
import { getAdminStats } from "../api/admin";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

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

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!stats)
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "200px",
      }}
    >
      {/* Spinner */}
      <div
        style={{
          border: "4px solid #e5e7eb", // light gray
          borderTop: "4px solid #0f766e", // teal highlight
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          animation: "spin 1s linear infinite",
        }}
      />

      {/* Text */}
      <p
        style={{
          color: "#6b7280",
          marginTop: "12px",
          fontSize: "15px",
        }}
      >
        Loading dashboard...
      </p>

      {/* Inline keyframes */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );


  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-teal-700 mb-10 text-center tracking-tight">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Section */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            color="bg-teal-100 text-teal-700"
          />
          <StatCard
            title="Total Stores"
            value={stats.totalStores}
            color="bg-gray-100 text-gray-700"
          />
          <StatCard
            title="Total Ratings"
            value={stats.totalRatings}
            color="bg-emerald-100 text-emerald-700"
          />
        </div>

        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Users by Role
          </h2>
          {stats.roleCounts.length > 0 ? (
            <RoleChart roleCounts={stats.roleCounts} />
          ) : (
            <p className="text-gray-500 text-center">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, color }) => (
  <div
    className={`${color} p-8 rounded-xl shadow-sm hover:shadow-md text-center transition-transform transform hover:scale-105`}
  >
    <h2 className="text-lg font-medium tracking-wide">{title}</h2>
    <p className="text-4xl font-extrabold mt-2">{value}</p>
  </div>
);

// RoleChart Component
const RoleChart = ({ roleCounts }) => {
  const roles = roleCounts.map((r) => r.role);
  const counts = roleCounts.map((r) => r._count.role);

  const chartData = {
    labels: roles,
    datasets: [
      {
        label: "Number of Users",
        data: counts,
        backgroundColor: ["#14b8a6", "#6b7280", "#10b981"], // teal, gray, emerald
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
};
