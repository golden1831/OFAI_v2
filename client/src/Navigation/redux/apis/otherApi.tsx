import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface IGetTranscriptRequest {
  audioBlob: Blob;
  headers?: any;
}

interface IGetTranscriptResponse {
  results: {
    channels: Array<{
      alternatives: Array<{
        transcript: string;
      }>;
    }>;
  };
}

export const deepgramAPI = createApi({
  reducerPath: 'deepgramAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.deepgram.com/v1' }),
  endpoints: (builder) => ({
    getTranscript: builder.mutation<IGetTranscriptResponse, IGetTranscriptRequest>({
      query: ({ audioBlob }) => {
        const formData = new FormData();
        formData.append('file', audioBlob);

        return {
          url: '/listen',
          method: 'POST',
          headers: {
            Authorization: `Token ${import.meta.env.VITE_DEEPGRAM_API_KEY}`,
          },
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useGetTranscriptMutation,
} = deepgramAPI;
