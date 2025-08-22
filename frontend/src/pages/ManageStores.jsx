import { useEffect, useState } from "react";
import { listStores, createStore } from "../api/admin";

export const ManageStores = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "", ownerId: "" });
  const [loading, setLoading] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await listStores(filters);
      setStores(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address || !form.ownerId) {
      return alert("All fields are required.");
    }
    try {
      await createStore(form);
      setShowModal(false);
      fetchStores();
    } catch (err) {
      console.error("Error creating store:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold text-teal-700 mb-10 text-center">Manage Stores</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search by name"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          placeholder="Search by address"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
        <button
          className="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
          onClick={() => setFilters({ name: "", address: "" })}
        >
          Clear
        </button>
      </div>

      {/* Add Store Button */}
      <button
        className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg mb-6 transition shadow-sm"
        onClick={() => setShowModal(true)}
      >
        + Add Store
      </button>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-6">
          <div className="w-6 h-6 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Owner</th>
              <th className="p-3 text-left">Rating</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {stores.length > 0 ? (
              stores.map((s, idx) => (
                <tr
                  key={s.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-teal-50 transition`}
                >
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">{s.address}</td>
                  <td className="p-3">{s.owner?.name || "Unassigned"}</td>
                  <td className="p-3">{s.overallRating.toFixed(1)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No stores found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Create Store */}
      {showModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Store</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <input
                placeholder="Name"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                placeholder="Email"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                placeholder="Address"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />
              <input
                placeholder="Owner ID"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
                required
              />
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition w-full"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition w-full"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
