import React from 'react'
import {
  View,
  StyleSheet,
  ImageBackground,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { IconButton } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/core'

import { useTheme } from '@app/context/theme'

import { th } from '@app/lib/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: '40%',
  },
  settingsIcon: {
    position: 'absolute',
    right: th.spacing(-0.5),
    top: th.spacing(-0.5),
    zIndex: 1,
  },

  content: {
    flex: 1,
  },
})

type PageLayoutProps = {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  showSettings?: boolean
}

export default function PageLayout({
  children,
  style,
  showSettings = false,
}: PageLayoutProps) {
  const navigation = useNavigation()
  const theme = useTheme()

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/main-bg.png')}
        style={styles.bg}
        resizeMode="cover"
      />
      {showSettings && (
        <IconButton
          color={theme.palette.white}
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsIcon}
          size={30}
          icon={props => <Icon {...props} name="settings" />}
        />
      )}
      <View
        style={[
          styles.content,
          style,
          showSettings ? { paddingTop: th.spacing(6) } : {},
        ]}
      >
        {children}
      </View>
    </View>
  )
}
