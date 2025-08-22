// src/pages/Dashboard.js

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

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="p-4">
      {/* User Stats */}
      <p>Total Ratings: {stats.totalRatings ?? 0}</p>
      <p>Average Score: {stats.averageScore ?? "N/A"}</p>

      {/* Rated Stores */}
      <h2 className="mt-4 font-bold">Rated Stores:</h2>
      <ul>
        {stats.ratedStores && stats.ratedStores.length > 0 ? (
          stats.ratedStores.map((r) => (
            <li key={r.storeId}>
              {r.storeName}: {r.rating}
            </li>
          ))
        ) : (
          <p>No stores rated yet.</p>
        )}
      </ul>
    </div>
  );
};