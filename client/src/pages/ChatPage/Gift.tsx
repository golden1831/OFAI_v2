import { verifiedIcon } from "../../assets/icons";
import circleLogoIcon from "../../assets/images/circle-logo.svg";
import left from "../../assets/arrows/left.svg";
import crossIcon from "../../assets/icons/cross.svg";
import giftImage1 from '../../assets/images/gift-1.png'
import giftImage2 from '../../assets/images/gift-2.png'
import giftImage3 from '../../assets/images/gift-3.png'

type GiftType = {
	image: string;
	name: string;
	price: string;
};

const gifts: GiftType[] = [
  {
    image: giftImage1,
    name: 'Honey Birdette Lingerie',
    price: '5,000',
  },
  {
    image: giftImage2,
    name: 'Deluxe Spa Day',
    price: '10,000',
  },
  {
    image: giftImage3,
    name: 'Designer Handbag',
    price: '15,000',
  },
];

const TokenButton = ({ price }: { price: string }) => {
  return (
    <button className="flex flex-shrink-0 items-center border-2 border-[#fa06e2] rounded-2xl p-2 h-8 gap-2 px-2">
      <img className="h-4" src={circleLogoIcon} />
      {price}
    </button>
  );
};

export const Gift = ({
  modelImage,
  modelFirstName,
  setShowGiftUI,
}: {
  modelImage: string;
  modelFirstName: string;
  setShowGiftUI: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="absolute w-full md:w-[650px] flex flex-col items-center bottom-0 backdrop-blur-3xl bg-black/50 p-4 gap-2 rounded-t-3xl fadesIn">
      <div
        className="absolute -translate-y-20 w-24 h-24 rounded-full bg-cover bg-no-repeat border-2 border-[#fa06e2] cursor-pointer"
        style={{ backgroundImage: `url(${modelImage})` }}
      />
      <img className="absolute size-6 right-6 cursor-pointer" src={crossIcon} onClick={() => setShowGiftUI(false)} />
      <div className="flex items-center justify-center gap-2 text-white mt-6">
        {modelFirstName}
        <img className="size-4" src={verifiedIcon} />
      </div>
      <h1 className="mb-4 font-semibold text-xl">Spoil me and I'll spoil you 😼</h1>
      <div className="flex gap-4 w-full overflow-scroll hide-scrollbar">
        {gifts.map((gift) => (
          <div className="flex flex-col gap-2 items-center">
            <div
              className="w-60 h-32 rounded-xl bg-cover bg-no-repeat bg-center"
              style={{ backgroundImage: `url(${gift.image}` }}
            />
            <h1>{gift.name}</h1>
            <TokenButton price={gift.price} />
          </div>
        ))}
      </div>
      <div className="w-full">
        <h1>Send tip</h1>
      </div>
      <div className="flex gap-2 w-full overflow-scroll hide-scrollbar">
        <TokenButton price="5,000" />
        <TokenButton price="1,000" />
        <TokenButton price="2,000" />
        <TokenButton price="5,000" />
        <TokenButton price="10,000" />
      </div>
      <div className="w-full">
        <h1>Personalized Gift</h1>
      </div>
      <div className="flex w-full gap-4">
        <input
          className="w-full bg-white/20 p-2 rounded-xl text-white placeholder-white/60"
          type="text"
          placeholder="Whats your gift"
        />
        <input
          className="w-full bg-white/20 p-2 rounded-xl text-white placeholder-white/60"
          type="number"
          min={1}
          placeholder="5000"
        />
      </div>
      <button className="mt-2 flex items-center justify-center gap-4 w-full bg-white/20 p-2 rounded-xl text-white text-center">
        Next <img className="rotate-180" src={left} />
      </button>
    </div>
  );
};
