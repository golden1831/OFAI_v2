import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { crossIcon } from "../../assets/icons";
import { Dispatch, SetStateAction, useState } from "react";
import { pinkGemIcon } from "../../assets/icons/pink";
import { ButtonPrimary } from "../utilities/PrimaryButton";
import { useNavigate } from "react-router-dom";

const variants = {
  base: {
    open: { opacity: 1 },

    closed: { opacity: 0 },
  },

  wrapper: {
    open: { top: 0 },

    closed: { top: 32 },
  },
}

interface AddGemsPopupProps {
  show: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
}

const routes = [
  { name: "Terms of Service", path: "#" },
  { name: "Privacy Policy", path: "#" },
  { name: "Support", path: "mailto:support@ofai.ai" },
  { name: "Refund Policy", path: "#" },
]

export default function AddGemsPopup({ show, onClose }: AddGemsPopupProps) {
  const [selectedOption, setSelectedOption] = useState("1k");

  const navigate = useNavigate()

  function onNavigate() {
    navigate(`/wallet?plan=${selectedOption}`)

    onClose(false)
  }
  
  return (
    <AnimatePresence initial={false}>
      <motion.div
        exit={{ opacity: 0 }}
        role="dialog"
        animate={show ? "open" : "closed"}
        variants={variants.base}
        className={clsx("z-50 flex fixed size-full inset-0 bg-black/20 items-end justify-center md:items-center", show ? "pointer-events-auto" : "pointer-events-none")}
        aria-modal={show}
        aria-hidden={!show}
      >
        <motion.div
          exit={{ top: 32 }}
          animate={show ? "open" : "closed"}
          variants={variants.wrapper}
          className="flex py-10 px-6 relative z-20 flex-col items-center bg-black/10 backdrop-blur-2xl rounded-lg w-full max-w-2xl md:p-14"
          transition={{ type: "spring", duration: 0.6 }}
        >
          <button 
            type="button" 
            onClick={() => onClose(false)} 
            className="absolute top-8 right-8"
          >
            <img src={crossIcon} alt="" className="size-5" />
          </button>

          <h4 className="text-3xl font-semibold text-white">Add Gems</h4>
          <p className="text-white/60 text-center text-lg mt-2">The more you buy the cheaper the Gems!</p>
        
          <div className="flex items-center gap-3 mt-9 mx-auto md:gap-5">
            <button 
              type="button"
              onClick={() => setSelectedOption("2k")}
              className={clsx("flex flex-col items-center py-6 px-6 bg-black/20 rounded-2xl md:px-8 border-2 border-solid", selectedOption === "2k" ? "border-primary-500" : "border-white/10")}
            >
              <img src={pinkGemIcon} alt="" className="size-10 md:size-14" />

              <h6 className="text-xl font-semibold text-center mt-4 mb-2 text-white">2k<br />Gems</h6>
              <p className="text-primary-500 text-lg font-semibold">$19.99</p>
            </button>

            <button 
              type="button"
              onClick={() => setSelectedOption("1k")}
              className={clsx("flex flex-col relative items-center py-9 px-6 bg-black/20 rounded-2xl border-2 border-solid md:px-8", selectedOption === "1k" ? "border-primary-500" : "border-white/10")}
            >
              <p className="text-xs text-center absolute -top-3 py-0.5 px-1 rounded-lg bg-primary-500 text-white font-medium text-nowrap sm:px-2 md:text-sm">
                Most popular
              </p>
              
              <img src={pinkGemIcon} alt="" className="size-14 md:size-16" />

              <h6 className="text-xl font-semibold mt-4 text-center mb-2 text-white">1k<br />Gems</h6>
              <p className="text-primary-500 text-lg font-semibold">$9.99</p>
            </button>

            <button 
              type="button"
              onClick={() => setSelectedOption("10k")}
              className={clsx("flex flex-col items-center py-6 px-6 bg-black/20 rounded-2xl border-2 border-solid md:px-8", selectedOption === "10k" ? "border-primary-500" : "border-white/10")}
            >
              <img src={pinkGemIcon} alt="" className="size-10 md:size-14" />

              <h6 className="text-xl font-semibold mt-4 mb-2 text-center text-white">10k<br />Gems</h6>
              <p className="text-primary-500 text-lg font-semibold">$49.99</p>
            </button>
          </div>

          <ButtonPrimary 
            onClick={onNavigate}
            className="rounded-xl max-w-xs mt-9 font-medium"
          >
            Continue
          </ButtonPrimary>

          <div className="flex items-center gap-3 mt-6 md:gap-5">
            {routes.map((route) => (
              <a 
                key={route.name}
                href={route.path}
                target={route.path.startsWith("mailto") ? "_blank" : "_self"}
                className="text-white/60 transition-all duration-300 text-xs hover:text-white md:text-sm"
              >
                {route.name}
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}