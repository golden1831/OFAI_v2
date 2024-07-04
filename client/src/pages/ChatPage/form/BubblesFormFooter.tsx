import 'swiper/css';
import 'swiper/css/free-mode';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import { clsx } from 'clsx';
import { shuffleFisherYates } from '../../../lib/shuffleFisherYates';

const defaultOptions = shuffleFisherYates([
  { value: "Play A Game", label: "Play A Game" },
  { value: "Role-Playing", label: "Role-Playing" },
  { value: "Would You Rather", label: "Would You Rather" },
  { value: "Sex Fantasies", label: "Sex Fantasies" },
  { value: "Truth Or Dare", label: "Truth Or Dare" },
  { value: "Play-By-Play Fantasy", label: "Play-By-Play Fantasy" },
  { value: "Relationship", label: "Relationship" },
  { value: "Fetish Mode", label: "Fetish Mode" },
  { value: "Threesome Mode", label: "Threesome Mode" },
  { value: "Pornstar Mode", label: "Pornstar Mode" },
  { value: "Kinky Mode", label: "Kinky Mode" },
  { value: "Sensual Massage", label: "Sensual Massage" },
  { value: "Companion Mode", label: "Companion Mode" },
  { value: "Voyeur", label: "Voyeur" },
  { value: "BDSM", label: "BDSM" },
  { value: "Erotic Story", label: "Erotic Story" },
  { value: "Dominatrix", label: "Dominatrix" },
  { value: "Schoolgirl", label: "Schoolgirl" },
  { value: "Strip Tease", label: "Strip Tease" },
  { value: "Foot Fetish", label: "Foot Fetish" },
  { value: "Lesbian", label: "Lesbian" },
  { value: "Submissive", label: "Submissive" },
  { value: "Mistress", label: "Mistress" },
  { value: "Secretary", label: "Secretary" },
  { value: "Nurse", label: "Nurse" },
  { value: "Teacher", label: "Teacher" },
  { value: "Cheerleader", label: "Cheerleader" },
  { value: "Goddess", label: "Goddess" },
])

const customOptions = shuffleFisherYates([
  { value: "You In Lingerie", label: "Lingerie" },
  { value: "You Working Out", label: "Working Out" },
  { value: "You In The Pool", label: "Pool" },
  { value: "You In A Dress", label: "Dress" },
  { value: "You At A Party", label: "Party" },
  { value: "Your Butt", label: "Butt" },
  { value: "You Naked", label: "Naked" },
  { value: "Your Boobs", label: "Boobs" },
  { value: "You Posing", label: "Posing" },
  { value: "You Looking Sexy", label: "Sexy" },
  { value: "You Teasing", label: "Teasing" },
  { value: "You In A Bikini", label: "Bikini" },
  { value: "You Naked In Bed", label: "Naked In Bed" },
  { value: "You With BDSM Leash", label: "BDSM Leash" },
  { value: "You In The Pool Naked", label: "Pool Naked" },
  { value: "You In A Bubble Bath", label: "Bubble Bath Naked" },
  { value: "You With A Cowgirl Hat", label: "Cowgirl Hat" },
])

interface BubblesFormFooterProps {
  disabled: boolean;
  onSelectOption: (option: string) => void;
  isCustomOptions: boolean;
}

export default function BubblesFormFooter({ disabled, onSelectOption, isCustomOptions }: BubblesFormFooterProps) {
  function onHandleClick(option: string) {
    if (disabled) return

    let message = option

    if (isCustomOptions) {
      message = `Send me a pic of ${option.toLowerCase()}`
    }

    onSelectOption(message)
  }

  return (
    <Swiper
      loop
      freeMode
      modules={[FreeMode, Mousewheel]}
      mousewheel={{
        forceToAxis: true,
      }}
      className="flex w-full"
      grabCursor
      spaceBetween={6}
      slidesPerView="auto"
    >
      {(isCustomOptions ? customOptions : defaultOptions).map(({ value, label }) => (
        <SwiperSlide key={value} className="w-auto">
          <p 
            onClick={() => onHandleClick(value)} 
            aria-disabled={disabled} 
            className={clsx("py-0.5 px-3 rounded-full text-sm bg-white/10 border border-solid border-white/10", disabled ? "cursor-not-allowed" : "cursor-pointer")}
          >
            {label}
          </p>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}