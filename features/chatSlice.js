import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    search: '',
    matches: [],
    matchesFilter: []
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload
    },

    setMatches: (state, action) => {
      state.matches = []
      state.matches.push(...action.payload)
    },

    setMatchesFilter: (state, action) => {
      state.matchesFilter = []
      state.matchesFilter.push(...action.payload)
    }
  }
})

// Action creators are generated for each case reducer function
export const { setSearch, setMatches, setMatchesFilter } = chatSlice.actions

export default chatSlice.reducer