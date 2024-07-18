import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import { imageIcon, twinkleIcon } from "../../../assets/icons";
import { voiceIcon, chat2Icon } from "../../../assets/icons/pink";
import mic from "../../../assets/icons/mic.svg";
import videoIcon from "../../../assets/icons/chat/video.svg";
import { Icon } from "@iconify/react/dist/iconify.js";
import BubblesFormFooter from "./BubblesFormFooter";
import { MessageMode } from "../../../types/message.types";
import { clsx } from "clsx";

interface FormProps {
  mode: string;
  setMode: Dispatch<SetStateAction<MessageMode>>;
  onSubmit: (e?: FormEvent<Element>, textMessage?: string) => void;
  isloading: boolean;
  isResponding: boolean;
  messageContent: string;
  togglePicOptions: boolean;
  setMessageContent: (newMessage: string) => void;
  setTogglePicOptions: Dispatch<SetStateAction<boolean>>;
  setIsCalling: Dispatch<SetStateAction<boolean>>;
  setIsVideoCalling: Dispatch<SetStateAction<boolean>>;
  streamRef: React.MutableRefObject<MediaStream | null>;
}

export default function Form({
  mode,
  setMode,
  onSubmit,
  isloading,
  isResponding,
  messageContent,
  togglePicOptions,
  setMessageContent,
  setTogglePicOptions,
  setIsCalling,
  setIsVideoCalling,
  streamRef,
}: FormProps) {
  const InputRef = useRef<HTMLInputElement>(null);
  const [hasMicPermission, setHasMicPermission] = useState(false); // State to track mic permission

  const userIsTyping = messageContent !== "";

  const clearInput = () => {
    if (InputRef.current) {
      InputRef.current.value = "";
    }
  };

  const handleMicPress = async () => {
    if (!hasMicPermission) {
      try {
        if (!streamRef.current) {
          streamRef.current = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
        }
        // If the permission is granted, set the flag to true
        setHasMicPermission(true);
      } catch (error) {
        // If permission is denied, show an alert
        alert("Please grant microphone access to start recording.");
        return;
      }
    }

    // Launch the CallScreen only if the permission is granted
    setIsCalling(true);
  };

  const handleVideoPress = async () => {
    if (!hasMicPermission) {
      try {
        if (!streamRef.current) {
          streamRef.current = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
        }

        // If the permission is granted, set the flag to true
        setHasMicPermission(true);
      } catch (error) {
        // If permission is denied, show an alert
        alert("Please grant microphone access to start recording.");
        return;
      }
    }

    // Launch the CallScreen only if the permission is granted
console.log("Video calling")
    setIsVideoCalling(true);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          onSubmit(e);
          clearInput();
        }}
        className={clsx(
          "fixed md:relative flex flex-col px-2 pb-4 gap-2 w-full bg-black/35 backdrop-blur-lg bottom-0 justify-between items-center h-[132px] pt-4 md:pt-5 md:px-5 md:pb-7"
        )}
      >
        {isResponding && (
          <p className="font-medium opacity-0 text-white absolute text-nowrap right-14 animate-fadeInOut">
            +10 XP
          </p>
        )}

        <BubblesFormFooter
          disabled={isloading || isResponding}
          onSelectOption={(option) => onSubmit(undefined, option)}
          isCustomOptions={togglePicOptions}
        />

        <div className="flex bg-primary-500/10 w-full rounded-full items-center relative">
          <div className="cursor-pointer mx-2 p-2 bg-primary-500/10 rounded-full">
            <img
              src={mode === MessageMode.text ? chat2Icon : voiceIcon}
              onClick={() =>
                setMode((prev) =>
                  prev === MessageMode.text
                    ? MessageMode.audio
                    : MessageMode.text
                )
              }
              className="size-6"
            />
          </div>
          <input
            className="bg-transparent h-full w-full flex -mr-2 flex-1 border-none rounded-full bg-neutral-3 py-3 px-2 file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-white placeholder:font-light rounded-r-none focus-visible:ring-0"
            type="text"
            placeholder="Type a message..."
            disabled={isloading || isResponding}
            onChange={(e) => setMessageContent(e.target.value)}
            id="message_input"
            ref={InputRef}
            autoComplete="off"
          />
          <div
            className={clsx(
              "h-full rounded-r-full relative flex justify-center items-center p-1 bg-transparent"
            )}
            onMouseDown={handleMicPress}
          >
            <img
              src={mic}
              className={clsx(
                "ml-1 mr-0.1 cursor-pointer transition-transform duration-200 size-6"
              )}
            />
          </div>
          <div
            className={clsx(
              "h-full rounded-r-full relative flex justify-center items-center p-1 bg-transparent"
            )}
            onMouseDown={handleVideoPress}
          >
            <img
              src={videoIcon}
              className={clsx(
                "ml-1 mr-0.1 cursor-pointer transition-transform duration-200 size-6"
              )}
            />
          </div>
          <div className="h-full rounded-r-full relative flex justify-center items-center p-1 bg-transparent">
            {!userIsTyping ? (
              <div className="flex p-2.5 items-center justify-center rounded-full transition-all ease-in-out duration-150">
                <img
                  src={togglePicOptions ? twinkleIcon : imageIcon}
                  onClick={() => setTogglePicOptions((prev) => !prev)}
                  className="size-5 ml-0.1 mr-1.5 cursor-pointer"
                />
              </div>
            ) : (
              <Icon
                icon="carbon:send-alt-filled"
                className="size-9 cursor-pointer mr-2 bg-main-gradient rounded-full p-[0.3rem] fadesIn"
                onClick={(e) => {
                  onSubmit(e), clearInput();
                }}
              />
            )}
          </div>
        </div>
      </form>
    </>
  );
}
