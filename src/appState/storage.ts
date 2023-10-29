import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import { useState, useEffect } from "react";

async function readFromFile<T>(key: string): Promise<T | null> {
  try {
    const fileUri = `${FileSystem.documentDirectory}/${key}-data.json`;
    const jsonValue = await FileSystem.readAsStringAsync(fileUri);
    if (!jsonValue) {
      return null;
    }

    const data = JSON.parse(jsonValue) as T;
    if (Array.isArray(data) && !data.length) {
      return null;
    }

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function readFromAsyncStore<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (!jsonValue) {
      return null;
    }

    const data = JSON.parse(jsonValue) as T;
    if (Array.isArray(data) && !data.length) {
      return null;
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function writeToFile<T>(key: string, updatedData: T): Promise<void> {
  try {
    const fileUri = `${FileSystem.documentDirectory}/${key}-data.json`;
    const jsonValue = JSON.stringify(updatedData);

    await FileSystem.writeAsStringAsync(fileUri, jsonValue);
  } catch (error) {
    console.log(error);
    const message =
      error instanceof Error
        ? `${error.name} - ${error.message}`
        : "Unknown error";

    Alert.alert("Write Data Error", message, [
      { text: "OK", onPress: () => {} },
    ]);

    throw error;
  }
}

async function writeToAsyncStore<T>(
  key: string,
  updatedData: T,
): Promise<void> {
  try {
    const jsonValue = JSON.stringify(updatedData);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.log(error);
    const message =
      error instanceof Error
        ? `${error.name} - ${error.message}`
        : "Unknown error";

    Alert.alert("Write Data Error", message, [
      { text: "OK", onPress: () => {} },
    ]);

    throw error;
  }
}

export function useAsyncStorage<T>(
  key: string,
  data: T,
  setData: (data: T) => void,
) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const doLoadData = async () => {
      const loadedData = await readFromAsyncStore<T>(key);
      if (loadedData) {
        setData(loadedData);
      }

      setIsLoading(false);
    };

    doLoadData();
  }, []);

  useEffect(() => {
    const doStoreData = async () => {
      await writeToAsyncStore<T>(key, data);
    };

    doStoreData();
  }, [data]);

  return isLoading;
}

export function useStorage<T>(
  key: string,
  data: T,
  setData: (data: T) => void,
) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const doLoadData = async () => {
      const fromFile = await readFromFile<T>(key);
      if (fromFile) {
        setData(fromFile);
        setIsLoading(false);
        return;
      }

      const fromAsyncStore = await readFromAsyncStore<T>(key);
      if (fromAsyncStore) {
        await writeToFile<T>(key, fromAsyncStore);
        setData(fromAsyncStore);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    };

    doLoadData();
  }, []);

  useEffect(() => {
    const doStoreData = async () => {
      await writeToFile<T>(key, data);
    };

    doStoreData();
  }, [data]);

  return isLoading;
}
