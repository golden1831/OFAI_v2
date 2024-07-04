import React, { createContext, useState, useContext } from 'react';

// Define the context
const ComingSoonContext = createContext<{
  comingSoon: boolean;
  setComingSoon: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  comingSoon: false,
  setComingSoon: () => {},
});

// Define the provider
export const ComingSoonProvider = ({ children }: {children: React.ReactNode}) => {
  const [comingSoon, setComingSoon] = useState(false);

  return (
    <ComingSoonContext.Provider value={{ comingSoon, setComingSoon }}>
      {children}
    </ComingSoonContext.Provider>
  );
};

// Define a hook for easy access to the context
export const useComingSoon = () => useContext(ComingSoonContext);