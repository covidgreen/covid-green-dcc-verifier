import React, { useCallback } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import { StatusBar } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import differenceInHours from 'date-fns/differenceInHours'
import differenceInMinutes from 'date-fns/differenceInMinutes'

import { navigationRef } from './lib/refs'
import HomeScreen from './screens/Home'
import ScanScreen from './screens/Scan'
import SettingsScreen from './screens/Settings'
import ScanPassScreen from './screens/ScanPass'
import ScanFailScreen from './screens/ScanFail'
import { useTheme } from './context/theme'
import type { MainStackParamList, RootStackParamList } from './types/routes'
import { useConfig } from './context/config'
import { now } from './lib/util'
import { useLogger } from './context/logger'

const MainStack = createStackNavigator<MainStackParamList>()
const RootStack = createStackNavigator<RootStackParamList>()

const screenOptions = { headerShown: false }

function MainScreen() {
  return (
    <MainStack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen
        name="Scan"
        component={ScanScreen}
        options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
      />
    </MainStack.Navigator>
  )
}

export default function Main() {
  const theme = useTheme()
  const { refreshedAt, refetch: refetchConfig } = useConfig()
  const { pushedAt, pushToServer } = useLogger()

  const getRef = ref => {
    navigationRef.current = ref
  }

  const handleNavigationChange = useCallback(() => {
    // auto refresh config
    if (differenceInHours(now(), new Date(refreshedAt)) > 12) {
      console.log('Config too old, attempting refetch...')
      refetchConfig()
    }

    // push logs
    if (differenceInMinutes(now(), pushedAt) > 2) {
      pushToServer()
    }
  }, [refreshedAt, refetchConfig, pushedAt, pushToServer])

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer
        theme={theme}
        ref={getRef}
        onStateChange={handleNavigationChange}
      >
        <RootStack.Navigator mode="modal" screenOptions={screenOptions}>
          <RootStack.Screen name="Main" component={MainScreen} />
          <RootStack.Screen
            name="ScanPass"
            component={ScanPassScreen}
            options={{ ...TransitionPresets.SlideFromRightIOS }}
          />
          <RootStack.Screen
            name="ScanFail"
            component={ScanFailScreen}
            options={{ ...TransitionPresets.SlideFromRightIOS }}
          />
          <MainStack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              ...TransitionPresets.ModalSlideFromBottomIOS,
              cardStyle: { backgroundColor: 'transparent' },
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
      <StatusBar barStyle="default" />
    </PaperProvider>
  )
}
