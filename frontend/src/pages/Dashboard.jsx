import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { getToken } from "../utils/storage";

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

  if (!stats) return <div className="text-center">Loading...</div>;

  return (
    <div className="flex flex-col items-center h-screen bg-gray-100 p-4">
      {/* Total Ratings Section */}
      <div className="bg-white w-full p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Total Ratings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <p className="text-lg font-semibold">Total Ratings:</p>
            <p className="text-2xl text-blue-500">{stats.totalRatings ?? 0}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow">
            <p className="text-lg font-semibold">Average Score:</p>
            <p className="text-2xl text-blue-500">{stats.averageScore ?? "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Rated Stores Section */}
      <div className="bg-white w-full p-6 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-2">Rated Stores:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.ratedStores && stats.ratedStores.length > 0 ? (
            stats.ratedStores.map((r) => (
              <div key={r.storeId} className="bg-gray-50 p-4 rounded shadow-md">
                <p className="font-medium">{r.storeName}</p>
                <p className="text-gray-700">Rating: <span className="font-bold">{r.rating}</span></p>
              </div>
            ))
          ) : (
            <p>No stores rated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};