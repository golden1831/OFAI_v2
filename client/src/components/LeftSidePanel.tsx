import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavIcon } from "./utilities/NavIcon";
import {
	emailIcon,
	instagramIcon,
	telegramIcon,
	twitterIcon,
} from "../assets/icons/social";
import { ButtonPrimary } from "./utilities/PrimaryButton";
import { twinkleIcon } from "../assets/icons";
import { useComingSoon } from "../contexts/ComingSoonContext";
import { clsx } from "clsx";

interface SectionNameProps {
	text: string;
	isSelected: boolean;
}

interface LeftSidePanelProps {
	isOpen: boolean;
	isLarge: boolean;
	setIsOpen: (isOpen: boolean) => void;
	blurBackdrop: boolean;
}

function SectionName({
	text,
	isSelected,
}: SectionNameProps) {
	return (
		<h2
			className={clsx("text-xl font-semibold", isSelected ? "text-white" : "text-white/60")}
		>
			{text}
		</h2>
	);
}

function LeftSidePanel(props: LeftSidePanelProps) {
	const location = useLocation();
	const navigate = useNavigate();

	const isSelected = (path: RegExp | string) => {
		if (typeof path === "string") return path === location.pathname;
		else return path.test(location.pathname)
	}

	const { setComingSoon } = useComingSoon()

	const chatRegex = /^\/chat\/([a-zA-Z0-9]+)$/;

	const variants = {
		open: {
			x: 0,
			transition: { duration: 0.1 },
		},
		closed: {
			x: "-100%",
			transition: { duration: 0.1 },
		},
	};

	const aTagStyle =
		"transition flex items-center gap-6 rounded-xl p-4 hover:text-white hover:bg-[#242423]";

	return (
		<>
			<div
				onClick={() => props.setIsOpen(false)}
				className={clsx("fixed", !props.isLarge && props.blurBackdrop && "h-screen w-screen backdrop-blur-md bg-black/20 z-10")}
			/>
			<motion.aside
				initial={props.isOpen ? "open" : "closed"}
				animate={props.isOpen ? "open" : "closed"}
				variants={variants}
				className="transition z-20 fixed top-16 h-[calc(100vh-64px)] bg-primary-grey border-r border-[#242423] left-0 w-[280px] p-4 pb-[30px] flex flex-col justify-between"
			>
				<div className="space-y-1">
					<a
						href="/"
						className={`${aTagStyle} ${
							isSelected("/") ? "bg-main-gradient" : ""
						}`}>
						<NavIcon
							type="home"
							filled={isSelected("/")}
							className="size-7"
						/>
						<SectionName
							isSelected={isSelected("/")}
							text="Home"
						/>
					</a>
					<a
						href="/explore"
						className={`${aTagStyle}  ${
							isSelected("/explore") ? "bg-main-gradient " : ""
						}`}>
						<NavIcon
							type="explore"
							filled={isSelected("/explore")}
							className="size-7"
						/>
						<SectionName
							isSelected={isSelected("/explore")}
							text="Explore"
						/>
					</a>
					<a
						href="/chat-inbox"
						className={`${aTagStyle} ${
							isSelected("/chat-inbox") || isSelected(chatRegex) ? "bg-main-gradient" : ""
						}`}>
						<NavIcon
							type="chat"
							filled={isSelected("/chat-inbox") || isSelected(chatRegex)}
							className="size-7"
						/>
						<SectionName
							isSelected={isSelected("/chat-inbox") || isSelected(chatRegex)}
							text="Chat"
						/>
					</a>
					<a
						href="/wallet"
						className={`${aTagStyle} ${
							isSelected("/wallet") ? "bg-main-gradient" : ""
						}`}
					>
						<NavIcon
							type="wallet"
							filled={isSelected("/wallet")}
							className="size-7"
						/>
						<SectionName
							isSelected={isSelected("/wallet")}
							text="Wallet"
						/>
						
					</a>
					<a
						href="#"
						className={`${aTagStyle} ${
							isSelected("/staking") ? "bg-main-gradient" : ""
						}`}
						onClick={() => setComingSoon(true)}>
						<NavIcon
							type="staking"
							filled={isSelected("/staking")}
							className="size-7"
						/>
						<SectionName
							isSelected={isSelected("/staking")}
							text="Staking"
						/>
					</a>
					<Link 
						to="/leaderboard"
						className={clsx(aTagStyle, isSelected("/leaderboard") && "bg-main-gradient")}
					>
						<NavIcon
							type="leaderboard"
							filled={isSelected("/leaderboard")}
							className="size-7"
						/>
						<SectionName
							text="Leaderboard"
							isSelected={isSelected("/leaderboard")}
						/>
					</Link>
					<a
						href="/my-profile"
						className={` ${aTagStyle} ${
							isSelected("/my-profile") ? "bg-main-gradient" : ""
						}`}>
						<NavIcon
							type="profile"
							filled={isSelected("/my-profile")}
							className="size-7"
						/>
						<SectionName
							isSelected={isSelected("/my-profile")}
							text="Profile"
						/>
					</a>
				</div>
				<div>
					<div className="flex flex-col gap-2 bg-[#FFFFFF0F] p-4 mb-4 rounded-xl">
						<h1 className="text-2xl font-semibold">
							Chat Now
						</h1>
						<p>Find Your Perfect Match And Enjoy Immersive Messaging, And Pictures 24/7</p>
						<ButtonPrimary className="inline-flex justify-center items-center gap-2" onClick={() => navigate("/explore")}>
							<img src={twinkleIcon} />
							Chat Now
						</ButtonPrimary>
					</div>
					<div className="flex justify-center items-center text-center gap-3">
						<a
							className="flex items-center  bg-white/5 rounded-xl py-3 px-4 w-full">
							<img src={telegramIcon} />
						</a>
						<a
							className="flex items-center  bg-white/5 rounded-xl py-3 px-4 w-full">
							<img src={instagramIcon} />
						</a>
						<a
							
							className="flex items-center bg-white/5 rounded-xl py-3 px-4 w-full">
							<img src={twitterIcon} />
						</a>
						<a
							className="flex items-center bg-white/5 rounded-xl py-3 px-4 w-full">
							<img src={emailIcon} />
						</a>
					</div>
				</div>
			</motion.aside>
		</>
	);
}

export default LeftSidePanel;
