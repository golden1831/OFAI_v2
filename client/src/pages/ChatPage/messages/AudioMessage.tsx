import { PropsWithChildren, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import playIcon from "../../../assets/icons/chat/play.svg";
import pauseIcon from "../../../assets/icons/chat/pause.svg";
import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import { formatTimeAgo } from "../../../lib/formatTimeAgo";

type WaveSurferOptions = {
	container: string | HTMLElement;
	waveColor: string;
	progressColor: string;
	cursorColor: string;
	barWidth: number;
	barRadius: number;
	responsive: boolean;
	height: number | "auto";
	partialRender: boolean;
	justify: string;
	xhr: {
		cache: string;
		mode: string;
		method: string;
		credentials: string;
		redirect: string;
		referrerPolicy: string;
	};
};

interface AudioPlayerProps {
	soundPath: string;
	className?: string
}

interface PlaySoundProps extends AudioPlayerProps{
	createdAt: string;
}

export function AudioPlayer({ children, soundPath, className }: PropsWithChildren<AudioPlayerProps>) {
	const waveformRef = useRef<HTMLDivElement>(null);
	const globalRef = useRef<HTMLDivElement>(null);
	const wavesurfer = useRef<WaveSurfer | null>(null);
	const [playing, setPlaying] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [audioDuration, setAudioDuration] = useState(0);

	const formWaveSurferOptions = (
		ref: React.RefObject<HTMLDivElement>
	): WaveSurferOptions => ({
		container: ref.current!,
		waveColor: "rgba(255, 200, 241, 0.8)",
		progressColor: "white",
		cursorColor: "#ffffff00",
		barWidth: 3,
		barRadius: 3,
		responsive: false,
		height: "auto",
		partialRender: true,
		justify: "center",
		xhr: {
			cache: "default",
			mode: "cors",
			method: "GET",
			credentials: "same-origin",
			redirect: "follow",
			referrerPolicy: "no-referrer",
		},
	});

	const create = async () => {
		wavesurfer.current = WaveSurfer.create(formWaveSurferOptions(waveformRef));

		const fetchAudio = async (retryCount = 0) => {
			try {
				await wavesurfer.current?.load(soundPath);
			} catch (error) {
				console.error("Error fetching or processing the audio file:", error);
				if (retryCount < 10) {
					setTimeout(() => fetchAudio(retryCount + 1), 200); // retry after 1 second
				}
			}
		};

		fetchAudio();

		wavesurfer.current?.on("ready", () => {
			const duration = wavesurfer.current?.getDuration();
			setAudioDuration(duration || 0);
		});
	};

	const handlePlayPause = () => {
		if (playing === true && wavesurfer.current) {
			setPlaying(false);
			wavesurfer.current.playPause();
		} else if (playing === false) {
			setPlaying(true);
			wavesurfer.current?.play();
			wavesurfer.current?.on("finish", () => {
				setPlaying(false);
				wavesurfer.current?.stop();
			});
		}
	};

	useEffect(() => {
		setIsMounted(() => true);
	}, []);

	useEffect(() => {
		if (!isMounted) return;
		create();
		return () => {
			if (wavesurfer.current) {
				wavesurfer.current.destroy();
			}
		};
	}, [isMounted]);

	return (
		<div
			className={clsx("py-2 px-3 bg-[#56265066] backdrop-blur-lg rounded-xl border-white flex items-center w-full h-20 flex-row gap-2 justify-center text-bold max-w-[300px] opacity-0 fadesIn", className)}
			ref={globalRef}>
			<div
				className={`h-full flex justify-center text-4xl items-center text-white ${
					playing ? "text-white" : "text-white"
				} cursor-pointer`}
				onClick={handlePlayPause}>
				<div className="flex justify-center items-center bg-main-gradient p-2 rounded-full w-14 h-14">
					<img
						src={playing ? pauseIcon : playIcon}
						className="size-5"
					/>
				</div>
			</div>
			<div
				id="waveform"
				ref={waveformRef}
				className="w-full h-[42px] text-pink ml-1"
			/>
			<div className="flex flex-row w-full justify-between gap-1 absolute bottom-[0px] right-[4px] font-normal text-[14px] text-[#FFFFFF99]">
				{audioDuration > 0 && (
					<div className="ml-20">
						{Math.floor(audioDuration / 60)}:
						{Math.floor(audioDuration % 60)
							.toString()
							.padStart(2, "0")}
					</div>
				)}
				
				{children}
			</div>
		</div>
	)
}

export default function AudioMessage({
	soundPath,
	createdAt,
}: PlaySoundProps) {
	const formattedTime = formatTimeAgo(Date.parse(createdAt));

	return (
		<AudioPlayer 
			soundPath={soundPath}
			className="sm:ml-9"
		>
			<div className="flex flex-row items-center gap-1 font-normal">
				{formattedTime}

				<Icon
					icon="ci:check-all"
					className="size-6 items-end"
				/>
			</div>
		</AudioPlayer>
	);
}
