import React, { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { colors } from '@elp/ui'
import { useAuthStore } from '../stores/useAuthStore'
import { APP_LOGO } from '../lib/assets'

function NavigationGuard(): React.JSX.Element {
  const router = useRouter()
  const segments = useSegments()
  const session = useAuthStore((state) => state.session)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const initSession = useAuthStore((state) => state.initSession)

  useEffect(() => {
    void initSession()
  }, [initSession])

  useEffect(() => {
    if (!isInitialized) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!session && !inAuthGroup) {
      // User is not authenticated but trying to access protected screens
      router.replace('/(auth)/login')
    } else if (session && inAuthGroup) {
      // User is already authenticated but is on login/register
      router.replace('/(app)')
    }
  }, [session, isInitialized, segments, router])

  if (!isInitialized) {
    return (
      <View style={styles.splashContainer}>
        <Image source={APP_LOGO} style={styles.logoImage} resizeMode="contain" />
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </View>
    )
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  )
}

export default function RootLayout(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={colors.background} />
      <NavigationGuard />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 160,
    height: 160,
    marginBottom: 8,
  },
  loader: {
    marginTop: 24,
  },
})
