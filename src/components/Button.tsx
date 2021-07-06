import React from 'react'
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native'
import { Button as RNPButton } from 'react-native-paper'

import { useTheme } from '@app/context/theme'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    borderWidth: 2,
  },
  label: { fontSize: 22 },
})

type ButtonProps = {
  onPress?: () => void
  variant?: 'primary' | 'secondary'
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  children: React.ReactNode
  fullWidth?: boolean
  disabled?: boolean
}

export default function Button({
  onPress,
  variant = 'secondary',
  style,
  labelStyle,
  fullWidth = false,
  children,
  disabled = false,
}: ButtonProps) {
  const theme = useTheme()
  const isPrimary = variant === 'primary'

  const btnStyle: StyleProp<ViewStyle> = isPrimary
    ? {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
      }
    : {
        backgroundColor: theme.palette.white,
        borderColor: theme.colors.primary,
      }

  const btnStyleDisabled: StyleProp<ViewStyle> = disabled
    ? {
        backgroundColor: theme.palette.lightGrey,
        borderColor: theme.palette.lightGrey,
      }
    : undefined

  return (
    <RNPButton
      disabled={disabled}
      onPress={onPress}
      mode="outlined"
      style={[
        styles.container,
        btnStyle,
        btnStyleDisabled,
        fullWidth ? { width: '100%' } : null,
        style,
      ]}
      labelStyle={[styles.label, labelStyle]}
      color={isPrimary ? theme.palette.white : theme.colors.primary}
      uppercase={false}
    >
      {children}
    </RNPButton>
  )
}
