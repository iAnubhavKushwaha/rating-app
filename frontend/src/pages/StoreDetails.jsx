import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStoreById } from "../api/admin";

export const StoreDetails = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      const data = await getStoreById(id);
      setStore(data.store);
      setLoading(false);
    };
    fetchStore();
  }, [id]);

  if (loading) return <p>Loading store details...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Store Details</h1>
      <p><strong>Name:</strong> {store.name}</p>
      <p><strong>Address:</strong> {store.address}</p>
      <p><strong>Owner:</strong> {store.owner.name}</p>
      <h2 className="mt-4 font-semibold">Ratings</h2>
      <ul>
        {store.ratings.map(r => (
          <li key={r.id}>
            <strong>{r.user.name}:</strong> {r.rating} - {new Date(r.createdAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <p><strong>Average Rating:</strong> {store.averageRating}</p>
      <p><strong>Total Ratings:</strong> {store.totalRatings}</p>
    </div>
  );
};