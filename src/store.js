import { useContext, createContext, useState } from "react";

export const ViewMode = {
  DIFF: 0,
  NEW: 1,
  OLD: 2
};

const ModeContext = createContext(ViewMode.DIFF);
export const useModeContext = () => useContext(ModeContext);
export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState(ViewMode.DIFF);
  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};
