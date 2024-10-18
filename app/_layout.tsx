import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { SessionProvider } from "./ctx";
import { SafeAreaView } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SessionProvider>
        <Stack>
          <Stack.Screen name="login" options={{headerShown: false}}/>
          <Stack.Screen name="register" options={{ headerTitle: 'Criar conta' }} />
          <Stack.Screen name="(auth-routes)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SessionProvider> 
    </SafeAreaView>    
  );
}
