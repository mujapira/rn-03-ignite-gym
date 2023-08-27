import { createContext, ReactNode, useEffect, useState } from "react";

import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { getUserFromStorage, removeUserFromStorage, saveUserOnStorage } from "@storage/storageUser";

export type AuthContextDataProps = {
  user: UserDTO;
  singIn: (email: string, password: string) => Promise<void>;
  isUserStorageLoading: boolean;
  signOut: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isUserStorageLoading, setIsUserStorageLoading] = useState(true);
  const [user, setUser] = useState<UserDTO>({} as UserDTO);

  async function singIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", { email, password });
      if (data.user) {
        setUser(data.user);
        saveUserOnStorage(data.user);
      }
    } catch (error) {
      throw error;
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
      const userLogged = await getUserFromStorage();

      if (userLogged) {
        setUser(userLogged);
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

  return <AuthContext.Provider value={{ user, singIn, isUserStorageLoading, signOut }}>{children}</AuthContext.Provider>;
}
