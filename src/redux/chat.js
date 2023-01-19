import { createSlice } from '@reduxjs/toolkit'

export const chat = createSlice({
  name: 'chat',
  initialState: {
    users: [],
    messages: [],
    uid: "",
    friendData: {},
    loading: false,
    info: {},
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
    selectMessage: (state, action) => {
      state.selectedMessage = action.payload
    },
    setFriendData: (state, action) => {
      state.friendData = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setIsReplyTo: (state, action) => {
      state.isReplyTo = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setInfoContent: (state, action) => {
      state.info.content = action.payload
    },
    setInfoStatus: (state, action) => {
      state.info.status = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setChatData, selectChat, setFriendData, selectMessage, setMode, setIsReplyTo, setLoading, setInfoContent } = chat.actions

export default chat.reducer