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
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          padding: "24px",
          transition: "all 0.3s ease",
          width: "380px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Store Name */}
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1f2937", textAlign: "center" }}>
          {store.name}
        </h2>
        <p style={{ fontSize: "14px", color: "#6b7280", textAlign: "center", marginTop: "6px" }}>
          {store.address}
        </p>

        {/* Your Rating */}
        <div style={{ marginTop: "16px", display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>Your Rating:</span>
          <div style={{ marginLeft: "8px" }}>
            <RatingStars rating={myRating} readOnly />
          </div>
        </div>

        {/* Average Rating */}
        <p style={{ marginTop: "10px", fontSize: "14px", color: "#6b7280", textAlign: "center" }}>
          Average:{" "}
          <span style={{ color: "#059669", fontWeight: 600 }}>
            {averageRating.toFixed(1)}
          </span>{" "}
          / 5 ({store.totalRatings} ratings)
        </p>

        {/* Rate Button */}
        <div style={{ marginTop: "20px", width: "100%" }}>
          <button
            onClick={() => {
              setTempRating(myRating);
              setShowModal(true);
            }}
            style={{
              background: "#0d9488",
              color: "white",
              fontSize: "14px",
              padding: "10px 16px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              width: "100%",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.background = "#047857")}
            onMouseOut={(e) => (e.target.style.background = "#0d9488")}
          >
            Rate this Store
          </button>
        </div>
      </div>

      {/* Rating Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              width: "380px",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#1f2937",
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              Rate {store.name}
            </h3>

            {/* Stars Selection */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <RatingStars rating={tempRating} onSelect={setTempRating} />
            </div>

            {/* Buttons */}
            <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                style={{
                  padding: "8px 14px",
                  background: "#e5e7eb",
                  color: "#374151",
                  fontSize: "14px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "8px 14px",
                  background: "#0d9488",
                  color: "white",
                  fontSize: "14px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
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
