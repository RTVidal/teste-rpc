import React from "react";
import { useStorageState } from "./useStorageState";
import { IUserData } from "../interfaces/UserData";

const AuthContext = React.createContext<{
  signIn: (token:IUserData) => void;
  signOut: () => void;
  session?: IUserData | string | null;
  sessionData: IUserData | null
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  sessionData: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  return (
    <AuthContext.Provider
      value={{
        signIn: userData => {
          // Add your login logic here
          // For example purposes, we'll just set a fake session in storage
          //This likely would be a JWT token or other session data
          console.log('iniciando sessão');
          setSession(JSON.stringify(userData));
        },
        signOut: () => {
          setSession(null);
        },
        session,
        sessionData: session ? returnUserData(session) : null,
        // sessionData: () => {
        //     if(!session) return null;
        
            
        // },
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

const returnUserData = (session:string):IUserData | null => {
    try {
        const userData: IUserData = {...JSON.parse(session)};
        return userData;
    }catch(e){
        return null;
    }
}