import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

async function storeData<T>(key: string, updatedData: T): Promise<void> {
  const jsonValue = JSON.stringify(updatedData);
  await AsyncStorage.setItem(key, jsonValue);
}

async function readData<T>(key: string): Promise<T | null> {
  const jsonValue = await AsyncStorage.getItem(key);
  if (!jsonValue) {
    return null;
  }

  return JSON.parse(jsonValue) as T;
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
