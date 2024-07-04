import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import crossIcon from "../../assets/icons/cross.svg";
import { PropsWithChildren } from "react";

interface PopupProps {
	show: boolean;
	close?: () => void;
	imageUrl?: string;
	className?: string;
}

export default function Popup ({ show, imageUrl, children, close, className }: PropsWithChildren<PopupProps>) {
	return (
		<div
			className={twMerge(
				clsx(
					"fixed hidden w-screen h-screen backdrop-blur-md left-0 top-0 justify-center items-center z-50",
					show && "flex"
				)
			)}>
			<div className={clsx("relative flex flex-col rounded-3xl w-3/4 h-2/3 md:w-1/3 bg-[#181818]", className)}>
				{close && (
					<button
						onClick={close}
						className="absolute top-2 right-2 md:top-4 md:right-4 z-30 p-1 md:p-2 rounded-full focus:outline-none">
						<img
							src={crossIcon}
							alt="Close"
							className="w-4 h-4 md:w-6 md:h-6"
						/>
					</button>
				)}
				{imageUrl && (
					<div className="w-full h-1/2 md:h-2/3 overflow-hidden">
						<img
							src={imageUrl}
							alt="Model Image"
							className="rounded-t-lg w-full h-full object-cover object-top"
						/>
					</div>
				)}
				<div className="flex flex-col rounded-lg p-6 items-center gap-4">
					{children}
				</div>
			</div>
		</div>
	);
}