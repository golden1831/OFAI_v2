import logo from "../assets/images/logo.svg";
import circleLogoIcon from "../assets/images/circle-logo.svg";
import { useNavigate } from "react-router-dom";

const Logo = () => {
	const navigate = useNavigate();

	return (
		<div
			className="flex hover:cursor-pointer hover:opacity-80 items-center gap-2"
			onClick={() => navigate("/")}>
			<img
				src={circleLogoIcon}
                className="h-6"
				alt="logo"
			/>
			<img
				src={logo}
                className="h-6"
				alt="logo"
			/>
		</div>
	);
};

export default Logo;
