import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'reels',
  initialState: {
    reelsList: [],
    reelsLimit: 20,
    reelsProps: null,
    reelsCommentType: 'comment',
    replyCommentProps: null,
    commentAutoFocus: false,
    showExpand: true,
    postCommentType: 'comment',
    reply: '',
    activeReelUser: null
  },
  reducers: {
    setReels: (state, action) => {
      state.reelsList = []
      state.reelsList.push(...action.payload)
    },

    setReelsProps: (state, action) => {
      state.reelsProps = action.payload
    },

    setReelsCommentType: (state, action) => {
      state.reelsCommentType = action.payload
    },

    setReplyCommentProps: (state, action) => {
      state.replyCommentProps = action.payload
    },

    setCommentAutoFocus: (state, action) => {
      state.commentAutoFocus = action.payload
    },

    setShowExpand: (state, action) => {
      state.showExpand = action.payload
    },

    setPostCommentType: (state, action) => {
      state.postCommentType = action.payload
    },

    setReply: (state, action) => {
      state.reply = action.payload
    },

    setReelsLimit: (state, action) => {
      state.reelsLimit = action.payload
    },

    setActiveReelUser: (state, action) => {
      state.activeReelUser = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  setReels,
  setReelsProps,
  setReelsCommentType,
  setReplyCommentProps,
  setCommentAutoFocus,
  setShowExpand,
  setPostCommentType,
  setReply,
  setReelsLimit,
  setActiveReelUser
} = userSlice.actions

export default userSlice.reducer