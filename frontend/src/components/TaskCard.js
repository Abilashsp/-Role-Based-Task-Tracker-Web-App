"use client"
import { useNavigate } from "react-router-dom"
import axios from "../api/axios"
import { useAuth } from "../context/AuthContext"

export default function TaskCard({ task, onUpdated }) {
  const { user } = useAuth()
  const nav = useNavigate()

  // ✅ Works for both ObjectId string & populated object
  const isCreator = user?._id === (task.creatorId?._id || task.creatorId)
  const isAssignee = user?._id === (task.assigneeId?._id || task.assigneeId)
  const canEdit = isCreator
  const canChangeStatus = isCreator || isAssignee // if you also want assignee to update status

  async function handleStatusChange(e) {
    try {
      await axios.patch(`/tasks/${task._id}`, { status: e.target.value })
      onUpdated()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status")
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete task?")) return
    try {
      await axios.delete(`/tasks/${task._id}`)
      onUpdated()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete")
    }
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white space-y-3">
      {/* Title & Status */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <select
          value={task.status}
          disabled={!canChangeStatus}
          onChange={handleStatusChange}
          className="px-2 py-1 text-sm border rounded"
        >
          <option value="PENDING">⏳ Pending</option>
          <option value="IN_PROGRESS">🚀 In Progress</option>
          <option value="DONE">✅ Done</option>
        </select>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700">{task.description}</p>

      {/* People */}
      <div className="text-sm text-gray-600">
        <p><strong>Creator:</strong> {task.creatorId?.name || "—"}</p>
        <p><strong>Assignee:</strong> {task.assigneeId?.name || "—"}</p>
      </div>

      {/* Actions */}
      {canEdit && (
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => nav(`/tasks/${task._id}/edit`)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
