import LoadingOverlay from "@/components/common/loading-overlay";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ShowLoadingOptions = {
  message?: string;
  onCancel?: () => void;
  cancelLabel?: string;
};

const DEFAULT_HIDE_DELAY_MS = 500;

type LoadingOverlayContextValue = {
  show: (options?: ShowLoadingOptions) => void;
  hide: (delayMs?: number) => void;
};

const LoadingOverlayContext = createContext<
  LoadingOverlayContextValue | undefined
>(undefined);

export function LoadingOverlayProvider({ children }: PropsWithChildren) {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ShowLoadingOptions>({});
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingHide = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const show = useCallback(
    (opts: ShowLoadingOptions = {}) => {
      clearPendingHide();
      setOptions(opts);
      setVisible(true);
    },
    [clearPendingHide],
  );

  const hide = useCallback(
    (delayMs: number = DEFAULT_HIDE_DELAY_MS) => {
      clearPendingHide();

      if (delayMs <= 0) {
        setVisible(false);
        return;
      }

      hideTimeoutRef.current = setTimeout(() => {
        setVisible(false);
        hideTimeoutRef.current = null;
      }, delayMs);
    },
    [clearPendingHide],
  );

  useEffect(() => clearPendingHide, [clearPendingHide]);

  const contextValue = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <LoadingOverlayContext.Provider value={contextValue}>
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
