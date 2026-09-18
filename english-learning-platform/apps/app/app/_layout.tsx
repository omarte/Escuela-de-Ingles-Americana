import 'expo-dev-client'
import React, { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { colors } from '@elp/ui'
import { useAuthStore } from '../stores/useAuthStore'
import { SPLASH_SCREEN_IMG } from '../lib/assets'
import { configurePurchases } from '../hooks/usePurchases'

function NavigationGuard(): React.JSX.Element {
  const router = useRouter()
  const segments = useSegments()
  const session = useAuthStore((state) => state.session)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const initSession = useAuthStore((state) => state.initSession)
  const [minSplashDone, setMinSplashDone] = React.useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      void configurePurchases(session.user.id).catch((err: unknown) => {
        if (__DEV__) {
          const msg = err instanceof Error ? err.message : String(err)
          console.warn('[Purchases] configurePurchases warning:', msg)
        }
      })
    }
  }, [session?.user?.id])

  useEffect(() => {
    void initSession()
    // Check and apply OTA updates automatically if available
    async function checkOTAUpdates(): Promise<void> {
      try {
        const Updates = await import('expo-updates')
        if (Updates.isEnabled) {
          const check = await Updates.checkForUpdateAsync()
          if (check.isAvailable) {
            await Updates.fetchUpdateAsync()
            await Updates.reloadAsync()
          }
        }
      } catch {
        // Degrades gracefully on offline or dev environment
      }
    }
    void checkOTAUpdates()

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
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <Image
          source={SPLASH_SCREEN_IMG}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
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
    backgroundColor: '#059669',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 84,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
