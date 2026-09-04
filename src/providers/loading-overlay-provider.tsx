import LoadingOverlay from "@/components/common/loading-overlay";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";

export type ShowLoadingOptions = {
  message?: string;
  onCancel?: () => void;
  cancelLabel?: string;
};

type LoadingOverlayContextValue = {
  show: (options?: ShowLoadingOptions) => void;
  hide: () => void;
};

const LoadingOverlayContext = createContext<
  LoadingOverlayContextValue | undefined
>(undefined);

export function LoadingOverlayProvider({ children }: PropsWithChildren) {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ShowLoadingOptions>({});

  const show = useCallback((opts: ShowLoadingOptions = {}) => {
    setOptions(opts);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <LoadingOverlayContext.Provider value={{ show, hide }}>
      {children}

      <LoadingOverlay
        visible={visible}
        message={options.message}
        onCancel={options.onCancel}
        cancelLabel={options.cancelLabel}
      />
    </LoadingOverlayContext.Provider>
  );
}

export function useLoadingOverlay() {
  const context = useContext(LoadingOverlayContext);

  if (!context) {
    throw new Error(
      "useLoadingOverlay must be used within a LoadingOverlayProvider",
    );
  }

  return context;
}
