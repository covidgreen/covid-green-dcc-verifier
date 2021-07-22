import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { useTheme } from '@app/context/theme'

import { th } from '@app/lib/theme'

type SnackbarProps = {
  message: string
  visible?: boolean
}

const styles = StyleSheet.create({
  container: {
    zIndex: 999,
    marginVertical: th.spacing(1),
  },
  snackbar: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    paddingVertical: th.spacing(0.5),
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
})

export default function WarningSnackbar({
  message,
  visible = false,
}: SnackbarProps) {
  const theme = useTheme()

  if (!visible) return null

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.snackbar,
          {
            backgroundColor: theme.palette.warning,
            borderColor: '#FFC85C',
          },
        ]}
      >
        <View style={styles.row}>
          <Icon name="warning" size={25} />
          <Text style={styles.title}>{message}</Text>
        </View>
      </View>
    </View>
  )
}
