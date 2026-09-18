import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  LayoutChangeEvent,
} from 'react-native'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import Svg, { Path } from 'react-native-svg'
import { darkColors, radius } from '@elp/ui'

type IoniconName = keyof typeof Ionicons.glyphMap

interface TabConfig {
  icon: IoniconName
  iconActive: IoniconName
  label: string
}

const TAB_CONFIGS: Record<string, TabConfig> = {
  index: {
    icon: 'home-outline',
    iconActive: 'home',
    label: 'Inicio',
  },
  learn: {
    icon: 'school-outline',
    iconActive: 'school',
    label: 'Aprender',
  },
  vocabulary: {
    icon: 'library-outline',
    iconActive: 'library',
    label: 'Banco',
  },
  reading: {
    icon: 'book-outline',
    iconActive: 'book',
    label: 'Lectura',
  },
  progress: {
    icon: 'stats-chart-outline',
    iconActive: 'stats-chart',
    label: 'Progreso',
  },
  profile: {
    icon: 'person-outline',
    iconActive: 'person',
    label: 'Perfil',
  },
  paywall: {
    icon: 'diamond-outline',
    iconActive: 'diamond',
    label: 'Planes',
  },
  support: {
    icon: 'headset-outline',
    iconActive: 'headset',
    label: 'Soporte',
  },
}

