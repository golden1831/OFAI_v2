import { Dispatch, SetStateAction, useState, useRef } from "react";
import mic from "../../assets/icons/mic.svg";
import replay from "../../assets/icons/replay.svg";
import { useSendMessageMutation } from "../../Navigation/redux/apis/messageApi";
import { MessageMode } from "../../types/message.types";
import { useWeb3Auth } from "../../providers/Wallet";
import { pinkMicrophoneIcon } from "../../assets/icons/pink";
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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [sendMessageMutation] = useSendMessageMutation();
  const { headers } = useWeb3Auth();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const micContainer = `
  absolute bottom-0 left-1/2 right-0 transform -translate-x-1/2 
  flex flex-col justify-between items-center border-none rounded-2xl 
  p-2.5 overflow-hidden whitespace-nowrap text-ellipsis 
  w-[80%] 
  md:w-[50%] md:left-1/2 md:transform md:-translate-x-1/2 md:rounded-2xl
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
        setAudioUrl(audioUrl);
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

  const replayAudio = () => {
    if (audioUrl) {
      playAudio(audioUrl);
    }
  };

  const micAnimationStyle =
    isRecording || isPlaying ? { animation: "bob 1s infinite" } : {};

  return (
    <div
      className={clsx("flex flex-col items-center justify-center h-[65%] bg-cover bg-top text-white p-5 rounded-lg relative w-[85%] md:w-[40%] md:h-[75%]")}
      style={{
        backgroundImage: `url(${profileImage})`,
      }}
    >
      <div className="topContainer" style={styles.topContainer}>
      <div className="profile-name-bubble" style={styles.profileNameBubble}>
          <img
            src={profileImage}
            alt="profile"
            style={styles.profileImage}
          />
          <span>{profileName}</span>
          <div style={styles.tick} />
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
              backgroundColor: isRecording || isPlaying ? "transparent" : "rgba(0,0,0,0.3)",
              backgroundImage: isRecording || isPlaying ? "linear-gradient(90deg, #BB38DC 0%, #FF00BF 100%)" : "none",
              ...micAnimationStyle,
            }}
            onClick={handleMicPress}
          >
            <img
              src={pinkMicrophoneIcon}
              alt="mic"
              style={styles.micIcon}
            />
          </div>
          <div className={clsx("flex flex-col")}>
            <span className={clsx("font-normal break-words text-white")}>
              {isTyping ? (
                <span>{profileName} is recording...</span>
              ) : (
                <span>{isRecording ? "Tap to stop recording." : "Tap to start recording."}</span>
              )}
            </span>
          </div>
        </div>
        <div
          className="replay-button"
          style={styles.replayButton}
          onClick={replayAudio}
        ></div>
        <div />
      </div>
    </div>
  );
}
    
    const styles = {
      // callScreenContainer: {
      //   display: "flex",
      //   flexDirection: "column" as const,
      //   alignItems: "center" as const,
      //   justifyContent: "center" as const,
      //   width: "50%", // Default width for desktop
      //   height: "60%",
      //   backgroundSize: "cover",
      //   backgroundPosition: "top",
      //   color: "#fff",
      //   padding: "20px",
      //   borderRadius: "10px",
      //   position: "relative" as const,
      //   '@media (max-width: 768px)': { // Media query for mobile devices
      //     width: "90%", // Adjusted width for mobile
      //   },
      // },
      topContainer: {
        display: "flex",
      },
      profileNameBubble: {
        position: "absolute" as const,
        top: "10px",
        left: "10px",
        padding: "7px 10px",
        borderRadius: "20px",
        fontSize: "1em",
        fontWeight: "200",
        color: "#fff",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        '@media (max-width: 768px)': { // Media query for mobile devices
          width: "80%", // Adjusted width for mobile
        },
      },
      callScreenBody: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center" as const,
        height: "100%",
      },
      profileImage: {
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        marginRight: "2px",
      },
      tick: {
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundImage: "linear-gradient(90deg, #BB38DC 0%, #FF00BF 100%)",
        marginLeft: "10px",
      },
      micButton: {
        border: "none",
        borderRadius: "50%", // Add this line
        width: "70px",
        height: "70px",
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${mic})`,
        backgroundSize: "fit",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        cursor: "pointer",
      },
      micIcon: {
        width: "40%",
        height: "40%",
        objectFit: "contain" as const,
      },
      micText: {
        fontSize: "0.9em",
        marginLeft: "10px",
      },
      endCallButton: {
        position: "absolute" as const,
        top: "10px",
        right: "10px",
        width: "40px", // Make it a circle
        height: "40px", // Make it a circle
        padding: "0", // Remove padding to avoid affecting the shape
        borderRadius: "20px", // Full circle
        fontSize: "1.3em",
        fontWeight: "300",
        color: "#fff",
        // boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
        background: "rgba(0,0,0,0.1)",
        display: "flex", // Use flexbox to center the text
        alignItems: "center", // Center vertically
        justifyContent: "center", // Center horizontally
        cursor: "pointer",
        '@media (max-width: 768px)': { // Media query for mobile devices
          width: "40px", // Adjusted width for mobile
          height: "40px", // Adjusted height for mobile
        },
      },      
      replayButton: {
        position: "absolute" as const,
        bottom: "10px",
        right: "10px",
        border: "none",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${replay})`,
        backgroundSize: "fit",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
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
      }
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
    
  