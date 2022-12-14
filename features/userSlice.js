import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loadingInitial: true,
    profile: null,
    passsions: [],
    theme: false,
    setup: false,
    activeRoute: ''
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

    setPassions: (state, action) => {
      state.passsions.push(...action.payload)
    },

    setTheme: (state, action) => {
      state.theme = action.payload
    },

    setSetup: (state, action) => {
      state.setup = action.payload
    },

    setActiveRoute: (state, action) => {
      state.activeRoute = action.payload
    },
  }
})

// Action creators are generated for each case reducer function
export const { setUser, logout, setProfile, setPassions, setTheme, setSetup, setActiveRoute } = userSlice.actions

export default userSlice.reducer