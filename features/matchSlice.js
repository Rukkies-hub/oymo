import { createSlice } from '@reduxjs/toolkit'

export const matchSlice = createSlice({
  name: 'match',
  initialState: {
    profiles: [],
    pendingSwipes: [],
    nearbyProfiles: []
  },
  reducers: {
    setProfiles: (state, action) => {
      state.profiles.push(...action.payload)
    },

    setPendingSwipes: (state, action) => {
      state.pendingSwipes = []
      state.pendingSwipes.push(...action.payload)
    },

    setNearbyProfiles: (state, action) => {
      state.nearbyProfiles = []
      state.nearbyProfiles.push(...action.payload)
    },
  }
})

// Action creators are generated for each case reducer function
export const { setProfiles, setPendingSwipes, setNearbyProfiles } = matchSlice.actions

export default matchSlice.reducer