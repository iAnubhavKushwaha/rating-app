import { useEffect, useState } from "react";
import { listUsers, createUser } from "../api/admin";

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", role: "" });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "", role: "NORMAL" });
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Name"
          className="border p-2 rounded flex-grow"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          placeholder="Email"
          className="border p-2 rounded flex-grow"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <select
          className="border p-2 rounded flex-grow"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="NORMAL">NORMAL</option>
          <option value="OWNER">OWNER</option>
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded flex-shrink-0"
          onClick={() => {
            setFilters({ name: "", email: "", role: "" });
          }}
        >
          Clear Filters
        </button>
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowModal(true)}
      >
        Add User
      </button>

      {/* Loading State */}
      {loading && <p className="text-gray-500">Loading users...</p>}

      {/* Table */}
      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.address}</td>
                <td className="p-2 border">{u.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-4">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Create User */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add User</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <input
                placeholder="Name"
                className="border p-2"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                placeholder="Email"
                type="email"
                className="border p-2"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="border p-2"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <input
                placeholder="Address"
                className="border p-2"
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />
              <select
                className="border p-2"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="NORMAL">NORMAL</option>
                <option value="ADMIN">ADMIN</option>
                <option value="OWNER">OWNER</option>
              </select>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
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