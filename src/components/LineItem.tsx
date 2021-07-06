import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

import { useTheme } from '@app/context/theme'

import { th } from '@app/lib/theme'

type LineItemProps = {
  label: string
  value: string
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: th.spacing(0.5),
    marginBottom: th.spacing(1),
    borderBottomWidth: 0.5,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 14,
  },
})

export default function LineItem({ label, value }: LineItemProps) {
  const theme = useTheme()

  return (
    <View style={[styles.container, { borderColor: theme.palette.divider }]}>
      <Text style={[styles.label, { color: theme.palette.textLight }]}>
        {label}
      </Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}
