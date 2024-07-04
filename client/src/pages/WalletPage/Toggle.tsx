import { clsx } from "clsx"

type Option = {
  key: string
  name: string
}

interface ToggleProps {
  optionLeft: Option
  optionRight: Option
  selectedOption: string
  onSelectedOption: (value: string) => void
}

const Toggle = ({ optionLeft, optionRight, selectedOption, onSelectedOption }: ToggleProps) => {
  return (
    <div className="flex gap-3 mx-auto items-center text-sm font-medium">
      <p className={clsx("transition-all duration-300 ease-in-out", selectedOption === optionLeft.key ? "text-white" : "text-white/40")}>
        {optionLeft.name}
      </p>

      <button 
        type="button" 
        onClick={() => onSelectedOption(selectedOption === optionLeft.key ? optionRight.key : optionLeft.key)}
        className="bg-white/10 relative rounded-full w-10 h-6 transition-all duration-300 ease-in-out"
      >
        <span className={clsx("size-6 absolute top-0 bg-primary-500 rounded-full transition-all duration-300 ease-in-out", selectedOption === optionLeft.key ? "left-0" : "left-4")} />
      </button>

      <p className={clsx("transition-all duration-300 ease-in-out", selectedOption === optionRight.key ? "text-white" : "text-white/40")}>
        {optionRight.name}
      </p>
    </div>
  )
}

export default Toggle