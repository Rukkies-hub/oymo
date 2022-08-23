import { configureStore } from '@reduxjs/toolkit'
import matchSlice from './features/matchSlice'
import reelsSlice from './features/reelsSlice'
import userReducer from './features/userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    match: matchSlice,
    reels: reelsSlice
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})