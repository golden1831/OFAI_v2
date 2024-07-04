import { useEffect, useState } from 'react';

interface IStyledText {
  text: string;
  isTextStreaming?: boolean;
}

const pattern = /\*[^*]+\*|[^*]+/g;

const StyledText = ({ text, isTextStreaming = false }: IStyledText) => {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [texts, setTexts] = useState<string[]>(['']);

  const sections = (text.match(pattern) || [])
    .map((section) => section.trim())
    .filter((section) => section)
    .map((section) => (section.startsWith('*') && section.endsWith('*') ? section.slice(0, -1) : section));

  useEffect(() => {
    if (!isTextStreaming) return;

    const typeText = () => {
      if (sectionIndex >= sections.length) return;

      if (charIndex < sections[sectionIndex].length) {
        setTexts(
          texts.map((text, index) => (index === sectionIndex ? text + sections[sectionIndex][charIndex] : text))
        );
        setCharIndex(charIndex + 1);
      } else {
        setCharIndex(0);
        setSectionIndex(sectionIndex + 1);
        setTexts((prev) => [...prev, '']);
      }
    };

    setTimeout(() => typeText(), 30);
  }, [sections, sectionIndex, charIndex, isTextStreaming]);

  return (
    <div>
      {(isTextStreaming ? texts : sections).map((section, index) => {
        if (section.startsWith('*')) {
          return (
            <span key={index} className="break-words font-normal inline text-[#cfcbcb] italic mr-1">
              {section.charAt(1).toUpperCase() + section.slice(2)}
            </span>
          );
        } else {
          return (
            <span className="break-words font-normal inline text-white mr-1" key={index}>
              {section}
            </span>
          );
        }
      })}
    </div>
  );
};

export default StyledText;
