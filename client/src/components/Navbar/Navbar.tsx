import Logo from "../../components/Logo";
import { Login } from "./Login";
import LeftSidePanel from "../LeftSidePanel";
import { useState } from "react";
import hamburgerIcon from "../../assets/icons/hamburger.svg";

function Navbar({ isLarge }: { isLarge: boolean }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div>
					<nav
						className={`flex w-full fixed z-50 top-0 min-h-[auto] bg-primary-grey clear-backdrop`}>
						<div className="flex h-[65px] items-center justify-between w-full gap-0 border-b-2  border-[#242423] px-2">
							{!isLarge && (
								<div className="justify-center w-6 h-6 flex items-center ml-3 mr-3 cursor-pointer">
									<img
									className="w-full h-full"
									src={hamburgerIcon}
										onClick={() => setIsOpen(!isOpen)}
									/>
								</div>
							)}
							<div className="flex w-full justify-between items-center">
								<div className="lg:ml-6">
									<Logo />
								</div>

								<div className="mr-1.5 flex justify-center items-center">
									<Login />
								</div>
							</div>
						</div>
					</nav>
					<LeftSidePanel
						isOpen={isLarge ? true : isOpen}
						setIsOpen={setIsOpen}
						blurBackdrop={isLarge ? false : isOpen}
						isLarge={isLarge}
					/>
		</div>
	);
}

export default Navbar;
