import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Popup from "../../components/utilities/PopUp"
import { ButtonPrimary } from "../../components/utilities/PrimaryButton"
import { clsx } from "clsx"
import Toggle from "./Toggle"
import subscriptionGirlsImage from '../../assets/images/subscription-girls.png';
import { pinkChattingIcon, pinkCoinIcon, pinkPaymentIcon, pinkImageIcon, pinkMicrophoneIcon, pinkPhoneIcon, pinkGemIcon } from "../../assets/icons/pink";

interface PopupSubscriptionProps {
  show: boolean
  plan: string | null
  onShow: Dispatch<SetStateAction<boolean>>
}

const tabs = [
  {
    key: "TOPUP",
    name: "Top-up"
  },
  {
    key: "SUBSCRIPTIONS",
    name: "Subscriptions",
  }
]

const benefitsOfPlan = [
  {
    icon: pinkChattingIcon,
    title: 'Make phone calls',
  },
  {
    icon: pinkPhoneIcon,
    title: 'Unlock NSFW pictures.',
  },
  {
    icon: pinkMicrophoneIcon,
    title: 'Buy gifts',
  },
  {
    icon: pinkImageIcon,
    title: 'Receive voice messages',
  },
]

const benefitsOfSubscription = [
  {
    icon: pinkPaymentIcon,
    title: '14.99 / month',
  },
  {
    icon: pinkChattingIcon,
    title: 'Unlimited messages / day',
  },
  {
    icon: pinkCoinIcon,
    title: '1,500 free tokens/month',
  },
  {
    icon: pinkImageIcon,
    title: 'NSFW & Phone calls',
  },
]

const getPrice = (value: string) => {
  const price = value.replace(/\$/g, "")

  return Number(price) * 100
}

const PopupSubscription = ({ plan, show, onShow }: PopupSubscriptionProps) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0].key)
  const [selectedPrice, setSelectedPrice] = useState("$100")
  const [selectedMethod, setSelectedMethod] = useState("CREDIT_CARD")
  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState("Premium")
  const [selectedSubscriptionMethod, setSelectedSubscriptionMethod] = useState("ANNUALY")
  
  const currentPrice = getPrice(selectedPrice)

  function onToggleMethod(value: string) {
    setSelectedPrice("$100")
    setSelectedMethod(value)
  }

  useEffect(() => {
    if (plan) {
      const price = {
        "1k": "$10",
        "2k": "$20",
        "10k": "$50",
      }

      setSelectedPrice(price[plan as keyof typeof price])
    }
  }, [plan])

  return (
    <Popup show={show} close={() => onShow(false)} className="pt-6 !w-full h-fit max-w-md">
      <div className="p-4 w-full flex flex-col overflow-y-auto h-[calc(70vh-5rem)]">
        <div className="flex items-center mb-8 bg-white/5 rounded-full">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedTab(tab.key)}
              className={clsx("px-4 py-3 font-medium rounded-full w-full text-center transition-all duration-300 ease-in-out", selectedTab === tab.key
                ? "bg-white/10 text-white"
                : "text-gray-300 hover:text-white")}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {selectedTab === "TOPUP" && (
          <div className="flex flex-col items-center w-full">
            <Toggle 
              optionLeft={{ key: "CREDIT_CARD", name: "Credit Card" }}
              optionRight={{ key: "CRYPTO", name: "Crypto" }}
              selectedOption={selectedMethod}
              onSelectedOption={onToggleMethod}
            />

            <div className="flex mt-4 items-center gap-2">
              <img src={pinkGemIcon} alt="" className="size-10" />

              <h2 className="text-6xl font-medium">{currentPrice}</h2>

              <p className="text-white/60 mt-auto relative bottom-1">GEMS</p>
            </div>

            {selectedMethod === "CRYPTO" && (
              <p className="text-white text-center py-2 px-5 mt-4 rounded-full bg-white/5 border border-solid border-white/15">
                + bonus of 500 gems for free
              </p>
            )}

            <div className="mt-8 grid grid-cols-3 gap-2.5 w-full">
              {["$10", "$20", "$50", "$100", "$250", "$500"].map((amount) => (
                <button 
                  key={amount} 
                  type="button" 
                  onClick={() => setSelectedPrice(amount)}
                  className={clsx("flex items-center font-medium text-lg justify-center w-full p-4 rounded-lg text-center border border-solid transition-all duration-300 ease-in-out", selectedPrice === amount ? "bg-primary-500/15 text-primary-500 border-primary-500" : "border-white/10 bg-white/5 text-white")}
                >
                  {amount}
                </button>
              ))}
            </div>

            <input 
              type="text"
              className="bg-white/10 rounded-xl py-3 px-4 text-center text-white placeholder:text-white font-medium mt-5 w-full"
              placeholder="Add a custom amount"
            />

            <div className="flex flex-col gap-4 mt-8">
              <p className="text-white/60">You can use your tokens to</p>
              
              <div className="grid grid-cols-2 gap-2.5">
                {benefitsOfPlan.map(({ icon, title }) => (
                  <div 
                    key={title} 
                    className="flex flex-col p-4 gap-5 rounded-xl border border-solid border-white/10 bg-white/10"
                  >
                    <img src={icon} alt="" className="size-8 grayscale brightness-200" />

                    <p>{title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === "SUBSCRIPTIONS" && (
          <div className="flex flex-col items-center w-full">
            <img src={subscriptionGirlsImage} alt="Subscription Girls" className="mb-4" />

            <Toggle 
              optionLeft={{ key: "ANNUALY", name: "Annualy" }}
              optionRight={{ key: "MONTHLY", name: "Monthly" }}
              selectedOption={selectedSubscriptionMethod}
              onSelectedOption={setSelectedSubscriptionMethod}
            />

            <div className="grid grid-cols-3 gap-2.5 mt-4 w-full">
              {["Starter", "Premium", "VIP"].map((plan) => (
                <button 
                  key={plan} 
                  type="button" 
                  onClick={() => setSelectedSubscriptionPlan(plan)}
                  className={clsx("flex items-center font-medium text-lg justify-center w-full p-4 rounded-lg text-center border border-solid transition-all duration-300 ease-in-out", selectedSubscriptionPlan === plan ? "bg-primary-500/15 text-primary-500 border-primary-500" : "border-white/10 bg-white/5 text-white")}
                >
                  {plan}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-8">
              {benefitsOfSubscription.map(({ icon, title }) => (
                <div 
                  key={title} 
                  className="flex flex-col p-4 gap-5 rounded-xl border border-solid border-white/10 bg-white/10"
                >
                  <img src={icon} alt="" className="size-8 grayscale brightness-200" />

                  <p>{title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-full border-t border-solid border-white/10 p-1 pt-6">
        <ButtonPrimary onClick={() => onShow(false)}>
          {selectedTab === "TOPUP" ? `Top up of ${selectedPrice}` : "Billed monthly at $14.99"}
        </ButtonPrimary>
      </div>
    </Popup>
  )
}

export default PopupSubscription