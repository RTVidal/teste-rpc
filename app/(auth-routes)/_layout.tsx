import React, {useEffect} from 'react';
import {Text} from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useSession } from '../ctx';

export default function HomeLayout() {
  const { session, isLoading } = useSession();

  useEffect(() => {
    console.log('use effect home')
  }, [])

  if (isLoading) return <Text>Loading...</Text>;

  if (!session) {
    return <Redirect href="/login" />;
  }

  return(
    <Stack>
      <Stack.Screen name="home" />
      <Stack.Screen name="user-profile/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="post/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="new-post" options={{ headerShown: true }} />
    </Stack>
  );
}
