import { createSlice } from '@reduxjs/toolkit'

export const matchSlice = createSlice({
  name: 'match',
  initialState: {
    profiles: []
  },
  reducers: {
    setProfiles: (state, action) => {
      state.profiles.push(...action.payload)
    }
  }
})

// Action creators are generated for each case reducer function
export const { setProfiles } = matchSlice.actions

export default matchSlice.reducer