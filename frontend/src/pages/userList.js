"use client"

import { useEffect, useState } from "react"
import axios from "../api/axios"

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: "", email: "", role: "MEMBER" })
  const [loading, setLoading] = useState(false)

  async function loadUsers() {
    setLoading(true)
    try {
      const res = await axios.get("/users")
      setUsers(res.data.users)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  function startEdit(user) {
    setEditing(user._id)
    setForm({ name: user.name, email: user.email, role: user.role })
  }

  async function saveEdit() {
    await axios.patch(`/users/${editing}`, form)
    setEditing(null)
    loadUsers()
  }

  async function deleteUser(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?")
    if (!confirmDelete) return
    await axios.delete(`/users/${id}`)
    loadUsers()
  }

  return (
    <main className="px-4 py-6">
      <section className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Manage Users</h2>
            <p className="mt-1 text-sm text-gray-600">View, edit, and delete user accounts.</p>
          </div>
          <button
            onClick={loadUsers}
            className="rounded-lg bg-orange-500 px-4 py-2 text-white text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md"
          >
            Refresh
          </button>
        </header>

        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading users...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-600">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-600">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-600">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                      {editing === u._id ? (
                        <input
                          aria-label="Name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Full name"
                        />
                      ) : (
                        u.name
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                      {editing === u._id ? (
                        <input
                          aria-label="Email"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="email@example.com"
                        />
                      ) : (
                        u.email
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                      {editing === u._id ? (
                        <select
                          aria-label="Role"
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="MEMBER">Member</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            u.role === "ADMIN" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm">
                      {editing === u._id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={saveEdit}
                            className="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(u)}
                            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