export function LiquidTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps): React.JSX.Element {
  const insets = useSafeAreaInsets()
  const [barWidth, setBarWidth] = useState(0)

  const activeIndex = state.index
  const routes = state.routes

  // Animated translation for the notch and floating bubble
  const translateX = useRef(new Animated.Value(0)).current
  const bubbleScale = useRef(new Animated.Value(1)).current

  const tabCount = routes.length
  const tabWidth = barWidth > 0 ? barWidth / tabCount : 0

  useEffect(() => {
    if (tabWidth > 0) {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: activeIndex * tabWidth,
          useNativeDriver: true,
          tension: 65,
          friction: 9,
        }),
        Animated.sequence([
          Animated.timing(bubbleScale, {
            toValue: 0.85,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(bubbleScale, {
            toValue: 1,
            friction: 4,
            tension: 80,
            useNativeDriver: true,
          }),
        ]),
      ]).start()
    }
  }, [activeIndex, tabWidth, translateX, bubbleScale])

  const handleLayout = (e: LayoutChangeEvent): void => {
    const w = e.nativeEvent.layout.width
    setBarWidth(w)
  }

  // Generate SVG path for the liquid scoop notch tailored to tabWidth
  // Proportional clamp ensures the notch NEVER exceeds tabWidth or clips neighboring tabs on narrow screens (< 360px)
  const notchWidth = Math.min(tabWidth * 0.86, 62)
  const notchDepth = 22
  const cx = tabWidth / 2
  const leftEdge = Math.max(cx - notchWidth / 2, 2)
  const rightEdge = Math.min(cx + notchWidth / 2, tabWidth - 2)
  const actualWidth = rightEdge - leftEdge
  const cOffset = actualWidth * 0.22

  // Smooth cubic bezier liquid dip
  const notchPath = `
    M 0 0 
    L ${String(leftEdge)} 0 
    C ${String(leftEdge + cOffset)} 0 ${String(cx - cOffset)} ${String(notchDepth)} ${String(cx)} ${String(notchDepth)} 
    C ${String(cx + cOffset)} ${String(notchDepth)} ${String(rightEdge - cOffset)} 0 ${String(rightEdge)} 0 
    L ${String(tabWidth)} 0 
    L ${String(tabWidth)} ${String(notchDepth + 4)} 
    L 0 ${String(notchDepth + 4)} 
    Z
  `

  // Responsive bubble diameter and vertical placement
  const bubbleSize = Math.min(Math.max(tabWidth * 0.78, 34), 46)
  const bubbleRadius = bubbleSize / 2
  const bubbleTop = -(bubbleRadius - 4)
  const bubbleIconSize = tabWidth < 46 ? 17 : tabWidth < 52 ? 19 : 22
  const inactiveIconSize = tabWidth < 46 ? 17 : 20

  const activeRoute = routes[activeIndex]
  const activeRouteName = activeRoute ? activeRoute.name : 'index'
  const activeConfig = TAB_CONFIGS[activeRouteName] ?? {
    icon: 'ellipse-outline',
    iconActive: 'ellipse',
    label: activeRouteName,
  }

  return (
    <View
      style={[
        styles.outerContainer,
        {
          paddingHorizontal: tabWidth < 46 ? 6 : 12,
          paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom - 8, 8) : 10,
        },
      ]}
    >
      <View style={styles.barCard} onLayout={handleLayout}>
        {/* Animated Liquid Notch & Floating Active Bubble */}
        {tabWidth > 0 && (
          <Animated.View
            style={[
              styles.animatedIndicatorContainer,
              {
                width: tabWidth,
                transform: [{ translateX }],
              },
            ]}
          >
            {/* Liquid Scoop Notch (carves smoothly into the dark bar with page background token) */}
            <View style={styles.notchSvgContainer}>
              <Svg width={tabWidth} height={notchDepth + 4}>
                <Path d={notchPath} fill={darkColors.background} />
              </Svg>
            </View>

            {/* Elevated Floating Bubble */}
            <Animated.View
              style={[
                styles.floatingBubble,
                {
                  top: bubbleTop,
                  width: bubbleSize,
                  height: bubbleSize,
                  borderRadius: bubbleRadius,
                  transform: [{ scale: bubbleScale }],
                },
              ]}
            >
              <Ionicons
                name={activeConfig.iconActive}
                size={bubbleIconSize}
                color={darkColors.primaryHover}
              />
            </Animated.View>
          </Animated.View>
        )}

        {/* Tab Items Row */}
        <View style={styles.tabsRow}>
          {routes.map((route, index) => {
            const isFocused = state.index === index
            const descriptor = descriptors[route.key]
            const options = descriptor ? descriptor.options : {}
            const config = TAB_CONFIGS[route.name] ?? {
              icon: 'ellipse-outline',
              iconActive: 'ellipse',
              label: options.title ?? route.name,
            }

            const onPress = (): void => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              })

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name)
              }
            }

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel ?? config.label}
                onPress={onPress}
                activeOpacity={0.7}
                style={styles.tabButton}
              >
                {isFocused ? (
                  // Active Tab: Icon floats in bubble above; label shows inside the scoop
                  <View style={styles.activeLabelContainer}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.activeLabel,
                        tabWidth < 46 && { fontSize: 8.5 },
                      ]}
                    >
                      {config.label}
                    </Text>
                  </View>
                ) : (
                  // Inactive Tab: Outline icon with soft label
                  <View style={styles.inactiveItemContainer}>
                    <Ionicons
                      name={config.icon}
                      size={inactiveIconSize}
                      color={darkColors.textMuted}
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.inactiveLabel,
                        tabWidth < 46 && { fontSize: 8 },
                      ]}
                    >
                      {config.label}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    pointerEvents: 'box-none',
  },
  barCard: {
    height: 66,
    backgroundColor: darkColors.card,
    borderRadius: radius.xl,
    borderWidth: 1.2,
    borderColor: darkColors.border,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  animatedIndicatorContainer: {
    position: 'absolute',
    top: -1,
    left: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  notchSvgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  floatingBubble: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: darkColors.primary,
    shadowColor: darkColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 10,
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 20,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeLabelContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 7,
    height: '100%',
  },
  activeLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: darkColors.primaryLight,
    letterSpacing: 0.2,
  },
  inactiveItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  inactiveLabel: {
    fontSize: 9.5,
    fontWeight: '500',
    color: darkColors.textMuted,
  },
})
