import { useState } from "react";
import { RatingStars } from "./RatingStars"; // Your RatingsStars component
import { upsertRating } from "../api/rating"; // Call API to upsert rating

export const StoreCard = ({ store, refreshStores }) => {
  // State variables for ratings and modal visibility
  const [myRating, setMyRating] = useState(store.myRating ?? 0);
  const [averageRating, setAverageRating] = useState(store.overallRating ?? 0);
  const [showModal, setShowModal] = useState(false);
  const [tempRating, setTempRating] = useState(myRating);

  // Handle rating submission
  const handleSubmitRating = async () => {
    try {
      const updated = await upsertRating(store.id, tempRating);
      setMyRating(tempRating);  // Update my rating in state
      if (updated.averageRating !== undefined && updated.averageRating !== null) {
        setAverageRating(updated.averageRating); // Update average rating
      }
      setShowModal(false); // Close modal
      if (refreshStores) refreshStores(); // Refresh stores if necessary
    } catch (err) {
      console.error("Failed to submit rating", err);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md p-5 transition-transform hover:shadow-lg flex flex-col m-2 w-80 h-auto">
      <h2 className="text-xl font-semibold text-gray-800">{store.name}</h2>
      <p className="text-gray-700 text-sm">{store.address}</p>

      {/* Your rating */}
      <div className="mt-3 flex items-center">
        <span className="text-sm font-medium text-gray-600">Your Rating:</span>
        <div className="ml-2">
          <RatingStars rating={myRating} readOnly size={36} /> {/* Increased star size here */}
        </div>
      </div>

      {/* Average rating */}
      <p className="mt-2 text-sm text-gray-500">
        Average Rating: {averageRating.toFixed(1)} ({store.totalRatings} ratings)
      </p>

      {/* Rate button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => {
            setTempRating(myRating); // Set the temporary rating
            setShowModal(true); // Show the modal
          }}
          className="bg-gray-200 text-gray-800 text-sm py-2 px-4 rounded hover:bg-gray-300 transition duration-150 w-full"
        >
          Rate Store
        </button>
      </div>

      {/* Rating modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/30">
          <div className="bg-white rounded-lg shadow-md w-96 p-6 z-50"> {/* Increased width and padding */}
            <h3 className="text-xl font-semibold mb-4">Rate {store.name}</h3>
            <RatingStars rating={tempRating} onSelect={setTempRating} size={36} /> {/* Increased star size here */}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-5 py-3 bg-gray-300 text-sm rounded hover:bg-gray-400 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-3 bg-gray-700 text-white rounded hover:bg-gray-800 transition text-sm"
                onClick={handleSubmitRating}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};