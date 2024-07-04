import { useRef, useEffect, useCallback } from 'react';
import { useWavesurfer } from '@wavesurfer/react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { setModels } from '../Navigation/redux/slice/ModelsSlice';
import { setModel } from '../Navigation/redux/slice/ModelSlice';
import api from '../axios';
import { motion } from 'framer-motion';
import Vivaldi from '../assets/vivaldi_four_seasons.mp3';
import { pauseIcon, playIcon, verifiedIcon } from '../assets/icons';
import { LoadingSpinner } from '../components/LoadingSpinner';
import arrowLeftIcon from '../assets/arrows/left.svg';
import { ICompanion } from '../types/Companion.types';
import { pinkGemIcon } from '../assets/icons/pink';
import { Helmet } from 'react-helmet-async';
import { formattedTraits } from '../lib/traits';

function ProfilePage() {
  const ParentRef = useRef(null);
  const BoxRef = useRef(null);
  const navigate = useNavigate();
  const Model = useSelector((state: any) => state.model.Model as ICompanion);
  const Models = useSelector((state: any) => state.models.Models as ICompanion[]);
  const dispatch = useDispatch();

  const { id: Name } = useParams();

  const fetchModels = async () => {
    try {
      const res = await api.get(`${import.meta.env.VITE_API_URL}/companions?page=1&limit=10`);

      dispatch(setModels(res.data));
      dispatch(setModel(res.data[res.data.findIndex((model: any) => model.username === Name)]));
    } catch (error) {
      console.log(error);
    }
  };

  const containerRef = useRef<HTMLDivElement | null>(null);

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
    waveColor: 'white',
    progressColor: '#d3d3d3',
    cursorWidth: 0,
    width: 140,
    barWidth: 3.5,
    barHeight: 0.4,
    barRadius: 3,
    barGap: 3.7,
    // url: Model?.voiceSampleUrl, // ! Model simple url
    url: Vivaldi, //! Test url
  });

  const onPlayPause = useCallback(() => {}, [wavesurfer]);

  const animationVariants = {
    hidden: {
      opacity: 0,
      y: 75,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const ScrollToView = () => {
    (BoxRef.current as HTMLDivElement | null)?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    fetchModels();
    (ParentRef.current as HTMLDivElement | null)?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [Name]);

  return (
    <div className="w-full h-full" ref={BoxRef}>
      <Helmet>
        <meta property="og:image" content={Model?.image.url} />
        <meta property="og:description" content={Model?.shortBio} />
      </Helmet>
      
      <div className="md:hidden">
        <img
          className="fixed top-5 left-5 text-white cursor-pointer z-10"
          src={arrowLeftIcon}
          onClick={() => window.history.back()}
        />
      </div>
      {Models && Model?.username === Name ? (
        <>
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center md:w-[768px] h-full">
              <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
              >
                <div className="flex flex-col justify-center items-center relative aspect-square bg-neutral-2">
                  <div className="relative w-full h-full">
                    <img src={Model.image.url} alt="Model Image" className="object-cover object-top w-full h-full" />
                    <div className="absolute -bottom-1 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-[#131313] pointer-events-none"></div>
                  </div>

                  <div className="flex flex-col justify-center px-5 w-full -translate-y-32 md:-translate-y-64 mt-16">
                    <div className="relative flex items-center w-full gap-2">
                      <div
                        onClick={onPlayPause}
                      >
                        {<img src={!isPlaying ? playIcon : pauseIcon} className="h-8" />}
                      </div>

                      <div className="flex aspect-[212/26] max-w-[290px] transition-opacity duration-200 group-hover:opacity-85">
                        <div
                          className="flex py-1 aspect-[212/26] relative bottom-[60px]  max-w-1/2 w-1/3 transition-opacity duration-200 group-hover:opacity-85"
                          ref={containerRef}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <h1 className="text-3xl text-white relative font-bold">
                        {Model?.firstName}, <span className="inline font-light">{Model?.age}</span>
                      </h1>
                      <img className="inline" src={verifiedIcon} />
                    </div>
                    <p className="mt-2 font-light text-white xs:min-w-[23rem]">{Model?.shortBio}</p>

                    <div className="flex items-center gap-2 my-4">
                      {Model.traits.map((trait) => (
                        <p 
                          key={trait} 
                          className="p-0.5 px-3 text-sm rounded-full bg-white/5 border border-solid border-white/10 text-white"
                        >
                          {formattedTraits.find((item) => item.value === trait)?.label}
                        </p>
                      ))}
                    </div>

                    <div className="hidden py-5 w-full md:flex flex-col items-center">
                      <button
                        className="bg-main-gradient w-full py-2 rounded-lg text-lg font-medium"
                        onClick={() => navigate(`/chat/${Model?.username}`)}
                      >
                        Chat now
                      </button>

                      <button
                        className="w-full py-2 mt-2 flex items-center gap-1 justify-center rounded-lg text-lg font-medium border-2 border-solid border-primary-500"
                        onClick={() => navigate("/wallet")}
                      >
                        Subscribe 
                        <img src={pinkGemIcon} alt="" className="size-5" />
                        200
                      </button>
                    </div>
                    <div className="w-full mt-8">
                      <p className="ml-4 text-lg font-medium text-gray-400">Bio</p>
                      <p className="mt-2 text-[15px] text-white tracking-[0.005em] bg-white/10 p-4 rounded-lg">
                        {Model?.longBio}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              <div className="mb-16 -translate-y-20 md:-translate-y-44 w-full">
                <motion.div variants={animationVariants} initial="hidden" animate="visible" className="w-full px-6">
                  <h1 className="flex font-semibold text-3xl justify-center text-white whitespace-nowrap mb-4 ">
                    You may also like
                  </h1>
                  <div className="w-full flex flex-1 items-center ">
                    {Models ? (
                      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2.5 lg:gap-3.5 overflow-hidden cursor-pointer">
                        {Models.slice(0, 6).map((model) => (
                          <div
                            key={model._id}
                            className="relative aspect-[4/5]"
                            onClick={() => {
                              navigate(`/${model.username}`), ScrollToView();
                            }}
                          >
                            <img
                              src={model.image.url}
                              alt="model"
                              className="duration-700 relative opacity-1 rounded-lg object-cover"
                              style={{
                                position: 'absolute',
                                height: '100%',
                                width: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            <div className="absolute inset-0 bg-neutral-2" />
                            <div className="absolute inset-0 -bottom-[1px] top-16 bg-gradient-to-b from-transparent via-black/20 to-black transition-all duration-150 group-hover:top-40" />
                            <div className="absolute inset-0 flex flex-col items-start justify-end px-2.5 py-4">
                              <div className="relative">
                                <p className="pb-0.5 pl-1 font-semibold text-lg">{model.firstName}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full h-full flex justify-center items-center">
                        <LoadingSpinner />
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              <div className="fixed md:hidden bottom-0 right-0 left-0 px-6 flex justify-center flex-col items-center h-36 w-full bg-black">
                <button
                  className="bg-main-gradient w-full p-2 rounded-lg text-lg font-semibold"
                  onClick={() => navigate(`/chat/${Model?.username}`)}
                >
                  Chat now
                </button>

                <button
                  className="w-full py-2 mt-2 flex items-center gap-1 justify-center rounded-lg text-lg font-medium border-2 border-solid border-primary-500"
                  onClick={() => navigate("/wallet")}
                >
                  Subscribe 
                  <img src={pinkGemIcon} alt="" className="size-5" />
                  200
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
