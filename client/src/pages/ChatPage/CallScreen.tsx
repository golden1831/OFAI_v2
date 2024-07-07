import { Dispatch, SetStateAction, useState, useRef } from "react";
import mic from "../../assets/icons/mic.svg";
import { useSendMessageMutation } from "../../Navigation/redux/apis/messageApi";
import { MessageMode } from "../../types/message.types";
import { useWeb3Auth } from "../../providers/Wallet";
import StyledText from "./messages/StyledText";
import { clsx } from "clsx";

interface CallScreenProps {
  profileImage: string;
  profileName: string;
  modelId: string;
  setIsCalling: Dispatch<SetStateAction<boolean>>;
}

export default function CallScreen({
  profileImage,
  profileName,
  modelId,
  setIsCalling,
}: CallScreenProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [content, setContent] = useState("Hii!");
  const [isTyping, setIsTyping] = useState(false);
  const [sendMessageMutation] = useSendMessageMutation();
  const { headers } = useWeb3Auth();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const bubbleStyle =
    "w-full word-wrap-break min-w-20 whitespace-break-spaces relative p-3 pb-2 rounded-2xl md:max-w-md border-white text-white bg-[#56265066] backdrop-blur-lg opacity-0 fadesIn";

  const micContainer = `
    absolute bottom-0 left-1/2 right-0 transform -translate-x-1/2 
    flex flex-col justify-between items-center 
    bg-black/20 border-none rounded-2xl 
    p-2.5 overflow-hidden whitespace-nowrap text-ellipsis 
    w-[80%] 
    md:w-[60%] md:left-1/2 md:transform md:-translate-x-1/2 md:rounded-2xl
  `;

  const handleMicPress = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            const audioBlob = event.data;
            const formData = new FormData();
            formData.append("file", audioBlob);

            try {
              setIsTyping(true); // Set typing status to true
              const response = await fetch(
                "https://api.deepgram.com/v1/listen",
                {
                  method: "POST",
                  headers: {
                    Authorization: `Token ${
                      import.meta.env.VITE_DEEPGRAM_API_KEY
                    }`,
                  },
                  body: formData,
                }
              );

              const result = await response.json();
              console.log(result);
              const transcript =
                result.results.channels[0].alternatives[0].transcript;
              if (transcript) {
                await sendTranscriptToBackend(transcript);
              }
            } catch (error) {
              console.error("Error transcribing audio:", error);
            } finally {
              setIsTyping(false); // Set typing status to false
            }
          }
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
        console.log("Recording started");
      } catch (error) {
        console.error("Microphone access denied or not supported", error);
        alert("Microphone access denied or not supported");
      }
    } else {
      handleMicRelease();
    }
  };

  const handleMicRelease = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("Recording stopped");
    }
  };

  const sendTranscriptToBackend = async (transcript: string) => {
    try {
      const response = await sendMessageMutation({
        companionid: modelId,
        message: transcript,
        mode: MessageMode.audio,
        headers,
      }).unwrap();
      setContent(response.message);
      const audioUrl = response.voicecontenturl; // Assume the backend response includes the audio URL
      if (audioUrl) {
        playAudio(audioUrl);
      }
    } catch (error) {
      console.error("Error sending transcript to backend:", error);
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
    setIsPlaying(true);
    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  const micAnimationStyle =
    isRecording || isPlaying ? { animation: "bob 1s infinite" } : {};

  return (
    <div
      className="call-screen-container"
      style={{
        ...styles.callScreenContainer,
        backgroundImage: `url(${profileImage})`,
      }}
    >
      <div className="topContainer" style={styles.topContainer}>
        <div className="profile-name-bubble" style={styles.profileNameBubble}>
          {profileName}
        </div>
        <div
          className="end-call-button"
          style={styles.endCallButton}
          onMouseDown={() => setIsCalling(false)}
        >
          X
        </div>
      </div>
      <div className="call-screen-body" style={styles.callScreenBody}>
        <div className={clsx(micContainer.trim().split(/\s+/))}>
          <div
            className="mic-button"
            style={{
              ...styles.micButton,
              backgroundColor: isRecording ? "red" : "rgba(0,0,0,0.3)",
              ...micAnimationStyle,
            }}
            onMouseDown={handleMicPress}
            onMouseUp={handleMicRelease}
            onTouchStart={handleMicPress}
            onTouchEnd={handleMicRelease}
          ></div>
          <div className={clsx("flex flex-col", bubbleStyle)}>
            <span className="font-normal break-words text-white">
              {isTyping ? (
                <span>{profileName} is typing...</span>
              ) : (
                <StyledText text={content} isTextStreaming={true} />
              )}
            </span>
          </div>
        </div>
        <div />
      </div>
    </div>
  );
}

const styles = {
  callScreenContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    width: "50%",
    height: "60%",
    backgroundSize: "cover",
    backgroundPosition: "top",
    color: "#fff",
    padding: "20px",
    borderRadius: "10px",
    position: "relative" as const,
  },
  topContainer: {
    display: "flex",
  },
  profileNameBubble: {
    position: "absolute" as const,
    top: "10px",
    left: "10px", // changed from left to right
    padding: "10px 20px",
    borderRadius: "20px",
    fontSize: "1.2em",
    fontWeight: "bold" as const,
    color: "#fff",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
    background: "rgba(0,0,0,0.5)",
  },
  callScreenBody: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center" as const,
    height: "100%",
  },
  micContainer: {
    position: "absolute" as const,
    bottom: "0",
    left: "50%",
    right: "0",
    transform: "translate(-50%)",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    background: "rgba(0,0,0,0.2)",
    border: "none",
    borderRadius: "30px",
    padding: "5px 10px 5px 10px",
    overflow: "hidden" as const,
    whiteSpace: "nowrap" as const,
    textOverflow: "ellipsis" as const,
    width: "auto", // Default width for larger screens
    "@media (max-width: 768px)": {
      width: "100%", // Full width on mobile devices
      left: "0", // Adjust the left position to 0 for mobile
      transform: "none", // Remove translate for mobile
      borderRadius: "0", // Adjust border-radius if needed for mobile
    },
  },
  micButton: {
    border: "none",
    borderRadius: "20px",
    width: "99%",
    height: "7vh",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundImage: `url(${mic})`,
    backgroundSize: "fit",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    cursor: "pointer",
  },
  micText: {
    fontSize: "0.9em",
    marginLeft: "10px",
  },
  endCallButton: {
    position: "absolute" as const,
    top: "10px",
    right: "10px",
    padding: "5px 20px",
    borderRadius: "20px",
    fontSize: "1.6em",
    color: "#fff",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
    background: "rgba(0,0,0,0.5)",
    cursor: "pointer",
  },
  transcriptionBox: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: "10px",
    padding: "10px",
    width: "100%",
    marginTop: "10px",
  },
  transcriptionText: {
    fontSize: "1em",
    color: "#fff",
  },
  //   bubbleStyle: {
  //     wordWrap: "break",
  //     minWidth: "20px",
  //     whitespace: "break-spaces",
  //     position: "relative",
  //     padding: "3px",
  //     paddingBottom: "2px",
  //     borderRadius: "2xl",
  //     maxWidth: "md",
  //     border: "1px solid #fff",
  //     color: "#fff",
  //     backgroundColor: "#56265066",
  //     backdropFilter: "blur-lg",
  //     opacity: 0,
  //     transition: "opacity 0.5s ease-in-out",
  //   },
};

// Add CSS keyframes for bob animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `
  @keyframes bob {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`,
  styleSheet.cssRules.length
);
