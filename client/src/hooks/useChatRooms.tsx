import { create } from 'zustand';
import { chatRoomType } from '../lib/types';

interface ChatRoomsState {
   chatRooms: chatRoomType[];
   setChatRooms: (chatRooms: chatRoomType[]) => void;
}

export const useChatRooms = create<ChatRoomsState>((set) => ({
   chatRooms: [],
   setChatRooms: (chatRooms) => set({ chatRooms }),
}));