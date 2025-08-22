import { useEffect, useState } from "react";
import { listUsers, createUser } from "../api/admin";

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", role: "" });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "NORMAL",
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await listUsers(filters);
      setUsers(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.address) {
      return alert("All fields are required.");
    }
    try {
      await createUser(form);
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-teal-700 mb-10 text-center">
        Manage Users
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          placeholder="Name"
          className="border border-gray-300 px-4 py-2 rounded-lg flex-grow focus:ring-2 focus:ring-teal-500 outline-none transition"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          placeholder="Email"
          className="border border-gray-300 px-4 py-2 rounded-lg flex-grow focus:ring-2 focus:ring-teal-500 outline-none transition"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <select
          className="border border-gray-300 px-4 py-2 rounded-lg flex-grow focus:ring-2 focus:ring-teal-500 outline-none transition"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="NORMAL">NORMAL</option>
          <option value="OWNER">OWNER</option>
        </select>
        <button
          className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg transition"
          onClick={() => setFilters({ name: "", email: "", role: "" })}
        >
          Clear
        </button>
      </div>

      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <button
          className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg shadow transition"
          onClick={() => setShowModal(true)}
        >
          + Add User
        </button>
      </div>

      {/* Loading State */}
      {loading && <p className="text-gray-500">Loading users...</p>}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Address</th>
              <th className="p-3 border-b">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u, i) => (
                <tr
                  key={u.id}
                  className={`hover:bg-teal-50 transition ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3 border-b">{u.name}</td>
                  <td className="p-3 border-b">{u.email}</td>
                  <td className="p-3 border-b">{u.address}</td>
                  <td className="p-3 border-b font-semibold text-teal-700">
                    {u.role}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Create User */}
      {showModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Add User
            </h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <input
                placeholder="Name"
                className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                placeholder="Email"
                type="email"
                className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <input
                placeholder="Address"
                className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />
              <select
                className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="NORMAL">NORMAL</option>
                <option value="ADMIN">ADMIN</option>
                <option value="OWNER">OWNER</option>
              </select>
              <div className="flex gap-3 mt-6 justify-end">
                <button
                  type="submit"
                  className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg shadow transition"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition"
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
