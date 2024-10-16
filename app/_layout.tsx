import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React, {useEffect, useState, useContext} from 'react';
import { useFonts } from 'expo-font';
import { Stack, useRouter, Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import {Text} from 'react-native';
import { IUserData } from '@/interfaces/UserData';
import { isSignedIn, onSignIn } from '../auth';
//import { ConfigProvider } from "../auth/ctx";
import {AuthContext, AuthProvider,} from "../auth/ctx";
import { SessionProvider } from "./ctx";
import { SafeAreaView } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: "login",
// };

export default function RootLayout() {
  
  const router = useRouter();
  const [userData, setUserData] = useState<IUserData | null>(null);

    useEffect(() => {
        console.log('use effect top');
    }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SessionProvider>
        <Stack>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" options={{ headerShown: true }} />
          <Stack.Screen name="(auth-routes)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        {/* <Slot/> */}
      </SessionProvider> 
    </SafeAreaView>
    
    
  );
}
