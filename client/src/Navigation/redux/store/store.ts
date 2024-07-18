import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AuthSlice from '../slice/AuthSlice';
import UserSlice from '../slice/UserSlice';
import ModelsSlice from '../slice/ModelsSlice';
import ModelSlice from '../slice/ModelSlice';
import MessagesSlice from '../slice/MessagesSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { messageApi } from '../apis/messageApi';
import { companionApi } from '../apis/companionApi';
import { userApi } from '../apis/userApi';
import { deepgramAPI } from '../apis/otherApi'; 
import { videoApi } from '../apis/d_idApi'; // Import the videoApi
import { TypedUseSelectorHook, useSelector } from 'react-redux';

const rootReducer = combineReducers({
  auth: AuthSlice,
  user: UserSlice,
  models: ModelsSlice,
  model: ModelSlice,
  message: MessagesSlice,
  [messageApi.reducerPath]: messageApi.reducer,
  [companionApi.reducerPath]: companionApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [deepgramAPI.reducerPath]: deepgramAPI.reducer,
  [videoApi.reducerPath]: videoApi.reducer, // Add the videoApi reducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'model'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      messageApi.middleware,
      companionApi.middleware,
      userApi.middleware,
      deepgramAPI.middleware, // Add deepgramAPI middleware
      videoApi.middleware // Add videoApi middleware
    ),
});

// exporting the store
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
