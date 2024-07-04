import * as outlinedIcons from "../../assets/icons/outlined"
import * as filledIcons from "../../assets/icons/filled"

type IconType = 'home' | 'explore' | 'chat' | 'wallet' | 'staking' | 'profile' | 'leaderboard';

interface NavIconProps {
  type: IconType;
  filled: boolean;
  className: string;
}

export function NavIcon ({ type, filled, className }: NavIconProps) {
  return (
    <img
      src={filled ? filledIcons[type] : outlinedIcons[type]}
      alt={type}
      className={className}
    />
  )
}