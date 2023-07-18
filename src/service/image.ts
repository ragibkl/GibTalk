import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import uuid from "react-native-uuid";

export async function base64ImageFromFile(fileUri: string): Promise<string> {
  const imageRes = await ImageManipulator.manipulateAsync(
    fileUri,
    [{ resize: { width: 200, height: 200 } }],
    { base64: true, format: ImageManipulator.SaveFormat.PNG },
  );

  return `data:image/xxx;base64,${imageRes.base64}`;
}

export async function base64ImageFromHttp(uri: string): Promise<string> {
  const fileUri = `${FileSystem.cacheDirectory}/${uuid.v4()}.temp`;
  await FileSystem.downloadAsync(uri, fileUri);

  return base64ImageFromFile(fileUri);
}

export async function base64Image(uri: string): Promise<string> {
  if (uri.startsWith("file")) {
    return base64ImageFromFile(uri);
  }

  if (uri.startsWith("http")) {
    return base64ImageFromHttp(uri);
  }

  if (uri.startsWith("data:image")) {
    return uri;
  }

  throw new Error(`[base64Image] - Invalid uri: ${uri}`);
}
