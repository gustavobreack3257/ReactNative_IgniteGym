import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/Api";

import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storageUser";
import { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove } from "@storage/AuthTokenStorage";

import { createContext, ReactNode, useEffect, useState } from "react";

export type AuthContextDataProps = {
    user: UserDTO
    signIn: (email: string, password: string) => Promise<void>;
    updatedUserProfile: (updatedUser: UserDTO) => Promise<void>;
    signOut: () => Promise<void>;
    isLoadingStorageData: boolean;
    refreshedToken: string;
}

type AuthContextProviderProps = {
 children: ReactNode;
}
export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({children}: AuthContextProviderProps) {

  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [refreshedToken, setRefreshedToken] = useState('')
  const [isLoadingStorageData, setIsLoadingStorageData] = useState(true);

  async function UserAndTokenUpdate(userData: UserDTO, token: string){
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setUser(userData);
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string){
    try{
      setIsLoadingStorageData(true);

      await storageUserSave(userData);
      await storageAuthTokenSave(token);
    }  catch (error){
      throw error
    } finally {
      setIsLoadingStorageData(false);
    }

  }

  async function signIn(email: string, password: string){
    try{
      const { data } = await api.post('/sessions', {email, password});

      if(data.user && data.token){
        setIsLoadingStorageData(true);

        await storageUserAndTokenSave(data.user, data.token)
        UserAndTokenUpdate(data.user, data.token)
      }
    } catch (error){
      throw error;
    } finally {
      setIsLoadingStorageData(false);
    }
  }

  async function signOut(){
    try {
      setIsLoadingStorageData(true);
      setUser({} as UserDTO);

      await storageUserRemove();
      await storageAuthTokenRemove();

    } catch (error) {
      throw error;
    } finally {

      setIsLoadingStorageData(false)
    }

  }

  async function updatedUserProfile(updatedUser: UserDTO){
    try {
      setUser(updatedUser)

      await storageUserSave(updatedUser)
    } catch (error) {
      throw error;
    }
  }

  async function loadUserData() {
    try{
      setIsLoadingStorageData(true);

      const userLogged = await storageUserGet();
      const token = await storageAuthTokenGet();

    if (token && userLogged){
      UserAndTokenUpdate(userLogged, token);
    }
  } catch (error){
    throw error
  } finally{
    setIsLoadingStorageData(false)
  };
    };


  function refreshTokenUpdate(newToken: string){
    setRefreshedToken(newToken);
  };
  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager({signOut, refreshTokenUpdate });

    return () => {
      subscribe()
    }
  }, [signOut])

    return(
        <AuthContext.Provider value={{
        user,
        signIn,
        updatedUserProfile,
        signOut,
        isLoadingStorageData,
        refreshedToken}}>
            {children}
          </AuthContext.Provider>
    )
}