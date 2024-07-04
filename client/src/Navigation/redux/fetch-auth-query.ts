import { FetchBaseQueryArgs } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export const getBaseQuery = (args: FetchBaseQueryArgs) =>
  fetchBaseQuery({
    ...args,
    baseUrl: args.baseUrl ? `${import.meta.env.VITE_API_URL}${args.baseUrl}` : `${import.meta.env.VITE_API_URL}`,
  });
