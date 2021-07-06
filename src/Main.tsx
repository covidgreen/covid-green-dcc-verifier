import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import { StatusBar } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'

import { navigationRef } from './lib/refs'
import HomeScreen from './screens/Home'
import ScanScreen from './screens/Scan'
import SettingsScreen from './screens/Settings'
import ScanPassScreen from './screens/ScanPass'
import ScanFailScreen from './screens/ScanFail'
import { useTheme } from './context/theme'
import type { MainStackParamList, RootStackParamList } from './types/routes'

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

  const getRef = ref => {
    navigationRef.current = ref
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme} ref={getRef}>
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
