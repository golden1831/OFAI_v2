import { createApi } from '@reduxjs/toolkit/query/react';
import { getBaseQuery } from '../fetch-auth-query';
import { IUser, IUserGallery } from '../../../types/user.types';
import { IAuthRequest } from './messageApi';
import { IPagination, IPaginationRequest } from '../../../types';

export interface IUpdateUserRequest extends IAuthRequest {
  name: string;
  email: string;
  image?: File;
  username: string;
  interests: string[];
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: getBaseQuery({ baseUrl: '/users' }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getMe: builder.query<IUser, IAuthRequest>({
      query: ({ headers }) => ({
        url: '/me',
        method: 'GET',
        headers,
      }),
      providesTags: ['Users'],
    }),
    getUserByUserNameOrWallet: builder.query<IUser, { username: string }>({
      query: ({ username }) => ({
        url: `/${username}`,
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),
    updateUser: builder.mutation<IUser, IUpdateUserRequest>({
      query: ({ name, email, username, interests, image, headers }) => {
        const formData = new FormData();

        formData.append('name', name);
        formData.append('email', email);
        formData.append('username', username);
        formData.append('interests', JSON.stringify(interests));

        if (image) formData.append('image', image);

        return {
          url: '/me',
          method: 'PUT',
          body: formData,
          headers,
        };
      },
      invalidatesTags: ['Users'],
    }),
    getMyGallery: builder.query<IUserGallery[], IAuthRequest>({
      query: ({ headers }) => ({
        url: '/my-gallery',
        method: 'GET',
        headers,
      }),
    }),
    dailyCheckin: builder.mutation<IUser, IAuthRequest>({
      query: ({ headers }) => ({
        url: '/checkin',
        method: 'POST',
        headers,
      }),
      invalidatesTags: ['Users'],
    }),
    getTopThreeUsers: builder.query<IUser[], void>({
      query: () => ({
        url: '/top-three',
        method: 'GET',
      }),
    }),
    leaderBoard: builder.query<IPagination<IUser>, IPaginationRequest>({
      query: ({ page, limit }) => ({
        url: '/leaderboard',
        method: 'GET',
        params: {
          page,
          limit,
        },
      }),
    }),
  }),
});

export const {
  useLazyGetMeQuery,
  useUpdateUserMutation,
  useGetUserByUserNameOrWalletQuery,
  useGetMyGalleryQuery,
  useDailyCheckinMutation,
  useGetTopThreeUsersQuery,
  useLeaderBoardQuery,
  useLazyGetMyGalleryQuery,
} = userApi;
