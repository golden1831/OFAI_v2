import { ButtonPrimary } from "../utilities/PrimaryButton";
import { useWeb3Auth } from "../../providers/Wallet";
import { useSelector } from "react-redux";
import { pinkGemIcon } from "../../assets/icons/pink";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { editIcon, helpIcon, kingIcon, logoutIcon, userIcon } from "../../assets/icons";
import { useState } from "react";
import AddGemsPopup from "./AddGemsPopup";
import { RootState } from "../../Navigation/redux/store/store";
import { clsx } from "clsx";
import { profileAvatar } from "../../lib/getProfileAvatar";

export const Login = () => {
	const [showAddGemsPopup, setShowAddGemsPopup] = useState(false);
	const [showProfileDropdown, setShowProfileDropdown] = useState(false);

	const navigate = useNavigate();

	const user = useSelector((state: RootState) => state.user.user);
	const authStatus = useSelector((state: RootState) => state.auth.authStatus);

	const { connect, disconnect } = useWeb3Auth();

	function onNavigate(path: string) {
		navigate(path);

		setShowProfileDropdown(false);
	}

	async function handleDisconnect() {
		await disconnect();

		setShowProfileDropdown(false);
		
		window.location.reload();
	}

	return (
		<>
			{!user || !authStatus ? (
				<div className="flex gap-2 h-full">
					<button
						onClick={connect}
						className="w-24 md:w-28 px-3 py-2 items-center border-2 border-primary-500 rounded-lg font-medium">
						Login
					</button>
					<ButtonPrimary
						onClick={connect}
						className="w-24 md:w-28 px-3 py-2 rounded-lg font-medium">
						Register
					</ButtonPrimary>
				</div>
			) : (
				<div className="flex gap-2 h-full">
					<Link to="/wallet">
						<ButtonPrimary className="text-sm py-2 px-3 rounded-lg font-medium w-fit hidden sm:flex">
							Premium access
						</ButtonPrimary>
					</Link>

					<button 
						type="button"
						onClick={() => setShowAddGemsPopup(true)}
						className="flex gap-2 p-1 pr-3 items-center rounded-lg font-medium text-sm bg-white/5 transition-all duration-300 hover:bg-white/10"
					>
						<span className="p-1 rounded-md bg-white/5">
							<img src={pinkGemIcon} className="size-5" />
						</span>

						{user.gem} gems
					</button>

					<div className="flex flex-col relative">
						<button 
							type="button" 
							onClick={() => setShowProfileDropdown((prev) => !prev)}
							className="relative z-10 flex justify-center border-2 border-primary-500 border-solid rounded-full size-9"
						>
							<img src={profileAvatar(user.profileImage)} alt="" className="aspect-square object-cover rounded-full" />
						</button>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: showProfileDropdown ? 1 : 0, y: showProfileDropdown ? 48 : 20 }}
							className={clsx("bg-[#242423] z-0 absolute right-0 flex flex-col p-4 rounded-lg w-56", showProfileDropdown ? "pointer-events-auto" : "pointer-events-none")}
							transition={{ type: "spring" }}
						>
							<ul className="flex flex-col gap-1">
								<button type="button" onClick={() => onNavigate("/my-profile")}>
									<li className="flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-white/10">
										<img src={userIcon} alt="" className="size-5" />
										Profile
									</li>
								</button>

								<button type="button" onClick={() => onNavigate("/my-profile/edit")}>
									<li className="flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-white/10">
										<img src={editIcon} alt="" className="size-5" />
										Edit Profile
									</li>
								</button>

								<button type="button" onClick={() => onNavigate("/wallet")}>
									<li className="flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-white/10">
										<img src={kingIcon} alt="" className="size-5" />
										Go Premium
									</li>
								</button>

								<a 
									rel="noreferrer" 
									href="mailto:support@ofai.ai" 
									target="_blank" 
									onClick={() => setShowProfileDropdown(false)}
								>
									<li className="flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-white/10">
										<img src={helpIcon} alt="" className="size-5" />
										Support
									</li>
								</a>

								<button type="button" onClick={handleDisconnect}>
									<li className="flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-white/10">
										<img src={logoutIcon} alt="" className="size-5" />
										Logout
									</li>
								</button>
							</ul>
						</motion.div>
					</div>

					<AddGemsPopup show={showAddGemsPopup} onClose={setShowAddGemsPopup} />
				</div>
			)}
		</>
	);
};
