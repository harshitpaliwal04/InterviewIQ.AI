import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage/index.js' // localStorage
import userSlice from './../REDUX/userSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user']  // 👈 only persist user slice
}

const persistedReducer = persistReducer(persistConfig, userSlice)

export const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false  // 👈 required for redux-persist
    })
})

export const persistor = persistStore(store)