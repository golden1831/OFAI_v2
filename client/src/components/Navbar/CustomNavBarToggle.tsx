
import { CiMenuFries } from "react-icons/ci";
import { useSpring, animated } from "react-spring";

interface CustomNavBarToggleProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const CustomNavBarToggle = ({
  toggleMenu,
  isMenuOpen,
}: CustomNavBarToggleProps) => {
  const animation = useSpring({
    transform: isMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
    config: {
      tension: 300,
    },
  });

  return (
    <animated.div
      className="text-foreground cursor-pointer "
      onClick={toggleMenu}
      style={animation}
    >
      <CiMenuFries size={25} className="text-white" />
    </animated.div>
  );
};

export default CustomNavBarToggle;