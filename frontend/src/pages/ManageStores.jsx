import { useEffect, useState } from "react";
import { listStores, createStore } from "../api/admin";

export const ManageStores = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "", ownerId: "" });

  const fetchStores = async () => {
    const data = await listStores(filters);
    setStores(data.items);
  };

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createStore(form);
    setShowModal(false);
    fetchStores();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Stores</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Name"
          className="border p-2 rounded"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          placeholder="Address"
          className="border p-2 rounded"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowModal(true)}
      >
        Add Store
      </button>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Owner</th>
            <th className="p-2 border">Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{s.email}</td>
              <td className="p-2 border">{s.address}</td>
              <td className="p-2 border">{s.owner?.name || "Unassigned"}</td>
              <td className="p-2 border">{s.overallRating.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Create Store */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Add Store</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <input placeholder="Name" className="border p-2" onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Email" className="border p-2" onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input placeholder="Address" className="border p-2" onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <input placeholder="Owner ID" className="border p-2" onChange={(e) => setForm({ ...form, ownerId: e.target.value })} />
              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
                <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
