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
  const notchWidth = Math.min(Math.max(tabWidth * 0.92, 54), 68)
  const notchDepth = 24
  const cx = tabWidth / 2
  const leftEdge = cx - notchWidth / 2
  const rightEdge = cx + notchWidth / 2

  // Smooth cubic bezier liquid dip
  const notchPath = `
    M 0 0 
    L ${String(leftEdge)} 0 
    C ${String(leftEdge + 12)} 0 ${String(cx - 16)} ${String(notchDepth)} ${String(cx)} ${String(notchDepth)} 
    C ${String(cx + 16)} ${String(notchDepth)} ${String(rightEdge - 12)} 0 ${String(rightEdge)} 0 
    L ${String(tabWidth)} 0 
    L ${String(tabWidth)} ${String(notchDepth + 4)} 
    L 0 ${String(notchDepth + 4)} 
    Z
  `

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
            {/* Liquid Scoop Notch (carves smoothly into the dark bar with page background #0B0F17) */}
            <View style={styles.notchSvgContainer}>
              <Svg width={tabWidth} height={notchDepth + 4}>
                <Path d={notchPath} fill="#0B0F17" />
              </Svg>
            </View>

            {/* Elevated Floating Bubble */}
            <Animated.View
              style={[
                styles.floatingBubble,
                {
                  transform: [{ scale: bubbleScale }],
                },
              ]}
            >
              <Ionicons
                name={activeConfig.iconActive}
                size={23}
                color="#059669"
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
                    <Text numberOfLines={1} style={styles.activeLabel}>
                      {config.label}
                    </Text>
                  </View>
                ) : (
                  // Inactive Tab: Outline icon with soft label
                  <View style={styles.inactiveItemContainer}>
                    <Ionicons
                      name={config.icon}
                      size={20}
                      color="#64748B"
                    />
                    <Text numberOfLines={1} style={styles.inactiveLabel}>
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
    backgroundColor: '#111827', // Rich Dark Slate
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
    // High-end soft shadow
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
    top: -19,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#10B981', // Subtle Emerald Halo Ring
    shadowColor: '#10B981',
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
    color: '#34D399', // Emerald 400
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
    color: '#64748B', // Slate 500
  },
})
