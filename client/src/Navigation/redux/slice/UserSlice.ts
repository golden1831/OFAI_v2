import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userApi } from '../apis/userApi';
import { IUser } from '../../../types/user.types';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {} as IUser,
  },
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      return {
        ...state,
        user: action.payload,
      };
    },

    clearUser() {
      return {
        user: {} as IUser
      };
    },

    getUser: (state) => state,
  },
  extraReducers: (builder) => {
    builder.addMatcher(userApi.endpoints.getMe.matchFulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { setUser, clearUser, getUser } = userSlice.actions;

export default userSlice.reducer;
