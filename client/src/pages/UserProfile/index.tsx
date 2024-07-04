import { Link } from 'react-router-dom';
import { pinkGemIcon } from '../../assets/icons/pink';
import { editIcon, playIcon } from '../../assets/icons';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import SignInPopup from './SignInPopup';
import Footer from '../../components/Footer';
import { RootState } from '../../Navigation/redux/store/store';
import { profileAvatar } from '../../lib/getProfileAvatar';
import { GalleryType, getProfileLevelXP, getProfileLvl } from '../../types/user.types';
import { formattedTraits } from '../../lib/traits';
import { useDailyCheckinMutation, useGetMyGalleryQuery } from '../../Navigation/redux/apis/userApi';
import { useWeb3Auth } from '../../providers/Wallet';
import { useState } from 'react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import Popup from '../../components/utilities/PopUp';
import { clsx } from 'clsx';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { isSameDay } from 'date-fns';

type SelectedMedia = {
	url: string;
	type: GalleryType;
}

export default function ProfilePage() {
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(null);
  const [blurFreeImages, setBlurFreeImages] = useState<string[]>([]);

  const user = useSelector((state: RootState) => state.user.user);
  const authStatus = useSelector((state: RootState) => state.auth.authStatus);

  const { headers } = useWeb3Auth()

  const { data: gallery } = useGetMyGalleryQuery({ headers }, {
    skip: !headers
  })

  const [dailyCheckin, { isLoading: isLoadingCheckin }] = useDailyCheckinMutation();

  if (!user || !authStatus) return <SignInPopup />;

  const slug = user.username ?? user.walletAddress;

  function copyLink() {
    navigator.clipboard.writeText(`https://ofai.app/referral/${slug}`);

    toast.success('Link copied to clipboard');
  }

  async function onDailyCheckin() {
    dailyCheckin({ headers })
      .unwrap()
      .then(() => toast.success('Checkin successful'))
      .catch((err) => {
        const error = err as FetchBaseQueryError & {
          data: {
            message: string;
          };
        };

        toast.error(error.data?.message ?? 'Something went wrong');
      })
  }

  function onSelectMedia(id: string, { url, type }: SelectedMedia) {
    if (!blurFreeImages.includes(id)) {
      setBlurFreeImages((prev) => [...prev, id]);

      return
    }

    setSelectedMedia({ url, type });
  }

  const { currLvl, nextLvl } = getProfileLevelXP(user.xp);

  const XPRemainingForNextLevel = nextLvl - user.xp;

  const barIndicatorLevel = ((user.xp - currLvl) / (nextLvl - currLvl)) * 100;

  const interests = user.interests 
    ? JSON.parse(user.interests)
    : null;

  const checkinCompleted = user.lastCheckin ? isSameDay(new Date(), user.lastCheckin * 1000) : false;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto mt-14 mb-24 px-6">
      <div className="flex items-start gap-5 md:gap-8 md:items-end">
        <div className="size-28 min-w-28 relative flex flex-col items-center rounded-full border-3 border-solid border-primary-500 md:border-5 md:size-44 md:min-w-44">
          <img
            src={profileAvatar(user.profileImage)}
            alt=""
            className="size-full aspect-square object-cover rounded-full"
          />

          <span className="bg-black/35 backdrop-blur-md border border-solid border-white/10 text-xs text-center text-white py-1 px-2 rounded-full absolute -bottom-3 md:py-1.5 md:px-3 md:text-sm">
            {user.xp} XP
          </span>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white md:text-3xl">
              {user.name ?? user.username}
            </h1>

            {user.gemEarned > 0 && (
              <p className="hidden items-center gap-1.5 text-lg text-white/90 md:flex">
                {user.gemEarned}
                <img src={pinkGemIcon} alt="" className="size-5" />
                Earned
              </p>
            )}
          </div>

          <h2 className="my-3 text-lg font-semibold text-white flex flex-col md:text-2xl md:items-center md:flex-row md:gap-2 md:mt-4">
            LVL {getProfileLvl(user.xp)}
            <span className="text-sm font-normal text-white/60 md:text-lg">
              {XPRemainingForNextLevel}XP more to level up
            </span>
          </h2>

          <span className="flex w-full h-2 rounded-full bg-white/10">
            <span
              style={{
                width: `${barIndicatorLevel > 0 ? barIndicatorLevel : 0}%`,
                background: 'linear-gradient(90deg, #BD38DC 0%, #F708C3 100%)',
              }}
              className="rounded-full flex transition-all duration-300"
            />
          </span>

          {interests && (
            <div className="flex items-center gap-2 my-4">
              {interests.map((trait: string) => (
                <p 
                  key={trait} 
                  className="p-0.5 px-3 text-sm rounded-full bg-white/5 border border-solid border-white/10 text-white"
                >
                  {formattedTraits.find((item) => item.value === trait)?.label}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-end gap-3 mt-6 md:gap-8 md:mt-8">
        <Link
          to="/my-profile/edit"
          className="flex items-center gap-1.5 py-2.5 px-3 rounded-xl text-sm bg-white/10 transition-all duration-300 hover:bg-white/20 md:gap-2.5 md:py-3 md:px-7 md:text-lg"
        >
          <img src={editIcon} alt="" className="size-4 md:size-5" />
          Edit Profile
        </Link>

        <div className="flex flex-col gap-2 flex-1">
          <p className="text-white/60 ml-4 text-xs md:text-base">Referral Link</p>

          <div className="flex items-center py-1 pl-2 pr-1 bg-white/5 border border-solid border-white/5 rounded-2xl md:py-2 md:pl-5 md:pr-2">
            <p className="text-sm truncate w-28 text-white/90 mr-2 md:text-lg md:w-48">ofai.app/referral/{slug}</p>

            <button
              type="button"
              onClick={copyLink}
              className="py-2 px-3 ml-auto font-medium rounded-xl text-xs bg-white/10 transition-all duration-300 hover:bg-white/20 md:text-sm"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>

      <button 
        onClick={onDailyCheckin}
        disabled={isLoadingCheckin || checkinCompleted}
        className={clsx(
          "flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm bg-white/10 transition-all duration-300 md:gap-2.5 md:py-3 md:px-7 md:text-lg mt-6",
          checkinCompleted ? "cursor-not-allowed opacity-50" : "hover:bg-white/20"
        )}
      >
        Daily Check-in

        {!isLoadingCheckin && <img src={pinkGemIcon} alt="" className="size-5" />}
        {isLoadingCheckin && <div className="spinner !size-5" />}

        + 10
      </button>

      <div className="flex flex-col mt-10">
        <h4 className="text-xl font-semibold text-white mb-6">Gallery</h4>

        {!gallery && (
          <div className="size-full flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}

        {gallery && gallery.length === 0 && (
          <p className="text-center text-white/60 size-full flex items-center justify-center">
            You don't have any images <br />
            or videos in the gallery yet.
          </p>
        )}

        {gallery && gallery.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
            {gallery.map(({ _id, url, type }) => (
              <div key={_id} className="relative">
                {type === GalleryType.picture && (
                  <img src={url} alt="" className="object-cover h-60 w-full rounded-3xl md:h-80" />
                )}

                {type === GalleryType.video && (
                  <video controls={false} className="object-cover h-60 w-full rounded-3xl md:h-80">
                    <source src={url} type="video/mp4" />
                  </video>
                )}

                <button
									onClick={() => onSelectMedia(_id, { type, url })}
									className={clsx("absolute flex items-center justify-center top-0 cursor-pointer rounded-xl left-0 size-full", !blurFreeImages.includes(_id) && "bg-white/20 backdrop-blur-md")}
								>		
									{type === GalleryType.video && (
										<button className="absolute flex pointer-events-none">
                      <img src={playIcon} alt="" className="size-12" />
                    </button>
									)}
								</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      <Popup
        show={!!selectedMedia}
        close={() => setSelectedMedia(null)}
        className="[&>div]:p-0 [&>div]:size-full max-w-6xl !w-full !h-[80vh] mx-6 bg-transparent"
      >
        {selectedMedia?.type === GalleryType.picture && (
          <img src={selectedMedia?.url} alt="" className="size-full rounded-3xl object-contain" />
        )}

        {selectedMedia?.type === GalleryType.video && (
          <video controls className="rounded-3xl object-contain size-full">
            <source src={selectedMedia?.url} type="video/mp4" />
          </video>
        )}
      </Popup>
    </div>
  );
}
