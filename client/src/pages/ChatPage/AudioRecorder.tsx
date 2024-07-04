import { useReactMediaRecorder } from 'react-media-recorder';
import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import axios from 'axios';
import { MessageType } from '../../lib/types';

interface AudioRecorderProps {
  user: any;
  companion: any;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}

const AudioRecorder = ({ setMessages, companion, user }: AudioRecorderProps) => {
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
  });

  useEffect(() => {
    if (!mediaBlobUrl) return;

    const sendAudio = async () => {
      try {
        const path = `${import.meta.env.VITE_API_URL}/chat/audio`;
        const res = await axios.post(path, {
          data: {
            userid: user.id,
            companionid: companion?.id,
            audio: mediaBlobUrl,
          },
        });
        const data = res.data;
        setMessages((prev: any) => {
          const index = prev.findIndex((message: any) => message.contenttype === 'Loading');
          prev[index] = {
            id: data.id,
            companionId: data.companionId,
            content: data.content,
            contenttype: data.contenttype,
            createdAt: data.createdAt,
            role: data.role,
            voicecontenturl: data.voicecontenturl,
            senderName: companion!.firstName,
            senderImage: companion!.image.url,
          };
          return prev;
        });
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    sendAudio();
  }, [mediaBlobUrl]);

  return (
    <>
      {status === 'idle' && (
        <button onClick={startRecording}>
          <Icon icon="bi:mic" className="size-[20px] m-1" />
        </button>
      )}

      {status === 'recording' && (
        <button
          onClick={() => {
            stopRecording();
          }}
        >
          <Icon icon="bi:mic" className="size-[20px] m-1 text-[#FF00BF]" />
        </button>
      )}

      {status === 'stopped' && (
        <button onClick={stopRecording}>
          <Icon icon="bi:mic" className="size-[20px] m-1" />
        </button>
      )}
    </>
  );
};
export default AudioRecorder;
