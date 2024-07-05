import { FormEvent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Form from './form';
import Messages from './messages';
import ChatNav from './ChatNav';
import { useWeb3Auth } from '../../providers/Wallet';
import { ButtonPrimary } from '../../components/utilities/PrimaryButton';
import { Gift } from './Gift';
import ChatInboxPage from '../ChatInboxPage';
import Popup from '../../components/utilities/PopUp';
import {
  useGetMessageWhenSignOutMutation,
  useLazyGetChatRoomsQuery,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
} from '../../Navigation/redux/apis/messageApi';
import { MessageMode, MessageType, RoleType, getRoomLvl } from '../../types/message.types';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { pinkCircleCheckIcon } from '../../assets/icons/pink';
import { Helmet } from 'react-helmet-async';
import { RootState } from '../../Navigation/redux/store/store';
import { useGetCompanionsByUsernameQuery } from '../../Navigation/redux/apis/companionApi';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { IMessageChat } from './types';
import CallScreen from './CallScreen';

const ChatPage = () => {
  const [mode, setMode] = useState<MessageMode>(MessageMode.text);
  const [userXP, setUserXP] = useState(0);
  const [messages, setMessages] = useState<IMessageChat[]>([]);
  const [isloading, setIsLoading] = useState(true);
  const [showGiftUI, setShowGiftUI] = useState(false);
  const [isResponding, setisResponding] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [togglePicOptions, setTogglePicOptions] = useState(false);
  const [messageIdReceveid, setMessageIdReceived] = useState<string | null>(null);
  const [isCalling, setIsCalling] = useState(false); // State to manage call screen visibility

  const bottomRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: RootState) => state.user?.user);
  const authStatus = useSelector((state: RootState) => state.auth.authStatus);

  const { connect, headers } = useWeb3Auth();

  const { id: username } = useParams();

  const { data: model } = useGetCompanionsByUsernameQuery(
    {
      username: username as string,
    },
    {
      skip: !username,
    }
  );

  const [getMessages] = useLazyGetMessagesQuery();
  const [getChatRooms] = useLazyGetChatRoomsQuery();

  const [sendMessageMutation] = useSendMessageMutation();
  const [getMessageWhenSignOut] = useGetMessageWhenSignOutMutation();

  useEffect(() => {
    if (messages.length > 0) {
      const filterUserMessages = messages.filter((message) => message.role === RoleType.user);

      setUserXP(filterUserMessages.length * 10);
    }
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!model || !headers) throw new Error('No auth headers found');

    try {
      const res = await sendMessageMutation({
        mode,
        headers,
        message,
        companionid: model._id,
      }).unwrap();

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const {
        _id,
        createdAt,
        ...rest
      } = res

      const data = {
        ...rest,
        id: _id,
        createdAt: new Date(createdAt).toISOString(),
      }

      setMessages((prev) => [...prev, data]);

      setMessageIdReceived(res._id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setisResponding(false);
    }
  };

  const onSubmit = async (e?: FormEvent<Element>, textMessage?: string) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!authStatus) {
      await connect();
      
      return;
    }

    if (!textMessage && (!messageContent || messageContent.trim() === '')) return;

    setisResponding(true);

    const value = textMessage || messageContent;

    setMessageContent('');

    const message: IMessageChat = {
      id: (messages.length + 1).toString(),
      role: RoleType.user,
      type: mode === 'text' ? MessageType.message : MessageType.audio,
      user: {
        name: user.name ?? user.walletAddress,
        username: user.username,
      },
      message: value,
      createdAt: new Date().toISOString(),
      companion: model,
      senderName: user.name ?? user.walletAddress,
      companionId: model!._id,
    };

    const nextUserLevel = getRoomLvl(userXP + 10);
    const previousUserLevel = getRoomLvl(userXP);

    setMessages((prev) => [...prev, message]);

    if (nextUserLevel > previousUserLevel) {
      const Feedback = () => (
        <div className="flex flex-col gap-0.5">
          <h6 className="text-base font-semibold text-white">Congratulations 🎉 {user.name?.split(' ')[0]}</h6>
          <p className="text-sm text-white">{`You have reached level ${nextUserLevel}`}</p>
        </div>
      );

      toast.success(<Feedback />, {
        icon: <img src={pinkCircleCheckIcon} alt="" className="size-6" />,
        position: 'top-right',
        className: 'rounded-3xl bg-white/5 backdrop-blur-lg',
        closeButton: false,
        progressClassName: 'bg-primary-500',
      });
    }

    setTimeout(async () => {
      await sendMessage(value);

      setTogglePicOptions(false);
    }, 1000);
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        if (bottomRef.current) {
          bottomRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',
          });
        }
      }
    }, options);

    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (headers && model && authStatus) {
      const getCompanionMessages = async () => {
        try {
          const { data } = await getMessages({
            headers,
            companionid: model._id,
          });
    
          if (data) {
            if (data.total === 0) {
              setisResponding(true);
    
              await sendMessage('getSalutation');
    
              await getChatRooms({ headers })
    
              setMessageContent('');
            }
    
            setMessages((prevMessages) => [
              ...data.messages.map((message) => ({
                ...message,
                id: message._id,
                createdAt: new Date(message.createdAt).toISOString(),
              })),
              ...prevMessages,
            ]);
          }
    
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      };

      getCompanionMessages();
    }
  }, [headers, model, authStatus]);

  useEffect(() => {
    async function getSignedOutSalutation() {
      setisResponding(true);

      if (!model) return;

      const data = await getMessageWhenSignOut({
        companionid: model._id,
      }).unwrap();

      setIsLoading(false);
      setisResponding(false);

      if (data) {
        const totalMessageLength = 0;

        const {
          _id,
          ...rest
        } = data

        setMessages([
          {
            ...rest,
            id: _id,
            createdAt: new Date().toISOString(),
          },
        ]);

        setMessageIdReceived(data._id);

        setTimeout(() => setisResponding(false), 100 * totalMessageLength);
      }
    }

    if (!authStatus) setTimeout(() => getSignedOutSalutation(), 1000);
    if (authStatus) setMessages([]);
  }, [model, authStatus, getMessageWhenSignOut]);

  useEffect(() => {
    if (!authStatus && messageContent !== '') setShowSignInPopup(true);
  }, [authStatus, messageContent]);

  if (!model) {
    return (
      <div className="w-full h-svh flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  console.log({ showSignInPopup })

  return (
    <div className="size-full overflow-hidden flex justify-center items-center">
      <Helmet>
        <meta property="og:image" content={model.image.url} />
        <meta property="og:description" content={model.shortBio} />
      </Helmet>
  
      {isCalling && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            zIndex: 1002,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CallScreen profileImage={model.image.url} profileName={model.firstName} modelId={model._id} setIsCalling={setIsCalling} />
        </div>
      )}
  
      <div className="size-full flex justify-between items-center">
        <div
          style={{
            backgroundImage: `url(${model?.image.url || ''})`,
            filter: isCalling ? 'blur(5px)' : 'none',
          }}
          className="fixed top-0 w-full h-dvh bg-cover bg-top bg-no-repeat flex-col gap-2 overflow-hidden sm:gap-4 md:h-full md:relative"
        >
          <ChatNav Model={model} userXP={userXP} />
  
          <Messages
            mode={mode}
            user={user}
            model={model}
            messages={messages}
            setMessages={setMessages}
            isResponding={isResponding}
            togglePicOptions={togglePicOptions}
            messageIdReceveid={messageIdReceveid}
          />
  
          <Form
            mode={mode}
            setMode={setMode}
            onSubmit={onSubmit}
            isloading={isloading}
            isResponding={isResponding}
            messageContent={messageContent}
            togglePicOptions={togglePicOptions}
            setMessageContent={setMessageContent}
            setTogglePicOptions={setTogglePicOptions}
            setIsCalling={setIsCalling}
          />
  
          {showGiftUI && (
            <Gift
              modelImage={model.image.url}
              setShowGiftUI={setShowGiftUI}
              modelFirstName={model.firstName}
            />
          )}
        </div>
  
        <div
          className="w-1/2 h-full hidden md:flex"
          style={{
            zIndex: 1,
            filter: isCalling ? 'blur(5px)' : 'none',
          }}
        >
          <ChatInboxPage />
        </div>
      </div>
  
      <Popup imageUrl={model.image.url} show={showSignInPopup} close={() => setShowSignInPopup(false)}>
        <h1 className="font-bold text-2xl text-center">Sign-up and get 500 GEMS for free!</h1>
  
        <p className="text-center">You'll get 10 free messages & 10 GEMS each day you check-in 😉</p>
  
        <ButtonPrimary
          onClick={async () => {
            setShowSignInPopup(false);
            await connect();
          }}
        >
          Sign-in
        </ButtonPrimary>
      </Popup>
    </div>
  );
  
  
};

export default ChatPage;
