import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/storage";
import { StoreCard } from "./StoreCard";

const BrowseStores = ({ refreshStats }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const storesPerPage = 6; // Number of stores to display per page

  // Fetch all stores
  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/stores", {
        headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
      });
      const data = res.data.data || res.data;
      setStores(data.items || []);
    } catch (err) {
      console.error("Error fetching stores:", err);
      setError("Failed to load stores. Please try again.");
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores(); // Fetch stores on component mount
  }, []);

  // Get current stores to display
  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = stores.slice(indexOfFirstStore, indexOfLastStore);
  
  // Calculate total pages
  const totalPages = Math.ceil(stores.length / storesPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // Update current page
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {loading ? (
        <p>Loading stores...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {currentStores.length > 0 ? (
              currentStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  refreshStores={fetchStores} // Refresh stores function
                />
              ))
            ) : (
              <p>No stores available.</p>
            )}
          </div>
          
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="mx-2">Page {currentPage} of {totalPages}</span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BrowseStores;