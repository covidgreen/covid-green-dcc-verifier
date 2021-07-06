import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet } from 'react-native'
import { Text, Button } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { useTheme } from '@app/context/theme'

import { th } from '@app/lib/theme'

type ErrorSnackbarProps = {
  title: string
  message: string
  visible?: boolean
  onRetry?: () => void
}

const styles = StyleSheet.create({
  container: {
    zIndex: 999,
    paddingHorizontal: th.spacing(2),
    position: 'absolute',
    top: th.spacing(8),
    left: 0,
    right: 0,
    minHeight: 80,
  },
  snackbar: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    paddingVertical: th.spacing(1),
    paddingHorizontal: th.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: th.spacing(1),
    width: '100%',
    justifyContent: 'center',
  },
  title: { marginLeft: th.spacing(1), fontWeight: 'bold' },
  retryBtnStyle: { marginLeft: th.spacing(1) },
  retryBtnLabelStyle: { height: 30, lineHeight: 30 },
  retryBtnContentStyle: { height: 30 },
})

export default function ErrorSnackbar({
  title,
  message,
  visible = false,
  onRetry,
}: ErrorSnackbarProps) {
  const { t } = useTranslation()
  const theme = useTheme()

  const rowStyles = message
    ? {
        borderBottomWidth: 1,
        borderBottomColor: '#F140371A',
      }
    : undefined

  if (!visible) return null

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.snackbar,
          {
            backgroundColor: theme.palette.redLight,
            borderColor: theme.palette.error,
          },
        ]}
      >
        <View style={[styles.row, rowStyles]}>
          <Icon name="warning" size={25} />
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.row}>
          <Text>{message}</Text>
          {onRetry && (
            <Button
              mode="contained"
              style={styles.retryBtnStyle}
              onPress={onRetry}
              labelStyle={styles.retryBtnLabelStyle}
              contentStyle={styles.retryBtnContentStyle}
            >
              {t('retry')}
            </Button>
          )}
        </View>
      </View>
    </View>
  )
}
