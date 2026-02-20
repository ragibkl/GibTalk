import { useImagePickerContext } from "../src/context/imagePicker";
import ImageSearchScreen from "../src/screens/imageSearch/ImageSearchScreen";

export default function SearchImageRoute() {
  const { pendingCallback, setPendingCallback } = useImagePickerContext();

  const onUpdateUri = (uri: string) => {
    pendingCallback?.(uri);
    setPendingCallback(null);
  };

  return <ImageSearchScreen onUpdateUri={onUpdateUri} />;
}
