import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NavIcon } from './utilities/NavIcon';

const Footer = (props: { isScrolling?: boolean }) => {
  const animationForFooter = {
    visible: {
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
    hidden: {
      y: 600,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  };

  const navigate = useNavigate();
  const isSelected = (path: string) => location.pathname === path;

  const activeStyle = 'flex justify-center cursor-pointer bg-main-gradient rounded-xl p-3';
  const inactiveStyle = 'flex justify-center cursor-pointer rounded-xl p-3';

  return (
    <motion.nav
      className="fixed md:hidden bottom-0 right-0 left-0 flex justify-between gap-2 px-5 py-10 items-center h-14 bg-primary-grey z-5"
      variants={animationForFooter}
      initial="visible"
      animate={props.isScrolling ? 'hidden' : 'visible'}
    >
      <button onClick={() => navigate('/')} className={isSelected('/') ? activeStyle : inactiveStyle}>
        <NavIcon type="home" filled={isSelected('/')} className="size-5" />
      </button>

      <button onClick={() => navigate('/explore')} className={isSelected('/explore') ? activeStyle : inactiveStyle}>
        <NavIcon type="explore" filled={isSelected('/explore')} className="size-5" />
      </button>

      <button
        onClick={() => navigate('/chat-inbox')}
        className={isSelected('/chat-inbox') ? activeStyle : inactiveStyle}
      >
        <NavIcon type="chat" filled={isSelected('/chat-inbox')} className="size-5" />
      </button>

      <button onClick={() => navigate('/leaderboard')} className={isSelected('/leaderboard') ? activeStyle : inactiveStyle}>
        <NavIcon type="leaderboard" filled={isSelected('/leaderboard')} className="size-5" />
      </button>

      <button onClick={() => navigate('/wallet')} className={isSelected('/wallet') ? activeStyle : inactiveStyle}>
        <NavIcon type="wallet" filled={isSelected('/wallet')} className="size-5" />
      </button>

      <button
        onClick={() => navigate('/my-profile')}
        className={isSelected('/my-profile') ? activeStyle : inactiveStyle}
      >
        <NavIcon type="profile" filled={isSelected('/my-profile')} className="size-5" />
      </button>
    </motion.nav>
  );
};

export default Footer;
