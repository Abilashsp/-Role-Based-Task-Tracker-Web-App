"use client"
import { useNavigate } from "react-router-dom"
import axios from "../api/axios"
import { useAuth } from "../context/AuthContext"

export default function TaskCard({ task, onUpdated }) {
  const { user } = useAuth()
  const nav = useNavigate()

  const isCreator = user?._id === task.creatorId._id
  const isAssignee = user?._id === task.assigneeId._id
  const canEdit = isCreator
  const canChangeStatus = isCreator

  const getStatusConfig = (status) => {
    switch (status) {
      case "PENDING":
        return {
          color: "bg-gradient-to-r from-amber-500 to-orange-500",
          bg: "bg-amber-50/50",
          border: "border-amber-200/50",
          text: "text-amber-700",
          icon: "⏳",
          glow: "shadow-amber-500/20"
        }
      case "IN_PROGRESS":
        return {
          color: "bg-gradient-to-r from-blue-500 to-cyan-500",
          bg: "bg-blue-50/50",
          border: "border-blue-200/50",
          text: "text-blue-700",
          icon: "🚀",
          glow: "shadow-blue-500/20"
        }
      case "DONE":
        return {
          color: "bg-gradient-to-r from-emerald-500 to-green-500",
          bg: "bg-emerald-50/50",
          border: "border-emerald-200/50",
          text: "text-emerald-700",
          icon: "✅",
          glow: "shadow-emerald-500/20"
        }
      default:
        return {
          color: "bg-gradient-to-r from-gray-500 to-slate-500",
          bg: "bg-gray-50/50",
          border: "border-gray-200/50",
          text: "text-gray-700",
          icon: "📋",
          glow: "shadow-gray-500/20"
        }
    }
  }

  async function handleStatusChange(e) {
    try {
      await axios.patch(`/tasks/${task._id || task.id}`, { status: e.target.value })
      onUpdated()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status")
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete task?")) return
    try {
      await axios.delete(`/tasks/${task._id || task.id}`)
      onUpdated()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete")
    }
  }

  const statusConfig = getStatusConfig(task.status)

  return (
    <div className="group relative">
      {/* Glow Effect */}
      <div className={`absolute -inset-0.5 ${statusConfig.color} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-all duration-500`}></div>

      {/* Card Container */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
        {/* Top Accent Bar */}
        <div className={`h-1.5 ${statusConfig.color}`}></div>

        <div className="relative p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className={`flex items-center justify-center w-14 h-14 ${statusConfig.color} rounded-2xl shadow-lg ${statusConfig.glow}`}>
                  <span className="text-2xl">{statusConfig.icon}</span>
                </div>
                <div className={`px-4 py-2 ${statusConfig.bg} ${statusConfig.border} border rounded-full`}>
                  <span className={`text-sm font-bold ${statusConfig.text}`}>
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
            </div>
            <div className="text-xs bg-gray-100 px-3 py-1 rounded-lg">
              {new Date(task.updatedAt || task.updated_at || task.updated).toLocaleDateString()}
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="text-gray-700 text-sm">{task.description}</p>
          </div>

          {/* People Section (LIST) */}
          <div className="space-y-4">
            {/* Creator */}
            <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold">
                {task.creatorId?.name?.charAt(0) || "C"}
              </div>
              <div>
                <div className="text-xs text-orange-600 font-bold uppercase">Creator</div>
                <div className="text-sm font-semibold">{task.creatorId?.name || "—"}</div>
              </div>
            </div>

            {/* Assignee */}
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold">
                {(task.assigneeId?.name || task.assigneeName)?.charAt(0) || "A"}
              </div>
              <div>
                <div className="text-xs text-blue-600 font-bold uppercase">Assignee</div>
                <div className="text-sm font-semibold">{task.assigneeId?.name || task.assigneeName || "—"}</div>
              </div>
            </div>
          </div>

          {/* Actions (LIST for mobile, horizontal for desktop) */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pt-4 border-t border-gray-100">
            {/* Status Selector */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Status:</label>
              <select
                value={task.status}
                disabled={!canChangeStatus}
                onChange={handleStatusChange}
                className="px-4 py-2 text-sm border rounded-lg disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="PENDING">⏳ Pending</option>
                <option value="IN_PROGRESS">🚀 In Progress</option>
                <option value="DONE">✅ Done</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {canEdit && (
                <button
                  onClick={() => nav(`/tasks/${task._id || task.id}/edit`)}
                  className="px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-600 hover:text-white"
                >
                  ✏️ Edit
                </button>
              )}
              {canEdit && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-300 rounded-lg hover:bg-red-600 hover:text-white"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
