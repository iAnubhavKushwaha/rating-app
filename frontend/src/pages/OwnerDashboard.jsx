import React, { useEffect, useState } from 'react';
import { getOwnerDashboardData } from '../api/owner';
import { FaStore, FaStar, FaUser } from 'react-icons/fa';

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

  if (loading) return <div className="text-center p-4"><div className="loader">Loading...</div></div>;
  if (error) return <div className="text-red-500 text-center p-4"><span>Error loading dashboard: {error}</span></div>;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Owner Dashboard</h1>

      {/* Dashboard Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Store Information Card */}
        <section className="bg-white shadow-lg rounded-lg p-6 flex flex-col h-full">
          <div className="flex items-center">
            <FaStore className="text-4xl text-blue-500" />
            <h2 className="text-2xl font-semibold ml-4">Store Information</h2>
          </div>
          <p className="mt-4"><strong className="font-medium">Name:</strong> {storeInfo.store.name}</p>
          <p><strong className="font-medium">Address:</strong> {storeInfo.store.address}</p>
          <p><strong className="font-medium">Average Rating:</strong> <FaStar className="inline text-yellow-500" /> {storeInfo.averageRating.toFixed(1)}</p>
          <p><strong className="font-medium">Total Ratings:</strong> {storeInfo.totalRatings}</p>
        </section>

        {/* Raters List Card */}
        <section className="bg-white shadow-lg rounded-lg p-6 h-full overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4"><FaUser className="inline text-blue-500" /> Raters</h2>
          {storeInfo.raters.length > 0 ? (
            <ul className="list-disc pl-6 space-y-2">
              {storeInfo.raters.map((rater) => (
                <li key={rater.id} className="flex justify-between items-center">
                  <div>
                    <strong className="text-gray-800">{rater.user.name}</strong> - Rating: <span className="font-medium">{rater.rating}</span> on {new Date(rater.createdAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No ratings submitted yet.</p>
          )}
        </section>

      </div>
    </div>
  );
};