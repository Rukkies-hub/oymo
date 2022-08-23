import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'reels',
  initialState: {
    reelsList: [],
    reelsLimit: 20
  },
  reducers: {
    setReels: (state, action) => {
      state.reelsList.push(...action.payload)
    }
  }
})

// Action creators are generated for each case reducer function
export const { setReels } = userSlice.actions

export default userSlice.reducer