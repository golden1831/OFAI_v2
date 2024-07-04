import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModels } from '../Navigation/redux/slice/ModelsSlice';
import { setModel } from '../Navigation/redux/slice/ModelSlice';
import api from '../axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import FeedMiddlePanel from '../components/FeedMiddlePanel';
import { plusIcon, verifiedIcon } from '../assets/icons';
import ReactCountryFlag from 'react-country-flag';
import { ButtonPrimary } from '../components/utilities/PrimaryButton';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ICompanion } from '../types/Companion.types';
import { shuffleFisherYates } from '../lib/shuffleFisherYates';
import { addMinutes, isBefore } from 'date-fns';

function FeedPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const DevRef = useRef<HTMLDivElement>(null);
  const Models = useSelector((state: any) => state.models.Models as ICompanion[]);
  const [isScrolling, setIsScrolling] = useState(true);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  const modelCardHeight = screenHeight - 80;

  useEffect(() => {
    window.addEventListener('resize', () => setScreenHeight(window.innerHeight));
    return () => window.removeEventListener('resize', () => setScreenHeight(window.innerHeight));
  }, []);

  const fetchModels = async () => {
    try {
      const storage = JSON.parse(localStorage.getItem('@ofai-models') ?? '{}');

      if (storage.value) {
        const value: ICompanion[] = JSON.parse(storage.value);

        if (isBefore(new Date(), new Date(storage.timestamp))) {
          dispatch(setModels(value));

          return;
        }
      }

      const res = await api.get(`${import.meta.env.VITE_API_URL}/companions`);

      const data = shuffleFisherYates([...Models, ...res.data]);

      const object = {
        value: JSON.stringify(data),
        timestamp: addMinutes(new Date(), 10),
      };

      localStorage.setItem('@ofai-models', JSON.stringify(object));

      dispatch(setModels(data));
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const handleScroll = async () => {
    if (!DevRef.current) return;

    const prevScroll = parseFloat(window.localStorage.getItem('CurrentScroll') || '0');
    const scrollBottom = DevRef.current.scrollTop + modelCardHeight;
    const scrollHeight = DevRef.current.scrollHeight - modelCardHeight;

    if (scrollBottom >= scrollHeight && scrollBottom !== prevScroll) {
      //! Duplicating the models to simulate infinite scroll

      const duplicatedModels = Models.map((model, index) => ({
        ...model,
        id: index + Models.length,
      }));

      dispatch(setModels([...Models, ...duplicatedModels]));
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  useEffect(() => {
    const prevScroll = window.localStorage.getItem('CurrentScroll');

    if (prevScroll && DevRef.current) {
      setIsScrolling(false);

      DevRef.current?.scrollTo(0, parseFloat(prevScroll));

      localStorage.removeItem('CurrentScroll');
    }

    setIsScrolling(true);
  }, []);

  const GoToProfile = (username: string) => {
    try {
      if (window.localStorage.getItem('CurrentScroll')) {
        window.localStorage.removeItem('CurrentScroll');
      }
      window.localStorage.setItem('CurrentScroll', JSON.stringify(DevRef.current?.scrollTop));
    } catch (error) {
      console.log(error);
    }
    navigate(`/${username}`);
  };

  const GoToChat = (username: string) => {
    try {
      if (window.localStorage.getItem('CurrentScroll')) {
        window.localStorage.removeItem('CurrentScroll');
      }
      window.localStorage.setItem('CurrentScroll', JSON.stringify(DevRef.current?.scrollTop));
    } catch (error) {
      console.log(error);
    }

    navigate(`/chat/${username}`);
  };

  const ModelCard = (props: { Model?: ICompanion }) => {
    return (
      <>
        {props.Model ? (
          <motion.div
            style={{ height: `${modelCardHeight}px` }}
            className={`size-full snap-start relative object-cover`}
          >
            <img
              src={props.Model.image.url}
              alt="model"
              className="size-full object-cover snap-start"
            />
            <div className="absolute bottom-0 left-0 right-0 lg:hidden w-full flex justify-between p-4 gap-2">
              <div className="flex flex-col justify-between">
                <h2 className="text-2xl text-white font-black leading-tight drop-shadow flex items-center gap-1">
                  {props.Model.firstName}
                  <img className="inline" src={verifiedIcon} />
                </h2>

                <h3 className="drop-shadow font-normal text-xl">
                  {props.Model.age} |
                  <ReactCountryFlag
                    className="ml-1 pt-0.5"
                    countryCode={props.Model.country}
                    style={{
                      width: '1.5em',
                      height: '1.5em',
                    }}
                  />
                </h3>

                <p className="mt-0.5 text-sm drop-shadow">{props.Model.shortBio}</p>
              </div>
              <div className="flex flex-col justify-between items-center gap-2">
                <div
                  className="size-14 rounded-full bg-cover bg-no-repeat border-2 cursor-pointer"
                  style={{
                    backgroundImage: `url(${props.Model.image.url})`,
                  }}
                  onClick={() => {
                    dispatch(setModel(props.Model)), GoToProfile(props.Model!.username);
                  }}
                />
                <img src={plusIcon} className="absolute w-6 ml-9 mt-8" />
                <ButtonPrimary
                  className="px-3 py-2 rounded-lg"
                  onClick={() => {
                    dispatch(setModel(props.Model)), GoToChat(props.Model!.username);
                  }}
                >
                  <p className="text-small font-medium whitespace-nowrap ">Chat now</p>
                </ButtonPrimary>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div className="w-screen snap-start relative object-cover">
            <div className="w-full h-full flex justify-center items-center">
              <LoadingSpinner />
            </div>
          </motion.div>
        )}
      </>
    );
  };

  return (
    <div className="w-full h-full overflow-y-clip" style={{ height: `${modelCardHeight}px` }}>
      {Models.length > 0 && isScrolling ? (
        <>
          {/* Desktop View */}

          <div className=" hidden md:block h-full w-full">
            <div className="hidden md:flex w-full sticky -top-px min-h-[auto] bg-base-100"></div>
            <div className="w-full h-full pb-[150px] flex flex-col">
              <div className="flex w-full h-full">
                <div className="hidden md:flex flex-1 justify-center items-center justify-self-end h-full gap-2">
                  <FeedMiddlePanel />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div
            className={`h-screen overflow-y-scroll md:hidden snap-y snap-mandatory bg-black  ${
              !isScrolling ? 'scroll-smooth' : ''
            }`}
            style={{ height: `${modelCardHeight}px` }}
            ref={DevRef}
            onScroll={() => handleScroll()}
          >
            {Models.length > 0 ? (
              <>
                {Models.map((Model) => (
                  <ModelCard key={Model._id} Model={Model} />
                ))}
              </>
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <LoadingSpinner />
              </div>
            )}
          </div>
          <Footer />
        </>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}

export default FeedPage;
