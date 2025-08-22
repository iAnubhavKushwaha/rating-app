import axios from "axios";

export const upsertRating = async (storeId, rating) => {
  try {
    const token = localStorage.getItem("token"); // Or wherever your JWT is stored
    const response = await axios.put(
      `http://localhost:5000/api/ratings/${storeId}`,
      { rating },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Should include updated rating info
  } catch (err) {
    console.error("Error updating rating:", err);
    throw err;
  }
};
