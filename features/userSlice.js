import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loadingInitial: true
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.loadingInitial = false
    },

    logout: (state) => {
      state.user = null
      state.loadingInitial = false
    },
  }
})

// Action creators are generated for each case reducer function
export const { setUser, logout } = userSlice.actions

export default userSlice.reducer