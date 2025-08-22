import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { getToken } from "../utils/storage";
import { Star, TrendingUp, Store } from "lucide-react";

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  // Fetch dashboard stats
  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/me/dashboard", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setStats(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
<div style={{ textAlign: "center", marginBottom: "2rem" }}>
  <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#0f766e", marginBottom: "0.5rem" }}>
    Welcome, {user?.name || "User"}
  </h1>
  <p style={{
    color: "#6b7280",
    fontSize: "1rem",
    fontWeight: "400",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    borderBottom: "2px solid #0f766e",
    paddingBottom: "0.25rem"
  }}>
    <TrendingUp size={16} style={{ color: "#0f766e" }} /> Here’s a quick overview of your activity
  </p>
</div>


      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Star className="text-blue-500" size={28} />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">Total Ratings</p>
            <p className="text-3xl font-bold text-teal-800">{stats.totalRatings ?? 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <TrendingUp className="text-green-500" size={28} />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">Average Score</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.averageScore ?? "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Rated Stores Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
          <Store className="text-teal-800" /> Rated Stores
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stats.ratedStores && stats.ratedStores.length > 0 ? (
            stats.ratedStores.map((r) => (
              <div
                key={r.storeId}
                className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <p className="font-medium text-gray-800">{r.storeName}</p>
                <p className="text-gray-600 mt-1">
                  Rating:{" "}
                  <span className="font-bold text-teal-800">{r.rating}</span>
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No stores rated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
