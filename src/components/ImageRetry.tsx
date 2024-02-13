import { useState } from "react";
import {
  Image,
  ImageErrorEventData,
  ImageProps,
  NativeSyntheticEvent,
} from "react-native";

export default function ImageRetry({ onError, ...restProps }: ImageProps) {
  const [retries, setRetries] = useState(0);

  const onImageError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
    if (retries < 5) {
      setRetries((prev) => prev + 1);
    } else {
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <Image key={`image-${retries}`} onError={onImageError} {...restProps} />
  );
}
