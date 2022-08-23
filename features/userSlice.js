import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loadingInitial: true,
    profile: null
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

    setProfile: (state, action) => {
      state.profile = action.payload
    },

    setOverlay: state => {}
  }
})

// Action creators are generated for each case reducer function
export const { setUser, logout, setProfile } = userSlice.actions

export default userSlice.reducer