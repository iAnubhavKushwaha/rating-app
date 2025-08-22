// src/pages/ManageUsers.jsx
import { useEffect, useState } from "react";
import { listUsers, createUser } from "../api/admin";

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", role: "" });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "", role: "NORMAL" });

  const fetchUsers = async () => {
    const data = await listUsers(filters);
    setUsers(data.items);
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createUser(form);
    setShowModal(false);
    fetchUsers();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Name"
          className="border p-2 rounded"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          placeholder="Email"
          className="border p-2 rounded"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <select
          className="border p-2 rounded"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="NORMAL">NORMAL</option>
          <option value="OWNER">OWNER</option>
        </select>
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowModal(true)}
      >
        Add User
      </button>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.address}</td>
              <td className="p-2 border">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Create User */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Add User</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <input placeholder="Name" className="border p-2" onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Email" className="border p-2" onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input type="password" placeholder="Password" className="border p-2" onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <input placeholder="Address" className="border p-2" onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <select className="border p-2" onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="NORMAL">NORMAL</option>
                <option value="ADMIN">ADMIN</option>
                <option value="OWNER">OWNER</option>
              </select>
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
