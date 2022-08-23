import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'reels',
  initialState: {
    reelsList: [],
    reelsLimit: 20,
    reelsProps: null,
    reelsCommentType: 'comment',
    replyCommentProps: null
  },
  reducers: {
    setReels: (state, action) => {
      state.reelsList.push(...action.payload)
    },

    setReelsProps: (state, action) => {
      state.reelsProps = action.payload
    },

    setReelsCommentType: (state, action) => {
      state.reelsCommentType = action.payload
    },

    setReplyCommentProps: state => { }
  }
})

// Action creators are generated for each case reducer function
export const {
  setReels,
  setReelsProps,
  setReelsCommentType,
  setReplyCommentProps
} = userSlice.actions

export default userSlice.reducer