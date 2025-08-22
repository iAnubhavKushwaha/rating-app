// src/pages/Stores.jsx

import { useEffect, useState } from "react";
import { listStores } from "../api/store";
import { StoreCard } from "../components/StoreCard";
import { useAuth } from "../context/authContext";

export const Stores = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await listStores();
      setStores(data.items || []);
      setError(null); // Reset any previous error messages
    } catch (err) {
      console.error("Error fetching stores:", err);
      setError("Failed to load stores. Please try again later.");
      setStores([]); // Reset stores on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores(); // Fetch stores on component mount
  }, []);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {loading ? (
        <p className="text-center">Loading stores...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stores.length > 0 ? (
            stores.map((s) => <StoreCard key={s.id} store={s} user={user} />)
          ) : (
            <p className="text-center">No stores available.</p>
          )}
        </div>
      )}
    </div>
  );
};