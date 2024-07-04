import { Routes, Route } from 'react-router-dom';
import ProfilePage from '../pages/ProfilePage';
import FeedPage from '../pages/FeedPage';
import ChatPage from '../pages/ChatPage';
import ChatInboxPage from '../pages/ChatInboxPage';
import HomePage from '../pages/HomePage';
import UserProfile from '../pages/UserProfile';
import UserEditProfile from '../pages/UserProfile/EditProfile';
import { ComingSoon } from '../components/ComingSoon';
import WalletPage from '../pages/WalletPage';
import LeaderboardPage from '../pages/LeaderboardPage';

const Navigation = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="wallet" element={<WalletPage />} />

        <Route path="explore" element={<FeedPage />} />

        <Route path="chat/:id" element={<ChatPage />} />

        <Route path="chat-inbox" element={<ChatInboxPage />} />

        <Route path="my-profile">
          <Route path="" element={<UserProfile />} />
          <Route path="edit" element={<UserEditProfile />} />
        </Route>

        <Route path="leaderboard" element={<LeaderboardPage />} />

        <Route path=":id" element={<ProfilePage />} />
      </Routes>

      <ComingSoon />
    </>
  );
};

export default Navigation;
