import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

type AppHeaderHeightContextValue = {
  appHeaderHeight: number;
  setAppHeaderHeight: (height: number) => void;
};

const AppHeaderHeightContext = createContext<
  AppHeaderHeightContextValue | undefined
>(undefined);

export function AppHeaderHeightProvider({ children }: PropsWithChildren) {
  const [appHeaderHeight, setAppHeaderHeightState] = useState(0);

  const setAppHeaderHeight = (height: number) => {
    setAppHeaderHeightState(height);
  };

  const contextValue = useMemo(
    () => ({ appHeaderHeight, setAppHeaderHeight }),
    [appHeaderHeight],
  );

  return (
    <AppHeaderHeightContext.Provider value={contextValue}>
      {children}
    </AppHeaderHeightContext.Provider>
  );
}

export function useAppHeaderHeight() {
  const context = useContext(AppHeaderHeightContext);

  if (!context) {
    throw new Error(
      "useAppHeaderHeight must be used within an AppHeaderHeightProvider",
    );
  }

  return context;
}
