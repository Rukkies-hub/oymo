import { configureStore } from '@reduxjs/toolkit'
import matchSlice from './features/matchSlice'
import userReducer from './features/userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    match: matchSlice
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})