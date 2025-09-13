import { configureStore } from "@reduxjs/toolkit"
import taskReducer from "./redux/taskSlice"

const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
})

export default store
