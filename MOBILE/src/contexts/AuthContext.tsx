import { createContext, ReactNode, useEffect, useState } from "react";

import { saveAuthTokenOnStorage, getAuthTokenFromStorage } from "@storage/storageAuthToken";
import { getUserFromStorage, removeUserFromStorage, saveUserOnStorage } from "@storage/storageUser";

import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
  user: UserDTO;
  singIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isUserStorageLoading: boolean;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isUserStorageLoading, setIsUserStorageLoading] = useState(true);

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setUser(userData);
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated);
      await saveUserOnStorage(userUpdated);
    } catch (error) {
      throw error;
    }
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string, refresh_token: string) {
    try {
      setIsUserStorageLoading(true);
      await saveUserOnStorage(userData);
      await saveAuthTokenOnStorage({ token, refresh_token });
    } catch (error) {
      throw error;
    } finally {
      setIsUserStorageLoading(false);
    }
  }

  async function singIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", { email, password });
      
      if (data.user && data.token) {
        await storageUserAndTokenSave(data.user, data.token, data.refresh_token);
        userAndTokenUpdate(data.user, data.token);
      }

    } catch (error) {
      throw error;
    } finally {
      setIsUserStorageLoading(false);
    }
  }

  async function signOut() {
    try {
      setIsUserStorageLoading(true);
      setUser({} as UserDTO);
      await removeUserFromStorage();
    } catch (error) {
      throw error;
    } finally {
      setIsUserStorageLoading(false);
    }
  }

  async function loadUserData() {
    try {
      setIsUserStorageLoading(true);

      const userLogged = await getUserFromStorage();
      const { token } = await getAuthTokenFromStorage();

      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsUserStorageLoading(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const subscribe = api.TokenGuardian(signOut);

    return () => {
      subscribe();
    };
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        singIn,
        signOut,
        isUserStorageLoading,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
