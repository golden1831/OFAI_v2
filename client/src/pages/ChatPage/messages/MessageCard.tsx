import { Dispatch, SetStateAction, useCallback } from "react";
import { Icon } from "@iconify/react";
import { MessageType as MessageTypeEnum, RoleType } from "../../../types/message.types";
import { eyeIcon, playIcon } from "../../../assets/icons";
import { AudioPlayer } from "./AudioMessage";
import { pinkGemIcon } from "../../../assets/icons/pink";
import { useUnlockPicMutation, useUnlockVideoMutation } from "../../../Navigation/redux/apis/messageApi";
import { useWeb3Auth } from "../../../providers/Wallet";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import { formatTimeAgo } from "../../../lib/formatTimeAgo";
import { useLazyGetMeQuery, useLazyGetMyGalleryQuery } from "../../../Navigation/redux/apis/userApi";
import { clsx } from "clsx";
import StyledText from "./StyledText";
import { IMessageChat } from "../types";

export type SelectedMedia = {
	type: "image" | "video";
	media: string;
}

interface MessageCardProps {
	userId: string;
	message: IMessageChat;
	setMessages: Dispatch<SetStateAction<IMessageChat[]>>;
	onSelectedMedia: (params: SelectedMedia) => void;
	messageIdReceveid: string | null;
}

const bubbleStyle = "word-wrap-break min-w-20 whitespace-break-spaces relative p-3 pb-2 rounded-2xl md:max-w-md border-white text-white bg-[#56265066] backdrop-blur-lg opacity-0 fadesIn"

export const MessageCard = ({
	message,
	setMessages,
	onSelectedMedia,
	messageIdReceveid,
}: MessageCardProps) => {
	const {
		id,
		type,
		role,
		message: content,
		voicecontenturl,
	} = message;

	const { headers } = useWeb3Auth()

	const isTextStreaming = messageIdReceveid === message.id;

	const [refetchUser] = useLazyGetMeQuery()
	const [refetchGallery] = useLazyGetMyGalleryQuery()
	
	const [unlockPic, { isLoading: unlockPicLoading }] = useUnlockPicMutation();
	const [unlockVideo, { isLoading: unlockVideoLoading }] = useUnlockVideoMutation();

	const onUnlockAttachment = async () => {
		const isPicture = type === MessageTypeEnum.picture

		const onRequest = isPicture
			? unlockPic
			: unlockVideo

		await onRequest({ 
			headers,
			messageId: message.id,
		})
			.unwrap()
			.then(async (response) => {
				setMessages((prev) => {
					return prev.map((currMessage) => currMessage.id === id 
						? { 
							...currMessage, 
							image: isPicture && response.image ? response.image : "",
							videoUrl: !isPicture && response.videoUrl ? response.videoUrl : "",
							imageLock: false,
							videoLock: false,
						} 
						: currMessage)
				})

				await refetchUser({ headers })
				await refetchGallery({ headers })
			})
			.catch((err) => {
				const error = err as FetchBaseQueryError & {
					data: {
						message: string
					}
				}

				toast.error(error.data?.message ?? "Error unlocking image")
			});
	}

	const blurredImageURL = `${import.meta.env.VITE_API_URL}/rooms/messages/${message.id}/pic`
	const blurredVideoURL = `${import.meta.env.VITE_API_URL}/rooms/messages/${message.id}/video`

	const Time = useCallback(() => {
		const formattedTime = formatTimeAgo(Date.parse(message.createdAt));

		return (
			<p className="flex items-center float-right ml-auto gap-1 font-normal text-sm text-white/60">
				{formattedTime}

				<Icon
					icon="ci:check-all"
					className="size-6  items-end"
				/>
			</p>
		)
	}, [message.createdAt])

	if (role === RoleType.assistant) {
		return (
			<div className="flex flex-col gap-2 max-w-[90%] items-start justify-start sm:ml-9">
				{voicecontenturl && <AudioPlayer soundPath={voicecontenturl as string} />}

				{type === MessageTypeEnum.message && (
					<div className={clsx("flex flex-col", bubbleStyle)}>
						<span className="font-normal break-words text-white">
							<StyledText text={content} isTextStreaming={isTextStreaming} />
						</span>
						
						<Time />
					</div>
				)}

				{[MessageTypeEnum.video, MessageTypeEnum.picture].includes(type) && (
					<>
						{!voicecontenturl &&(
							<div className={bubbleStyle}>
								<StyledText text={content} isTextStreaming={isTextStreaming} />
		
								<Time />
							</div>
						)}
		
						<div className={clsx("flex flex-col relative items-center justify-center overflow-hidden", bubbleStyle)}>
							{type === MessageTypeEnum.picture && (
								<img
									src={message.imageLock ? blurredImageURL : message.image as string}
									alt=""
									onClick={() => onSelectedMedia({ type: "image", media: message.image as string })}
									className="rounded-xl h-full cursor-pointer max-h-64 object-contain object-left md:max-h-80"
								/>
							)}
		
							{type === MessageTypeEnum.video && (
								<>
									{!message.videoLock && (
										<>
											<video 
												onClick={() => onSelectedMedia({ type: "video", media: message.videoUrl as string })}
												className="rounded-xl max-h-64 object-left md:max-h-80"
											>
												<source 
													src={message.videoUrl as string} 
													type="video/mp4" 
												/>
											</video>
		
											<button className="absolute flex pointer-events-none">
												<img src={playIcon} alt="" className="size-12" />
											</button>
										</>
									)}
		
									{message.videoLock && (
										<video className="rounded-xl max-h-64 object-left md:max-h-80">
											<source 
												src={blurredVideoURL} 
												type="video/mp4" 
											/>
										</video>
									)}
								</>
							)}
		
							{(message.imageLock || message.videoLock) && (
								<button
									onClick={onUnlockAttachment}
									className="absolute flex items-center justify-center top-0 cursor-pointer rounded-xl left-0 size-full bg-white/20 backdrop-blur-md"
								>
									{(unlockPicLoading || unlockVideoLoading) && <LoadingSpinner />}
		
									{(!unlockPicLoading && !unlockVideoLoading) && (
										<div className="flex flex-col items-center gap-1">
											<p>Tap to unlock</p>
		
											<img src={eyeIcon} alt="" />
		
											<p className="flex items-center gap-1">
												<img src={pinkGemIcon} alt="" className="size-4" />
												{type === MessageTypeEnum.video ? 200 : 30} GEMS
											</p>
										</div>
									)}
								</button>
							)}
						</div>
					</>
				)}
			</div>
		)
	}

	return (
		<div className="mt-3 w-fit flex flex-col ml-auto relative max-w-[90%] px-3 py-2 rounded-2xl md:px-4 md:pt-3 md:pb-2 md:max-w-md bg-black/30 border-white text-white backdrop-blur-lg opacity-0 fadesIn">
			<span className="break-words font-normal text-white word-wrap-break whitespace-break-spaces">
				{message.message}
			</span>
			
			<Time />
		</div>
	);
};
