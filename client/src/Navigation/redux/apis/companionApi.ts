import { createApi } from '@reduxjs/toolkit/query/react';
import { getBaseQuery } from '../fetch-auth-query';
import { ICompanion } from '../../../types/Companion.types';

export const companionApi = createApi({
  reducerPath: 'companionApi',
  baseQuery: getBaseQuery({ baseUrl: '/companions' }),
  endpoints: (builder) => ({
    getCompanions: builder.query<ICompanion[], void>({
      query: () => ({
        url: '',
        method: 'GET',
      }),
    }),
    getCompanionsById: builder.query<ICompanion, { id: string }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: 'GET',
      }),
    }),
    getCompanionsByUsername: builder.query<ICompanion, { username: string }>({
      query: ({ username }) => ({
        url: `/username/${username}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetCompanionsByIdQuery, useGetCompanionsQuery, useGetCompanionsByUsernameQuery } = companionApi;
