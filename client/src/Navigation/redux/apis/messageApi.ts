import { createApi } from '@reduxjs/toolkit/query/react';
import { getBaseQuery } from '../fetch-auth-query';
import { IMessage, IRoom, MessageMode } from '../../../types/message.types';

export interface IAuthRequest {
  headers: any;
}

interface IGetMessageResponse {
  messages: IMessage[];
  total: number;
}

interface IGetMessageRequest extends IAuthRequest {
  companionid: string;
}

interface IGetMessageWhenSignOutRequest {
  companionid: string;
}

interface ISendMessageRequest extends IAuthRequest {
  companionid: string;
  message: string;
  mode: MessageMode;
}

interface IUnLockPicRequest extends IAuthRequest {
  messageId: string;
}

interface IRefreshRoomRequest extends IAuthRequest {
  roomId: string;
}

export const messageApi = createApi({
  reducerPath: 'messageApi',
  baseQuery: getBaseQuery({ baseUrl: '/rooms' }),
  tagTypes: ['Rooms', 'Messages'],
  endpoints: (builder) => ({
    getMessages: builder.query<IGetMessageResponse, IGetMessageRequest>({
      query: ({ companionid, headers }) => ({
        url: '/messages',
        method: 'GET',
        params: { companionid },
        headers,
      }),
    }),
    sendMessage: builder.mutation<IMessage, ISendMessageRequest>({
      query: ({ companionid, message, mode, headers }) => ({
        url: '/send-message',
        method: 'POST',
        headers,
        body: {
          companionid,
          message,
          mode,
        },
      }),
    }),
    getMessageWhenSignOut: builder.mutation<IMessage, IGetMessageWhenSignOutRequest>({
      query: ({ companionid }) => ({
        url: '/sign-out',
        method: 'POST',
        body: {
          companionid,
        },
      }),
      invalidatesTags: ['Rooms'],
    }),
    getChatRooms: builder.query<IRoom[], IAuthRequest>({
      query: ({ headers }) => ({
        url: `/me`,
        method: 'GET',
        headers,
      }),
      providesTags: ['Rooms'],
    }),
    unlockPic: builder.mutation<IMessage, IUnLockPicRequest>({
      query: ({ messageId, headers }) => ({
        url: `/messages/${messageId}/unlock/pic`,
        method: 'POST',
        headers,
      }),
    }),
    unlockVideo: builder.mutation<IMessage, IUnLockPicRequest>({
      query: ({ messageId, headers }) => ({
        url: `/messages/${messageId}/unlock/video`,
        method: 'POST',
        headers,
      }),
    }),
    refreshRoom: builder.mutation<IRoom, IRefreshRoomRequest>({
      query: ({ roomId, headers }) => ({
        url: `/${roomId}/refresh`,
        method: 'POST',
        headers,
      }),
      invalidatesTags: ['Rooms'],
    }),
    deleteRoom: builder.mutation<void, IRefreshRoomRequest>({
      query: ({ roomId, headers }) => ({
        url: `/${roomId}`,
        method: 'DELETE',
        headers,
      }),
      invalidatesTags: ['Rooms'],
    }),
  }),
});

export const {
  useLazyGetMessagesQuery,
  useSendMessageMutation,
  useGetMessageWhenSignOutMutation,
  useLazyGetChatRoomsQuery,
  useUnlockPicMutation,
  useUnlockVideoMutation,
  useRefreshRoomMutation,
  useDeleteRoomMutation,
  useGetChatRoomsQuery,
} = messageApi;
