import 'swiper/css';

import { useNavigate } from "react-router-dom";
import { ButtonPrimary } from "../../components/utilities/PrimaryButton";
import { twinkleIcon } from "../../assets/icons";
import homeGirls from '../../assets/images/home/girls-desktop.png';
import homeMobileGirls from '../../assets/images/home/girls-mobile.png';
import homeGirls2 from '../../assets/images/home/girls-2-desktop.png';
import homeMobileGirls2 from '../../assets/images/home/girls-2-mobile.png';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from 'swiper/modules';

const sliders = [
  {
    title: "Level Up To",
    image: homeGirls2,
    subTitle: "UNLOCK REWARDS",
    description: "Earn XP by Chatting with your Favorite Models. Level up to Unlock GEMS & AIRDROP Rewards!",
    mobileImage: homeMobileGirls2,
  },
  {
    title: "Chat With Your Very Own",
    image: homeGirls,
    subTitle: "AI Girlfriend",
    description: "Explore our virtual partners and receive custom tailored spicy content that fulfills your wildest desires. Every moment spent with your AI girlfriend is designed just for you!",
    mobileImage: homeMobileGirls,
  },
]

export default function Slider() {
  const navigate = useNavigate();

  return (
    <div className="flex w-full">
      <Swiper
        loop
        modules={[Autoplay]}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        className="flex w-full"
        grabCursor
        spaceBetween={24}
        slidesPerView={1}
      >
        {sliders.map((slider) => (
          <SwiperSlide key={slider.title}>
            <div className="flex justify-between relative m-4 bg-white/5 rounded-xl shrink-0 overflow-hidden flex-row">
              <div className="flex relative z-10 flex-col p-6 max-w-72 md:max-w-full md:p-12">
                <h1 className="text-xl font-semibold md:text-3xl">
                  {slider.title}
                  <b className="text-primary-500 font-semibold ml-1">{slider.subTitle}</b>
                </h1>

                <p className="text-sm mt-2 mb-6 max-w-xl hidden md:flex">
                  {slider.description}
                </p>

                <ButtonPrimary
                  onClick={() => navigate('/explore')}
                  className="rounded-lg w-fit py-1.5 flex items-center gap-2 mt-6 md:mt-0"
                >
                  <img src={twinkleIcon} className="h-4" />
                  Start Chatting
                </ButtonPrimary>
              </div>

              <img
                src={slider.image}
                className="absolute z-0 right-0 hidden md:block max-w-full max-h-full object-contain shrink-0"
              />
              <img src={slider.mobileImage} className="absolute -top-6 -right-10 h-auto max-w-full sm:-top-10 md:hidden" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}