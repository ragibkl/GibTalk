import { createContext, useCallback, useContext, useState } from "react";

type Callback = (uri: string) => void;

type ImagePickerContextType = {
  pendingCallback: Callback | null;
  setPendingCallback: (cb: Callback | null) => void;
};

const ImagePickerContext = createContext<ImagePickerContextType>({
  pendingCallback: null,
  setPendingCallback: () => {},
});

export function ImagePickerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pendingCallback, setPendingCallbackState] = useState<Callback | null>(
    null,
  );

  // Wrap the raw useState setter so callers can pass a function directly
  // without worrying about React's functional-updater footgun.
  const setPendingCallback = useCallback((cb: Callback | null) => {
    setPendingCallbackState(() => cb);
  }, []);

  return (
    <ImagePickerContext.Provider value={{ pendingCallback, setPendingCallback }}>
      {children}
    </ImagePickerContext.Provider>
  );
}

export function useImagePickerContext() {
  return useContext(ImagePickerContext);
}
