import { combineReducers, configureStore } from '@reduxjs/toolkit'
import auth from './auth'
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import chat from './chat'

const persistConfig = {
  key: 'authReducer',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
  authReducer: auth,
  chat: chat,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})