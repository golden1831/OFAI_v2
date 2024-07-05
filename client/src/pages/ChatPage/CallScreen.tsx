import { Dispatch, SetStateAction, useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { pinkMicrophoneIcon } from '../../assets/icons/pink';
import { useSendMessageMutation } from '../../Navigation/redux/apis/messageApi';
import { MessageMode } from '../../types/message.types';
import { useWeb3Auth } from '../../providers/Wallet';
import { Helmet } from 'react-helmet';

interface CallScreenProps {
  profileImage: string;
  profileName: string;
  modelId: string;
  setIsCalling: Dispatch<SetStateAction<boolean>>;
}

export default function CallScreen({ profileImage, profileName, modelId, setIsCalling }: CallScreenProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [sendMessageMutation] = useSendMessageMutation();
  const { headers } = useWeb3Auth();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleMicPress = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            const audioBlob = event.data;
            const formData = new FormData();
            formData.append('file', audioBlob);

            try {
              const response = await fetch('https://api.deepgram.com/v1/listen', {
                method: 'POST',
                headers: {
                  Authorization: `Token ${import.meta.env.VITE_DEEPGRAM_API_KEY}`,
                },
                body: formData,
              });

              const result = await response.json();
              console.log(result);
              const transcript = result.results.channels[0].alternatives[0].transcript;
              if (transcript) {
                setTranscription(transcript);
                await sendTranscriptToBackend(transcript);
              }
            } catch (error) {
              console.error('Error transcribing audio:', error);
            }
          }
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
        console.log('Recording started');
      } catch (error) {
        console.error('Microphone access denied or not supported', error);
        alert('Microphone access denied or not supported');
      }
    } else {
      handleMicRelease();
    }
  };

  const handleMicRelease = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('Recording stopped');
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
      console.error('Error sending transcript to backend:', error);
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

  const audioPlayAnimation = () => {
    return isPlaying ? { animation: 'bob 1s infinite' } : {};
  };

  return (
    <div className="call-screen-container" style={styles.callScreenContainer}>
      <div className="call-screen-header" style={styles.callScreenHeader}>
        Audio chat with {profileName}
      </div>
      <div className="call-screen-body" style={styles.callScreenBody}>
        <img
          src={profileImage}
          alt={profileName}
          style={{ ...styles.profileImage, ...audioPlayAnimation() }}
        />
        <div className="mic-container" style={styles.micContainer}>
          <button
            className="mic-button"
            style={{
              ...styles.micButton,
              backgroundColor: isRecording ? 'red' : '#fff',
              animation: isRecording ? 'bob 1s infinite' : 'none',
            }}
            onClick={handleMicPress}
          >
            <Icon icon={pinkMicrophoneIcon} style={styles.pinkMicrophoneIcon} />
          </button>
          <p style={styles.micText}>
            {isRecording ? 'Tap to stop speaking' : 'Tap to speak'}
          </p>
        </div>
        <button
        className="end-call-button"
        style={styles.endCallButton}
        onMouseDown={() => setIsCalling(false)}
      >
        End Call
      </button>
      </div>
     
    </div>
  );
}

const styles = {
  callScreenContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    width: '80%',
    height: '100%',
    backgroundColor: '#6a1b9a',
    color: '#fff',
    padding: '20px',
    borderRadius: '10px',
  },
  callScreenHeader: {
    fontSize: '1.2em',
    fontWeight: 'bold' as const,
  },
  callScreenBody: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
  },
  profileImage: {
    width: 'auto',
    height: '27%',
    borderRadius: '50%',
    marginBottom: '20px',
    objectFit: 'cover',
  },
  micContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
  },
  micButton: {
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: '10px',
  },
  pinkMicrophoneIcon: {
    fontSize: '2em',
    color: '#6a1b9a',
  },
  micText: {
    fontSize: '0.9em',
  },
  endCallButton: {
    backgroundColor: 'red',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    fontSize: '1em',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

// Add CSS keyframes for bob animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes bob {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`, styleSheet.cssRules.length);
