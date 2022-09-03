import { createSlice } from '@reduxjs/toolkit'

export const messageSlice = createSlice({
  name: 'chat',
  initialState: {
    messageReply: null
  },
  reducers: {
    setMessageReply: (state, actions) => {
      state.messageReply = actions.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setMessageReply } = messageSlice.actions

export default messageSlice.reducer