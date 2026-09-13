import React, { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { colors } from '@elp/ui'
import { useAuthStore } from '../stores/useAuthStore'
import { SPLASH_SCREEN_IMG } from '../lib/assets'

function NavigationGuard(): React.JSX.Element {
  const router = useRouter()
  const segments = useSegments()
  const session = useAuthStore((state) => state.session)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const initSession = useAuthStore((state) => state.initSession)
  const [minSplashDone, setMinSplashDone] = React.useState(false)

  useEffect(() => {
    void initSession()
    // Give brand splash screen a smooth presence during initialization
    const timer = setTimeout(() => {
      setMinSplashDone(true)
    }, 800)
    return () => {
      clearTimeout(timer)
    }
  }, [initSession])

  useEffect(() => {
    if (!isInitialized || !minSplashDone) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!session && !inAuthGroup) {
      // User is not authenticated but trying to access protected screens
      router.replace('/(auth)/login')
    } else if (session && inAuthGroup) {
      // User is already authenticated but is on login/register
      router.replace('/(app)')
    }
  }, [session, isInitialized, minSplashDone, segments, router])

  if (!isInitialized || !minSplashDone) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={SPLASH_SCREEN_IMG}
          style={styles.splashLogo}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#10B981" style={styles.loader} />
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
      <StatusBar style="light" backgroundColor="#0B0F17" />
      <NavigationGuard />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#0B0F17',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 220,
    height: 220,
    marginBottom: 24,
  },
  loader: {
    marginTop: 8,
  },
})
