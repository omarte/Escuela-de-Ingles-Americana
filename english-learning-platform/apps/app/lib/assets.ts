import type { ImageSourcePropType } from 'react-native'

/**
 * Centralized asset registry for Expo/React Native client.
 * Provides strictly-typed ImageSource bindings for static assets.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
export const APP_LOGO: ImageSourcePropType = require('../assets/logo.png')
