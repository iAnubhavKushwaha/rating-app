import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../api/admin";

export const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserById(id);
      setUser(data.user);
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  if (loading) return <p>Loading user details...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">User Details</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Address:</strong> {user.address}</p>
      <p><strong>Role:</strong> {user.role}</p>
      {user.store && (
        <div>
          <h2 className="mt-4 font-semibold">Store Info</h2>
          <p><strong>Store ID:</strong> {user.store.id}</p>
          <p><strong>Store Name:</strong> {user.store.name}</p>
        </div>
      )}
    </div>
  );
};