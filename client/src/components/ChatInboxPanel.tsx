import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MouseEvent, useState } from 'react';
import { setModel } from '../Navigation/redux/slice/ModelSlice';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { IRoom, MessageType } from '../types/message.types';
import { refreshIcon, trashIcon } from '../assets/icons';
import { ICompanion } from '../types/Companion.types';
import { useDeleteRoomMutation, useRefreshRoomMutation } from '../Navigation/redux/apis/messageApi';
import { toast } from 'react-toastify';
import { useWeb3Auth } from '../providers/Wallet';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import StyledText from '../pages/ChatPage/messages/StyledText';

interface ChatInboxPanelProps {
  chats: IRoom[];
}

const ChatInboxPanel = ({ chats = [] }: ChatInboxPanelProps) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { headers } = useWeb3Auth();

  const [deleteRoomMutation] = useDeleteRoomMutation();
  const [refreshRoomMutation] = useRefreshRoomMutation();

  const isChatInBox = location.pathname.includes('/chat-inbox');

  async function handleDeleteRoom(e: MouseEvent<HTMLButtonElement>, roomId: string) {
    e.stopPropagation();

    setIsLoading(roomId);

    await deleteRoomMutation({
      roomId,
      headers,
    })
      .unwrap()
      .then(() => {
        toast.success('Room deleted successfully');

        if (!isChatInBox) window.location.reload();
      })
      .catch((err) => {
        const error = err as FetchBaseQueryError & {
          data: {
            message: string;
          };
        };

        toast.error(error.data?.message ?? 'Something went wrong');
      })
      .finally(() => setIsLoading(null));
  }

  async function handleRefreshRoom(e: MouseEvent<HTMLButtonElement>, roomId: string) {
    e.stopPropagation();

    setIsLoading(roomId);

    await refreshRoomMutation({
      roomId,
      headers,
    })
      .unwrap()
      .then(() => {
        toast.success('Room refreshed successfully');

        if (!isChatInBox) window.location.reload();
      })
      .catch((err) => {
        const error = err as FetchBaseQueryError & {
          data: {
            message: string;
          };
        };

        toast.error(error.data?.message ?? 'Something went wrong');
      })
      .finally(() => setIsLoading(null));
  }

  return (
    <div className="mt-4">
      <div className="flex justify-center">
        {chats.length !== 0 && (
          <div className="flex flex-col mx-5 gap-3 w-full max-w-lg items-center">
            <h1 className="pl-4 text-2xl font-semibold mr-auto">Conversations</h1>
            
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => {
                  dispatch(setModel(chat.companion as ICompanion));
                  navigate(`/chat/${chat.companion?.username}`);
                }}
                className={twMerge(
                  clsx(
                    'bg-white/5 w-full p-4 flex items-center justify-between gap-5 rounded-3xl cursor-pointer border border-transparent',
                    location.pathname === `/chat/${chat.companion?.username}` && 'border-primary-500'
                  )
                )}
              >
                <div className="w-full relative flex flex-row items-center gap-4">
                  <div
                    className="border-2 size-14 rounded-full bg-cover bg-no-repeat border-primary-500"
                    style={{
                      backgroundImage: `url(${chat.companion?.image.url})`,
                    }}
                  />
                  <div className="w-10 flex-grow">
                    <h3 className="text-white text-xl font-semibold truncate">{chat.companion?.firstName}</h3>

                    {chat.messages && chat.messages.length > 0 && (
                      <div className="flex text-sm overflow-hidden overflow-ellipsis truncate">
                        {chat.messages[0].type === MessageType.message && (
                          <StyledText text={`${chat.messages[0].message?.slice(0, 30)}...`} />
                        )}

                        {chat.messages[0].type === MessageType.audio && 'Audio'}

                        {chat.messages[0].type === MessageType.picture && 'Image'}

                        {chat.messages[0].type === MessageType.video && 'Video'}

                        <span>
                          <p className="text-sm mx-1">• {timeSince(chat.messages?.[0]?.createdAt)}</p>
                        </span>
                      </div>
                    )}
                  </div>

                  {isLoading === chat._id && <div className="spinner !size-4" />}

                  {isLoading !== chat._id && (
                    <div className="flex flex-col items-center gap-4">
                      <button type="button" onClick={(e) => handleRefreshRoom(e, chat._id)}>
                        <img src={refreshIcon} alt="" className="size-4" />
                      </button>

                      <button type="button" onClick={(e) => handleDeleteRoom(e, chat._id)}>
                        <img src={trashIcon} alt="" className="size-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const timeSince = (dateString?: number) => {
  if (!dateString) return '';

  const now = new Date();
  const pastDate = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30); // Approximation, assumes 30 days per month

  if (diffInMonths > 0) {
    return `${diffInMonths}m`;
  } else if (diffInDays > 0) {
    return `${diffInDays}d`;
  } else if (diffInHours > 0) {
    return `${diffInHours}h`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes}m`;
  } else if (diffInSeconds > 0) {
    return `${diffInSeconds}s`;
  } else {
    return '';
  }
};

export default ChatInboxPanel;
