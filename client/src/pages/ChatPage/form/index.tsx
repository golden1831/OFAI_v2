import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import { imageIcon, twinkleIcon } from "../../../assets/icons";
import {
  voiceIcon,
  chat2Icon,
  pinkMicrophoneIcon,
} from "../../../assets/icons/pink";
import { Icon } from "@iconify/react/dist/iconify.js";
import BubblesFormFooter from "./BubblesFormFooter";
import { MessageMode } from "../../../types/message.types";
import { clsx } from "clsx";
import CallScreen from "../CallScreen"; // Import the CallScreen component

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
}: FormProps) {
  const InputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [showCallScreen, setShowCallScreen] = useState(false); // State to manage the call screen visibility

  const userIsTyping = messageContent !== "";

  const clearInput = () => {
    if (InputRef.current) {
      InputRef.current.value = "";
    }
  };

  const handleMicPress = async () => {
    setShowCallScreen(true); // Show the call screen when the mic button is pressed

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support audio recording");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const audioBlob = event.data;
          const formData = new FormData();
          formData.append("file", audioBlob);

          try {
            const response = await fetch("https://api.deepgram.com/v1/listen", {
              method: "POST",
              headers: {
                Authorization: `Token ${import.meta.env.VITE_DEEPGRAM_API_KEY}`,
              },
              body: formData,
            });

            const result = await response.json();
            console.log(result);
            const transcript =
              result.results.channels[0].alternatives[0].transcript;
            if (transcript) {
              onSubmit(undefined, transcript);
            }
          } catch (error) {
            console.error("Error transcribing audio:", error);
          }
        }
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      console.log("Recording started");
    } catch (error) {
      console.error("Microphone access denied", error);
    }
  };

  const handleMicRelease = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
      console.log("Recording stopped");
    }
  };

  return (
    <>
      {showCallScreen && (
        <CallScreen
          profileImage="path/to/profileImage" // Replace with actual path or prop
          profileName="Profile Name" // Replace with actual name or prop
          onClose={() => setShowCallScreen(false)}
        />
      )}

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

          {mode === MessageMode.audio && (
            <div
              className={clsx(
                "h-full rounded-r-full relative flex justify-center items-center p-1 bg-transparent",
                { "animate-pulse": isRecording }
              )}
              onMouseDown={() => setIsCalling(true)}
            >
              <img
                src={pinkMicrophoneIcon}
                className={clsx(
                  "ml-2 mr-1.5 cursor-pointer transition-transform duration-200",
                  {
                    "size-7": isRecording,
                    "size-5": !isRecording,
                  }
                )}
              />
            </div>
          )}

          <div className="h-full rounded-r-full relative flex justify-center items-center p-1 bg-transparent">
            {!userIsTyping ? (
              <div className="flex p-2.5 items-center justify-center rounded-full transition-all ease-in-out duration-150">
                <img
                  src={togglePicOptions ? twinkleIcon : imageIcon}
                  onClick={() => setTogglePicOptions((prev) => !prev)}
                  className="size-5 ml-2 mr-1.5 cursor-pointer"
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
