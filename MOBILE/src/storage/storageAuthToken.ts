import AsyncStorage from '@react-native-async-storage/async-storage';

import { AUTH_STORAGE } from '@storage/storageConfig';

export async function saveAuthTokenOnStorage(token: string) {
  await AsyncStorage.setItem(AUTH_STORAGE, token);
}


export async function getAuthTokenFromStorage() {
  const token = await AsyncStorage.getItem(AUTH_STORAGE);

  return token;
}