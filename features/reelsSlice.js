import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'reels',
  initialState: {
    reelsList: [],
    reelsLimit: 20,
    reelsProps: null
  },
  reducers: {
    setReels: (state, action) => {
      state.reelsList.push(...action.payload)
    },

    setReelsProps: (state, action) => {
      state.reelsProps = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setReels, setReelsProps } = userSlice.actions

export default userSlice.reducer