"use client"

import { useEffect, useState } from "react"
import axios from "../api/axios"
import { useAuth } from "../context/AuthContext"

export default function TaskForm({ defaultValues = {}, onSaved }) {
  const [title, setTitle] = useState(defaultValues.title || "")
  const [description, setDescription] = useState(defaultValues.description || "")
  const [assigneeId, setAssigneeId] = useState(defaultValues.assigneeId || "")
  const [users, setUsers] = useState([])
  const { user } = useAuth()

useEffect(() => {
  (async () => {
    try {
      const res = await axios.get(`/users`);
      setUsers(res.data.users || []);
    } catch (err) {
      setUsers([]);
    }
  })();
}, [user?.id]);

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (defaultValues._id || defaultValues.id) {
        // update
        await axios.patch(`/tasks/${defaultValues._id || defaultValues.id}`, { title, description, assigneeId })
      } else {
        // create
        await axios.post("/tasks", { title, description, assigneeId })
      }
      onSaved && onSaved()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save task")
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-orange-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {defaultValues._id || defaultValues.id ? "Edit Task" : "Create New Task"}
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500"
            placeholder="Enter task title..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={5}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500 resize-none"
            placeholder="Describe the task in detail..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Assignee</label>
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-white text-gray-900"
          >
            <option value="" className="text-gray-500">
              — Select assignee —
            </option>
            {users.length === 0 && (
              <option value="" disabled className="text-gray-400">
                (No users available)
              </option>
            )}
            {users.map((u) => (
              <option key={u._id || u.id} value={u._id || u.id} className="text-gray-900">
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
          >
            {defaultValues._id || defaultValues.id ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  )
}
