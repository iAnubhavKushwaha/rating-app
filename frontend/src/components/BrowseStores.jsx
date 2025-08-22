// src/components/BrowseStores.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/storage";
import { StoreCard } from "./StoreCard";

const BrowseStores = ({ refreshStats }) => {
  const [stores, setStores] = useState([]);

  // Fetch all stores
  const fetchStores = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stores", {
        headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
      });
      const data = res.data.data || res.data;
      setStores(data.items || []);
    } catch (err) {
      console.error("Error fetching stores:", err);
      setStores([]);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []); // Only run once on component mount

  return (
    <div>
      <h2 className="mt-8 font-bold">Browse Stores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stores && stores.length > 0 ? (
          stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              refreshStores={() => {
                fetchStores();
                if (refreshStats) refreshStats();
              }}
            />
          ))
        ) : (
          <p>No stores available.</p>
        )}
      </div>
    </div>
  );
};

export default BrowseStores;