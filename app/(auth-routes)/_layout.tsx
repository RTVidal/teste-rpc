import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useSession } from '../ctx';

export default function HomeLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) return <Text>Loading...</Text>;

  if (!session) {
    return <Redirect href="/login" />;
  }

  return(
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="user-profile/[id]" options={{ headerTitle: 'Perfil do usuário' }} />
      <Stack.Screen name="post/[id]" options={{ headerTitle: 'Post' }} />
      <Stack.Screen name="new-post" options={{ headerTitle: 'Novo post' }} />
    </Stack>
  );
}
