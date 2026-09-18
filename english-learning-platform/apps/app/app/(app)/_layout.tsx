import React from 'react'
import { Tabs } from 'expo-router'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { LiquidTabBar } from '../../components/LiquidTabBar'

export default function AppTabsLayout(): React.JSX.Element {
  return (
    <Tabs
      tabBar={(props: BottomTabBarProps) => <LiquidTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Aprender',
        }}
      />
      <Tabs.Screen
        name="vocabulary"
        options={{
          title: 'Banco',
        }}
      />
      <Tabs.Screen
        name="reading"
        options={{
          title: 'Lectura',
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progreso',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
        }}
      />
      <Tabs.Screen
        name="paywall"
        options={{
          title: 'Planes',
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Soporte',
        }}
      />
    </Tabs>
  )
}
