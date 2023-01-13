import { createSlice } from '@reduxjs/toolkit'

export const chat = createSlice({
  name: 'chat',
  initialState: {
    users: [],
    messages: [],
    uid: "",
    friendData: {},
  },
  reducers: {
    setChatData: (state, action) => {
        state.messages = action.payload?.messages || [];
        state.users = action.payload?.users || [];
        state.uid = action.payload?.uid;
        state.friendData = action.payload?.friendData;
    },
    selectChat: (state, action) => {
      state.uid = action.payload
    },
    setFriendData: (state, action) => {
      state.friendData = action.payload;
  },
  },
})

// Action creators are generated for each case reducer function
export const { setChatData, selectChat, setFriendData } = chat.actions

export default chat.reducer