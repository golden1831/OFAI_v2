import { useNavigate } from 'react-router-dom';
import leftArrow from '../../assets/arrows/left.svg';
import { verifiedIcon } from '../../assets/icons';
import { pinkGemIcon } from '../../assets/icons/pink';
import { ICompanion } from '../../types/Companion.types';
import { getRoomLevelXP, getRoomLvl } from '../../types/message.types';
import { useSelector } from 'react-redux';
import { RootState } from '../../Navigation/redux/store/store';
import AddGemsPopup from '../../components/Navbar/AddGemsPopup';
import { useState } from 'react';

interface ChatNavProps {
  Model: ICompanion;
  userXP: number;
}

export default function ChatNav({ Model, userXP }: ChatNavProps) {
  const [showAddGemsPopup, setShowAddGemsPopup] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);

  const navigate = useNavigate();

  const { currLvl, nextLvl } = getRoomLevelXP(userXP)

  const barIndicatorLevel = ((userXP - currLvl) / (nextLvl - currLvl)) * 100;

  return (
    <>
      <div className="w-full fixed md:sticky top-0 max-h-[4rem] h-[4rem] mx-auto flex items-center justify-between backdrop-blur-sm bg-black/40 bg-blend-overlay gap-2 z-10">
        <div className="flex justify-between items-center size-full px-4">
          <div className="flex-1">
            <img 
              src={leftArrow} 
              onClick={() => navigate(`/chat-inbox`)} 
              className="size-3.5 cursor-pointer" 
            />
          </div>

          <div className="flex gap-2 justify-center items-center">
            <div
              style={{ backgroundImage: `url(${Model?.image.url})` }}
              onClick={() => navigate(`/${Model.username}`)}
              className="size-10 rounded-full bg-cover bg-no-repeat border-2 border-primary-500 cursor-pointer"
            />

            <div className="flex flex-col">
              <h2 className="text-2xl flex items-center text-white font-semibold leading-tight drop-shadow md:text-2xl md:font-bold">
                {Model?.firstName}
                <img className="ml-1 w-5" src={verifiedIcon} />
              </h2>

              <div className="flex items-center gap-2 relative">
                <p className="text-sm font-medium">Lvl {getRoomLvl(userXP)}</p>

                <span className="h-1.5 w-32 rounded-lg bg-white/10">
                  <span 
                    style={{ width: `${barIndicatorLevel > 0 ? barIndicatorLevel : 0}%` }} 
                    className="h-full rounded-lg bg-primary-500 flex transition-all duration-300 ease-in-out"
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-end">
            {user && (
              <button 
                type="button"
                onClick={() => setShowAddGemsPopup(true)}
                className="flex items-center p-2 gap-1 rounded-xl bg-white/5"
              >
                <img src={pinkGemIcon} className="flex" />

                <p className="text-sm font-medium">{user.gem}</p>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <AddGemsPopup show={showAddGemsPopup} onClose={setShowAddGemsPopup} />
    </>
  );
}
