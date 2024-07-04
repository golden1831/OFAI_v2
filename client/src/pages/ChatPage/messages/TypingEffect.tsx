import { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
}

export default function TypingEffect ({ text, speed }: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex(index + 1);
      }, speed ?? 40);
      return () => clearTimeout(timer);
    }
  }, [index, text, speed]);

  return displayedText;
}