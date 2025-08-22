import { useState } from "react";
import { RatingStars } from "./RatingStars";
import { upsertRating } from "../api/rating";

export const StoreCard = ({ store, refreshStores }) => {
  const [myRating, setMyRating] = useState(store.myRating ?? 0);
  const [averageRating, setAverageRating] = useState(store.overallRating ?? 0);
  const [showModal, setShowModal] = useState(false);
  const [tempRating, setTempRating] = useState(myRating);

  const handleSubmitRating = async () => {
    try {
      const updated = await upsertRating(store.id, tempRating);

      setMyRating(tempRating);
      if (updated.averageRating !== undefined && updated.averageRating !== null) {
        setAverageRating(updated.averageRating);
      }

      setShowModal(false);
      if (refreshStores) refreshStores();
    } catch (err) {
      console.error("Failed to submit rating", err);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-bold">{store.name}</h2>
      <p className="text-gray-600">{store.address}</p>

      {/* Your rating */}
      <div className="mt-2 flex items-center space-x-2">
        <span className="text-sm text-gray-700">Your Rating:</span>
        <RatingStars rating={myRating} readOnly />
      </div>

      {/* Average rating */}
      <p className="mt-1 text-sm text-gray-600">
        Average Rating: {averageRating.toFixed(1)} ({store.totalRatings} ratings)
      </p>

      {/* Rate button */}
      <button
        onClick={() => {
          setTempRating(myRating);
          setShowModal(true);
        }}
        className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Rate Store
      </button>

      {/* Rating popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Rate {store.name}</h3>

            <RatingStars rating={tempRating} onSelect={setTempRating} />

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
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
