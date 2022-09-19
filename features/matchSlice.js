import { createSlice } from '@reduxjs/toolkit'

export const matchSlice = createSlice({
  name: 'match',
  initialState: {
    profiles: [],
    pendingSwipes: []
  },
  reducers: {
    setProfiles: (state, action) => {
      state.profiles.push(...action.payload)
    },

    setPendingSwipes: (state, action) => {
      state.pendingSwipes.push(...action.payload)
    }
  }
})

// Action creators are generated for each case reducer function
export const { setProfiles, setPendingSwipes } = matchSlice.actions

export default matchSlice.reducer