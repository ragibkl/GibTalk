import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useState, useEffect } from "react";

async function storeData<T>(key: string, updatedData: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(updatedData);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.log(error);
    let message =
      error instanceof Error
        ? `${error.name} - ${error.message}`
        : "Unknown error";

    Alert.alert("Store Data Error", message, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);

    throw error;
  }
}

async function readData<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (!jsonValue) {
      return null;
    }

    return JSON.parse(jsonValue) as T;
  } catch (error) {
    console.log(error);
    let message =
      error instanceof Error
        ? `${error.name} - ${error.message}`
        : "Unknown error";

    Alert.alert("Read Data Error", message, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);

    throw error;
  }
}

export function useStorage<T>(
  key: string,
  data: T,
  setData: (data: T) => void,
) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const doLoadData = async () => {
      const loadedData = await readData<T>(key);
      if (loadedData) {
        setData(loadedData);
      }

      setIsLoading(false);
    };

    doLoadData();
  }, []);

  useEffect(() => {
    const doStoreData = async () => {
      await storeData<T>(key, data);
    };

    doStoreData();
  }, [data]);

  return isLoading;
}
