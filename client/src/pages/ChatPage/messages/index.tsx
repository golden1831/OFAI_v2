import AudioMessage from './AudioMessage';
import { MessageCard, type SelectedMedia } from './MessageCard';
import { useRef, useEffect, useMemo, Dispatch, SetStateAction, useState } from 'react';
import Typing from './Typing';
import Recording from './Recording';
import { removeDuplicates } from '../../../lib/utils';
import { IUser } from '../../../types/user.types';
import { ICompanion } from '../../../types/Companion.types';
import Popup from '../../../components/utilities/PopUp';
import { IMessageChat } from '../types';
import { MessageMode, MessageType, RoleType } from '../../../types/message.types';
import { useNavigate } from 'react-router-dom';

interface MessagesProps {
  mode: MessageMode;
  user: IUser;
  model: ICompanion;
  messages: IMessageChat[];
  setMessages: Dispatch<SetStateAction<IMessageChat[]>>;
  isResponding: boolean;
  togglePicOptions: boolean;
  messageIdReceveid: string | null;
}

export default function Messages({
  mode,
  user,
  model,
  messages,
  setMessages,
  isResponding,
  togglePicOptions,
  messageIdReceveid,
}: MessagesProps) {
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(null);

  const navigate = useNavigate();

  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const getMessages = topRef.current?.querySelectorAll(".card-message");

      if (getMessages) {
        const messages = Array.from(getMessages) as HTMLElement[];

        messages.forEach((message) => {
          const { top, height, bottom } = message.getBoundingClientRect();
          
          const isVideoOrPicture = message.classList.contains("is-video") || message.classList.contains("is-picture");

          const visibleHeight = isVideoOrPicture
            ? Math.max(0, Math.min(bottom, 120) - Math.max(top, -120))
            : Math.max(0, Math.min(bottom, 240) - Math.max(top, -120));

          const opacity = 1 - (visibleHeight / (height / 2));
          
          message.style.opacity = opacity.toString();
        });
      }
    };

    const element = topRef.current

    element?.addEventListener("scroll", onScroll);

    return () => {
      element?.removeEventListener("scroll", onScroll);
    };
  }, [])

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [messages, isResponding]);

  const processedMessages = useMemo(() => {
    messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const uniqueMessages = removeDuplicates(messages);

    return uniqueMessages;
  }, [messages]);

  return (
    <div
      ref={topRef}
      className="w-full mt-16 relative md:mt-0 flex-1 flex flex-col gap-1 overflow-y-auto px-3 py-2 h-[calc(100%-194px)]"
    >
      {processedMessages.map((message) => {
        const senderName = model?.firstName as string;
        const senderImage = model?.image.url as string;

        return (
          <div key={message.id} className={`card-message is-${message.type}`}>
            {message.role === RoleType.assistant && (
              <div className="mb-1 gap-2 justify-start items-center flex">
                <div
                  style={{
                    backgroundImage: `url(${senderImage || ""})`,
                  }}
                  onClick={() => navigate(`/${senderName}`)}
                  className="border border-primary-500 size-8 rounded-full bg-cover bg-no-repeat bg-top cursor-pointer opacity-0 fadesIn"
                />
                <div className="h-8 font-medium flex justify-center items-center rounded-3xl backdrop-blur-lg bg-[#56265066] p-3 opacity-0 fadesIn">
                  {senderName}
                </div>
              </div>
            )}
            
            {message.type === MessageType.audio && message.voicecontenturl ? (
              <AudioMessage
                soundPath={message.voicecontenturl}
                createdAt={message.createdAt}
              />
            ) : (
              <MessageCard
                userId={user._id}
                message={message}
                setMessages={setMessages}
                onSelectedMedia={setSelectedMedia}
                messageIdReceveid={messageIdReceveid}
              />
            )}
          </div>
        )
      })}

      {isResponding && (
        <div className="pb-6 flex flex-row items-center justify-start">
          <div className="flex items-center justify-center rounded-full bg-gradient-to-b from-primary-500">
            <div
              style={{
                backgroundImage: `url(${model.image.url || ''})`,
              }}
              className="border size-8 rounded-full bg-cover bg-no-repeat bg-top border-primary-500"
            />
          </div>

          {mode === MessageMode.text && (
            <div className="-ml-2.5 relative top-[-5px]">
              <Typing name={model.firstName} takingPicture={togglePicOptions} />
            </div>
          )}

          {mode !== MessageMode.text && (
            <div className="-ml-2.5 relative top-[-5px]">
              <Recording name={model.firstName} />
            </div>
          )}
        </div>
      )}

      <div ref={bottomRef} />

      <Popup
        show={!!selectedMedia}
        close={() => setSelectedMedia(null)}
        className="[&>div]:p-0 [&>div]:size-full max-w-6xl !w-full !h-[80vh] mx-6 bg-transparent"
      >
        {selectedMedia?.type === "image" && (
          <img src={selectedMedia?.media} alt="" className="size-full rounded-3xl object-contain" />
        )}

        {selectedMedia?.type === "video" && (
          <video controls className="rounded-3xl object-contain size-full">
            <source src={selectedMedia?.media} type="video/mp4" />
          </video>
        )}
      </Popup>
    </div>
  );
}