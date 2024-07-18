import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IAuthRequest {
  headers: any;
}

interface ICreateStreamRequest extends IAuthRequest {
  imgUrl: string;
}

interface ICreateStreamResponse {
  id: string;
  session_id: string;
  offer: RTCSessionDescriptionInit;
  ice_servers: RTCIceServer[];
}

interface ISendICECandidateRequest extends IAuthRequest {
  candidate: RTCIceCandidateInit;
  sessionId: string;
  streamId: string;
}

interface ISendSDPAnswerRequest extends IAuthRequest {
  answer: RTCSessionDescriptionInit;
  sessionId: string;
  streamId: string;
}

interface IStartStreamRequest extends IAuthRequest {
  streamId: string;
  sessionId: string;
  audioUrl: string;
}

interface IStartStreamResponse {
  status: string;
  result_url: string;
}

const base64ApiKey = import.meta.env.VITE_D_ID_API_KEY;
console.log(base64ApiKey)
export const videoApi = createApi({
  reducerPath: 'videoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.d-id.com/talks/streams',
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Basic ${base64ApiKey}`);
      headers.set('Content-Type', 'application/json');
      // headers.set("Access-Control-Allow-Origin", "*");
      return headers;
    },
    mode: 'cors',
  }),
  tagTypes: ['Streams'],
  endpoints: (builder) => ({
    createStream: builder.mutation<ICreateStreamResponse, ICreateStreamRequest>({
      query: ({ imgUrl }) => ({
        url: '/',
        method: 'POST',
        body: {
          source_url: imgUrl,
        },
      }),
    }),
    sendICECandidate: builder.mutation<void, ISendICECandidateRequest>({
      query: ({ candidate, sessionId, streamId }) => ({
        url: `/${streamId}/ice`,
        method: 'POST',
        body: {
          candidate,
          session_id: sessionId,
        },
      }),
    }),
    sendSDPAnswer: builder.mutation<void, ISendSDPAnswerRequest>({
      query: ({ answer, sessionId, streamId }) => ({
        url: `/${streamId}/sdp`,
        method: 'POST',
        body: {
          answer,
          session_id: sessionId,
        },
      }),
    }),
    startStream: builder.mutation<IStartStreamResponse, IStartStreamRequest>({
      query: ({ streamId, sessionId, audioUrl }) => ({
        url: `/${streamId}`,
        method: 'POST',
        body: {
          script: {
            type: 'audio',
            audio_url: audioUrl,
          },
          session_id: sessionId,
          config: {
            stitch: true,
          },
        },
      }),
      invalidatesTags: ['Streams'],
    }),
  }),
});

export const {
  useCreateStreamMutation,
  useSendICECandidateMutation,
  useSendSDPAnswerMutation,
  useStartStreamMutation,
} = videoApi;
