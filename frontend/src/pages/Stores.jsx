import { useEffect, useState } from "react";
import { listStores } from "../api/store";
import { StoreCard } from "../components/StoreCard";
import { useAuth } from "../context/AuthContext";

export const Stores = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);

  const fetchStores = async () => {
    const data = await listStores();
    setStores(data.items);
  };

  useEffect(() => { fetchStores(); }, []);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {stores.map((s) => <StoreCard key={s.id} store={s} user={user} />)}
    </div>
  );
};
