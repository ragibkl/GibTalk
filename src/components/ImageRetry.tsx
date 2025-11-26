import { useState } from "react";
import {
  Image,
  ImageErrorEvent,
  ImageProps,
} from "react-native";

export default function ImageRetry({ onError, ...restProps }: ImageProps) {
  const [retries, setRetries] = useState(0);

  const onImageError = (error: ImageErrorEvent) => {
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
