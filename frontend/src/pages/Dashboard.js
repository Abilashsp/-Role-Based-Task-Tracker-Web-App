"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTasks } from "../redux/taskSlice"
import { useAuth } from "../context/AuthContext"
import TaskCard from "../components/TaskCard"
import { ClipboardListIcon, ClipboardCheckIcon } from "@heroicons/react/outline"

export default function Dashboard() {
  const { user } = useAuth()
  const dispatch = useDispatch()

  // Redux state
  const {
    assignedToMe,
    assignedByMe,
    assignedToMeCount,
    assignedByMeCount,
    loading,
  } = useSelector((state) => state.tasks)

  // Local state (unchanged)
  const [view, setView] = useState("assignedToMe")

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks(user.id))
    }
  }, [user, dispatch])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Task Dashboard
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Manage your tasks efficiently with style
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="relative p-2 bg-white/60 backdrop-blur-lg rounded-3xl border border-white/40 shadow-2xl">
            <div className="flex relative">
              <div 
                className={`absolute top-2 bottom-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl transition-all duration-500 ease-out ${
                  view === "assignedToMe" 
                    ? "left-2 w-[calc(50%-0.25rem)]" 
                    : "left-[calc(50%+0.25rem)] w-[calc(50%-0.25rem)]"
                }`}
              />
              
              {/* Assigned To Me Tab */}
              <button
                className={`relative z-10 px-8 py-4 text-base font-bold transition-all duration-500 rounded-2xl flex items-center gap-3 ${
                  view === "assignedToMe" 
                    ? "text-white" 
                    : "text-gray-700 hover:text-indigo-600"
                }`}
                onClick={() => setView("assignedToMe")}
              >
                <ClipboardCheckIcon className="w-5 h-5" />
                Assigned to Me
                <span className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full ${
                  view === "assignedToMe" 
                    ? "bg-white/30 text-white" 
                    : "bg-indigo-100 text-indigo-700"
                }`}>
                  {assignedToMeCount}
                </span>
              </button>
              
              {/* Assigned By Me Tab */}
              <button
                className={`relative z-10 px-8 py-4 text-base font-bold transition-all duration-500 rounded-2xl flex items-center gap-3 ${
                  view === "assignedByMe" 
                    ? "text-white" 
                    : "text-gray-700 hover:text-indigo-600"
                }`}
                onClick={() => setView("assignedByMe")}
              >
                <ClipboardListIcon className="w-5 h-5" />
                Assigned by Me
                <span className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full ${
                  view === "assignedByMe" 
                    ? "bg-white/30 text-white" 
                    : "bg-purple-100 text-purple-700"
                }`}>
                  {assignedByMeCount}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-8 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Loading your tasks...</h3>
              <p className="text-gray-600">Please wait while we fetch your data</p>
            </div>
          </div>
        ) : (
          <div className="transition-all duration-500 ease-out">
            {view === "assignedToMe" ? (
              assignedToMe.length === 0 ? (
                <EmptyState
                  icon={<ClipboardCheckIcon className="w-24 h-24 text-indigo-300" />}
                  title="No tasks assigned to you"
                  subtitle="When someone assigns you a task, it will appear here."
                />
              ) : (
                <TaskList tasks={assignedToMe} onUpdated={() => dispatch(fetchTasks(user.id))} />
              )
            ) : assignedByMe.length === 0 ? (
              <EmptyState
                icon={<ClipboardListIcon className="w-24 h-24 text-purple-300" />}
                title="You haven't assigned any tasks"
                subtitle="Tasks you create will show up here."
              />
            ) : (
              <TaskList tasks={assignedByMe} onUpdated={() => dispatch(fetchTasks(user.id))} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// EmptyState component unchanged
function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="text-center py-24">
      <div className="relative inline-block mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-white/50 shadow-2xl">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">{subtitle}</p>
    </div>
  )
}

// TaskList unchanged
function TaskList({ tasks, onUpdated }) {
  return (
    <div className="space-y-8">
      {tasks.map((task, index) => (
        <div
          key={task._id || task.id}
          className="transform transition-all duration-500 ease-out"
          style={{
            animationDelay: `${index * 150}ms`,
            animation: `fadeInUp 0.8s ease-out ${index * 150}ms both`
          }}
        >
          <TaskCard task={task} onUpdated={onUpdated} />
        </div>
      ))}
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
