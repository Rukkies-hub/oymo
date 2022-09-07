import { createSlice } from '@reduxjs/toolkit'

export const notificationSlice = createSlice({
  name: 'chat',
  initialState: {
    notifications: []
  },
  reducers: {
    setNotificatios: (state, action) => {
      state.notifications.push(...action.payload)
    }
  }
})

// Action creators are generated for each case reducer function
export const { setNotificatios } = notificationSlice.actions

export default notificationSlice.reducer