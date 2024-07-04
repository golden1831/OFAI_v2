import { ButtonPrimary } from "../../components/utilities/PrimaryButton";
import { pinkChattingIcon, pinkGemIcon, pinkImageIcon, pinkMicrophoneIcon, pinkPhoneIcon } from "../../assets/icons/pink";
import { useEffect, useState } from "react";
import PopupSubscription from "./Popup";
import Footer from "../../components/Footer";
import { useSearchParams } from "react-router-dom";
import { RootState } from "../../Navigation/redux/store/store";
import { useSelector } from "react-redux";

const benefitsOfPlan = [
  {
    icon: pinkChattingIcon,
    title: 'Text Message',
    description: 'Based on plan',
  },
  {
    icon: pinkPhoneIcon,
    title: 'Phone call',
    description: '10 tokens/ min',
  },
  {
    icon: pinkMicrophoneIcon,
    title: 'Voice response',
    description: '10 tokens/ message',
  },
  {
    icon: pinkImageIcon,
    title: 'NSFW pics',
    description: 'Pay per view',
  },
]

const WalletPage = () => {
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false)

  const [searchParams] = useSearchParams()

  const plan = searchParams.get("plan")

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (plan) setShowSubscriptionPopup(true)
  }, [plan])

  return (
    <div className="flex flex-col max-w-2xl mx-auto px-6 mb-24 md:px-0">
      <div
        style={{
          background: 'radial-gradient(31.5% 50% at 50% 50%, rgba(251, 4, 193, 0) 0%, rgba(250, 5, 194, 0.024) 65.07%, rgba(250, 5, 194, 0.064) 100%)'
        }}
        className="w-full flex flex-col items-center mt-10 p-10 rounded-3xl border border-solid border-primary-500/40"
      >
        <p className="text-lg text-white/60">Your GEMS</p>
        
        <div className="flex mt-0.5 items-center gap-3">
          <img src={pinkGemIcon} alt="" className="relative size-10" />

          <h2 className="text-6xl font-medium">{user.gem}</h2>
        </div>
      </div>

      <ButtonPrimary 
        onClick={() => setShowSubscriptionPopup(true)} 
        className="rounded-lg mt-6 py-4"
      >
        Top up your wallet
      </ButtonPrimary>

      <div className="flex flex-col gap-1 my-9">
        <p className="text-lg text-white/60">Membership</p>
        <p className="text-2xl font-medium">No Active Membership</p>
      </div>
      
      <div className="flex flex-col gap-4">
        <p className="text-lg text-white/60">Pricing</p>
        
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {benefitsOfPlan.map(({ icon, title, description }) => (
            <div 
              key={title} 
              style={{
                background: 'radial-gradient(40.78% 44.25% at 50% 50%, rgba(251, 4, 193, 0.032) 0%, rgba(250, 5, 194, 0.0416) 65.07%, rgba(250, 5, 194, 0.064) 100%)'
              }}
              className="flex flex-col p-4 rounded-3xl border border-solid border-primary-500/40"
            >
              <img src={icon} alt="" className="size-8" />

              <p className="text-lg font-medium mt-6">{title}</p>
              <p className="text-sm text-white/60">{description}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />

      <PopupSubscription 
        plan={plan}
        show={showSubscriptionPopup} 
        onShow={setShowSubscriptionPopup} 
      />
    </div>
  )
}

export default WalletPage;