import React, { useEffect, useState } from "react";
import { getOwnerDashboardData } from "../api/owner";
import { FaStore, FaStar, FaUser } from "react-icons/fa";

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

  if (loading)
    return (
  <div style={{
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "150px"
}}>
  <div style={{
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb", // light gray
    borderTop: "4px solid #0f766e", // teal
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  }} />
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
  if (error)
    return (
      <div className="text-red-500 text-center p-6">
        <span>Error loading dashboard: {error}</span>
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* <h1 className="text-3xl font-extrabold text-teal-700 mb-8 text-center">
        Owner Dashboard
      </h1> */}

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-15">
        <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4">
          <FaStore className="text-teal-600 text-3xl" />
          <div>
            <p className="text-sm text-gray-500">Store</p>
            <p className="font-semibold text-gray-800">
              {storeInfo.store.name}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4">
          <FaStar className="text-yellow-400 text-3xl" />
          <div>
            <p className="text-sm text-gray-500">Average Rating</p>
            <p className="font-semibold text-gray-800">
              {storeInfo.averageRating.toFixed(1)}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4">
          <FaUser className="text-teal-600 text-3xl" />
          <div>
            <p className="text-sm text-gray-500">Total Raters</p>
            <p className="font-semibold text-gray-800">
              {storeInfo.totalRatings}
            </p>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Store Information Card */}
        <section className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaStore className="text-2xl text-teal-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Store Information
            </h2>
          </div>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Name:</strong> {storeInfo.store.name}
            </p>
            <p>
              <strong>Address:</strong> {storeInfo.store.address}
            </p>
            <p>
              <strong>Average Rating:</strong>{" "}
              <span className="inline-flex items-center gap-1">
                <FaStar className="text-yellow-400" />{" "}
                {storeInfo.averageRating.toFixed(1)}
              </span>
            </p>
            <p>
              <strong>Total Ratings:</strong> {storeInfo.totalRatings}
            </p>
          </div>
        </section>

        {/* Raters List Card */}
        <section className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaUser className="text-2xl text-teal-600" />
            <h2 className="text-xl font-semibold text-gray-800">Raters</h2>
          </div>
          {storeInfo.raters.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {storeInfo.raters.map((rater) => (
                <li
                  key={rater.id}
                  className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {rater.user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(rater.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="bg-teal-100 text-teal-700 text-sm font-semibold px-3 py-1 rounded-full">
                    {rater.rating} ★
                  </span>
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
