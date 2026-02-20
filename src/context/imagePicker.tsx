import { createContext, useContext, useState } from "react";

type ImagePickerContextType = {
  pendingCallback: ((uri: string) => void) | null;
  setPendingCallback: (cb: ((uri: string) => void) | null) => void;
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
  const [pendingCallback, setPendingCallback] = useState<
    ((uri: string) => void) | null
  >(null);

  return (
    <ImagePickerContext.Provider value={{ pendingCallback, setPendingCallback }}>
      {children}
    </ImagePickerContext.Provider>
  );
}

export function useImagePickerContext() {
  return useContext(ImagePickerContext);
}
