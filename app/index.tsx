import React, {useEffect, useState, useContext} from 'react';
import {View, Text, Button} from 'react-native';
import { IUserData } from '@/interfaces/UserData';
import { Link, useNavigation, useRouter, usePathname, Redirect } from "expo-router";
import { isSignedIn, onSignIn } from '../auth';
import { Stack } from 'expo-router';
import {AuthContext} from "../auth/ctx";
import { useSession } from "./ctx";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "login",
};

export default function Index(){
  const { session } = useSession();

  console.log('session index', session);

    const router = useRouter();
    const [userData, setUserData] = useState<IUserData | null>(null);

    useEffect(() => {
      

        //console.log('use effect index')

        //console.log('session', session);

        // isSignedIn()
        // .then((userData:IUserData) => {
        //     console.log('autenticado');
        //     console.log(userData);

        //     setUserData(userData);

        //     router.replace('/home');
        // })
        // .catch(() => {
        //     console.log('não autenticado');
        //     router.replace('/login');
        // })
    }, []);

    if (session) {
      return <Redirect href="/home" />;
    } else {
      return <Redirect href="/login" />;
    }

  //   return (
  //     <Stack>
  //       <Stack.Screen name="login" options={{ headerShown: true }} />
  //       <Stack.Screen name="register" options={{ headerShown: true }} />
  //       <Stack.Screen name="(auth-routes)" />
  //       <Stack.Screen name="+not-found" />
  //     </Stack>
  // );
}