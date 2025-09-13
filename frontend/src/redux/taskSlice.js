import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../api/axios"

// Fetch tasks async
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (userId) => {
  const res = await axios.get("/tasks")
  const data = res.data

  let assignedToMe = []
  let assignedByMe = []

  if (data.assignedToMe && data.assignedByMe) {
    assignedToMe = data.assignedToMe
    assignedByMe = data.assignedByMe
  } else if (Array.isArray(data)) {
    assignedToMe = data.filter((t) => (t.assignee?._id || t.assigneeId) === userId)
    assignedByMe = data.filter((t) => (t.creator?._id || t.creatorId) === userId)
  } else {
    const arr = data.tasks || []
    assignedToMe = arr.filter((t) => (t.assignee?._id || t.assigneeId) === userId)
    assignedByMe = arr.filter((t) => (t.creator?._id || t.creatorId) === userId)
  }

  return { assignedToMe, assignedByMe }
})

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    assignedToMe: [],
    assignedByMe: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.assignedToMe = action.payload.assignedToMe
        state.assignedByMe = action.payload.assignedByMe
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default taskSlice.reducer
