import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userApi } from '../apis/userApi';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authStatus: false,
  },
  reducers: {
    setAuthStatus(state, action: PayloadAction<boolean>) {
      state.authStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(userApi.endpoints.getMe.matchFulfilled, (state, action) => {
      state.authStatus = !!action.payload;
    });
  },
});

export const { setAuthStatus } = authSlice.actions;

export default authSlice.reducer;
