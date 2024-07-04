import Footer from '../components/Footer';
import { useSelector } from 'react-redux';
import MiddleChatInboxPanel from '../components/ChatInboxPanel';
import { ButtonPrimary } from '../components/utilities/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import circleLogoIcon from '../assets/images/circle-logo.svg';
import { useGetChatRoomsQuery } from '../Navigation/redux/apis/messageApi';
import { useWeb3Auth } from '../providers/Wallet';
import { RootState } from '../Navigation/redux/store/store';

const ChatInboxPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const authStatus = useSelector((state: RootState) => state.auth.authStatus);
  
  const navigate = useNavigate();
  const { headers } = useWeb3Auth();

  const { data: chats } = useGetChatRoomsQuery({
    headers
  }, {
    skip: !authStatus || !user || !headers
  });

  const orderedChats = chats && chats.length > 0
    ? chats
      .map((chat) => ({
        ...chat,
        messages: chat.messages ?? [],
      }))
      .sort((a, b) => (b?.messages?.[0]?.createdAt ?? 0) - (a?.messages?.[0]?.createdAt ?? 0))
    : [];

    if (!chats) {
      return (
        <div className="size-full flex justify-center items-center">
          <LoadingSpinner />
        </div>
      );
    }

  if (chats.length <= 0) {
    return (
      <div
        style={{ height: `calc(100vh - 80px - 56px)` }}
        className="flex justify-center items-center flex-col gap-4 w-full"
      >
        <img src={circleLogoIcon} className="size-12" />

        <h2 className="text-xl font-semibold">No Chats Yet!</h2>

        <ButtonPrimary className="w-40" onClick={() => navigate('/explore')}>
          Explore Models
        </ButtonPrimary>

        <Footer />
      </div>
    )
  }

  return (
    <div className="size-full relative overflow-y-auto">
      <MiddleChatInboxPanel chats={orderedChats} />

      <Footer />
    </div>
  );
};

export default ChatInboxPage;
