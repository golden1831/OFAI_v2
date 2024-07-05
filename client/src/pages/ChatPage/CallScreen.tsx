import { Dispatch, SetStateAction, useState, useRef } from "react";
import mic from "../../assets/icons/mic.svg";
import { useSendMessageMutation } from "../../Navigation/redux/apis/messageApi";
import { MessageMode } from "../../types/message.types";
import { useWeb3Auth } from "../../providers/Wallet";

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
  const [transcription, setTranscription] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [sendMessageMutation] = useSendMessageMutation();
  const { headers } = useWeb3Auth();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
                setTranscription(transcript);
                await sendTranscriptToBackend(transcript);
              }
            } catch (error) {
              console.error("Error transcribing audio:", error);
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

  const micAnimationStyle = isRecording || isPlaying ? { animation: "bob 1s infinite" } : {};

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
        <div className="mic-container" style={styles.micContainer}>
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
          <div>
            <div className="transcription-box" style={styles.transcriptionBox}>
              <p style={styles.transcriptionText}>
                {transcription ? transcription : "Hii, say something"}
              </p>
            </div>
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
    left: "0",
    right: "0",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    background: "rgba(0,0,0,0)",
    border: "none",
    borderRadius: "30px",
    padding: "5px 10px 5px 10px",
  },
  micButton: {
    border: "none",
    borderRadius: "20px",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundImage: `url(${mic})`,
    backgroundSize: "fit",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    cursor: 'pointer',
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
    cursor: 'pointer',
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
