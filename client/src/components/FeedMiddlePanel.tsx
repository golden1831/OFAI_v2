import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModel } from '../Navigation/redux/slice/ModelSlice';
import CountryFlag from 'react-country-flag';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProfileImage } from './utilities/ProfileImage';
import { plusIcon, verifiedIcon } from '../assets/icons';
import upIcon from '../assets/arrows/up.svg';
import { ButtonPrimary } from './utilities/PrimaryButton';
import { pinkGemIcon } from '../assets/icons/pink';
import { RootState } from '../Navigation/redux/store/store';

function FeedMiddlePanel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const Models = useSelector((state: RootState) => state.models.Models);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUpClick = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + Models.length) % Models.length);
  };

  const handleDownClick = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % Models.length);
  };

  return (
    <>
      <div className="relative h-full flex max-w-[600px] justify-center">
        <div className="h-screen">
          <>
            {Models.map((Model) => (
              <motion.div
                className="w-full snap-start relative object-cover transition-transform ease-out duration-500"
                style={{
                  transform: `translateY(calc(-100vh * ${currentSlide}))`,
                }}
                key={Model._id}
              >
                <img
                  loading="lazy"
                  src={Model.image.url}
                  alt="model"
                  className="w-full h-screen object-cover border-white snap-start"
                />
              </motion.div>
            ))}
          </>
        </div>
      </div>
      <div className="hidden md:flex flex-col gap-[10px] w-[400px] h-full pt-20 pr-2  ml-4">
        <ProfileImage
          src={Models[currentSlide]?.image.url}
          className="size-24"
          onClick={() => navigate(`/${Models[currentSlide]?.username}`)}
        >
          <img src={plusIcon} className="absolute w-8 ml-[3.7rem] mt-[3.7rem]" />
        </ProfileImage>
        <div className="flex flex-col gap-[10px]">
          <h2 className="text-3xl text-white font-bold leading-tight drop-shadow">
            {Models[currentSlide]?.firstName}{' '}
            <span className="inline-flex gap-2 items-center">
              <img className="inline" src={verifiedIcon} />
            </span>
          </h2>
          <h3 className="drop-shadow font-medium text-xl">
            {Models[currentSlide]?.age} |
            <CountryFlag
              className="ml-1 pt-[2px]"
              countryCode={Models[currentSlide]?.country}
              style={{
                width: '1.5em',
                height: '1.5em',
              }}
            />
          </h3>
          <p className="mt-0.5 text-md drop-shadow font-medium pr-4">{Models[currentSlide]?.shortBio}</p>
        </div>
        <div className="pt-4 flex gap-2 flex-col xl:items-center xl:flex-row">
          <ButtonPrimary
            onClick={() => {
              navigate(`/chat/${Models[currentSlide]?.username}`), dispatch(setModel(Models[currentSlide]));
            }}
            className="w-full xl:w-fit"
          >
            Chat Now
          </ButtonPrimary>

          <button
            className="py-2 px-4 flex items-center gap-1 justify-center rounded-lg text-lg font-medium border-2 border-solid border-primary-500"
            onClick={() => navigate('/wallet')}
          >
            Subscribe
            <img src={pinkGemIcon} alt="" className="size-5" />
            200
          </button>
        </div>
        <div className="flex flex-col gap-4 mt-8 ">
          <img src={upIcon} className="size-16 cursor-pointer" onClick={handleUpClick} />
          <img src={upIcon} className="size-16 rotate-180 cursor-pointer" onClick={handleDownClick} />
        </div>
      </div>
    </>
  );
}
export default FeedMiddlePanel;
