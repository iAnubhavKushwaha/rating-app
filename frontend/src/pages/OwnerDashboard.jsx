import React, { useEffect, useState } from 'react';
import { getOwnerDashboardData } from '../api/owner';

export const OwnerDashboard = () => {
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const data = await getOwnerDashboardData();
      setStoreInfo(data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Owner Dashboard</h1>

      {/* Store Information */}
      <h2 className="text-2xl mb-2">Store Information</h2>
      <p><strong>Name:</strong> {storeInfo.store.name}</p>
      <p><strong>Address:</strong> {storeInfo.store.address}</p>
      <p><strong>Average Rating:</strong> {storeInfo.averageRating.toFixed(1)}</p>
      <p><strong>Total Ratings:</strong> {storeInfo.totalRatings}</p>

      {/* Raters List */}
      <h2 className="text-2xl mt-4 mb-2">Raters</h2>
      {storeInfo.raters.length > 0 ? (
        <ul className="list-disc pl-6">
          {storeInfo.raters.map((rater) => (
            <li key={rater.id}>
              <strong>{rater.user.name}</strong> - Rating: {rater.rating} on {new Date(rater.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No ratings submitted yet.</p>
      )}
    </div>
  );
};