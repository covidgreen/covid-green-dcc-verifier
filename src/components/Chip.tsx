import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { useTheme } from '@app/context/theme'

import { th } from '@app/lib/theme'

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 2,
    paddingRight: th.spacing(2),
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: th.spacing(3),
  },
  iconWrapper: {},
  label: {
    marginLeft: th.spacing(2),
  },
})

type ChipProps = {
  color?: string
  bgColor?: string
  icon?: React.ReactNode
  label: React.ReactNode
}

function Chip({ color, bgColor, icon, label }: ChipProps) {
  return (
    <View
      style={[
        styles.container,
        { borderColor: color, backgroundColor: bgColor },
      ]}
    >
      {icon}
      <Text style={styles.label}>{label}</Text>
    </View>
  )
}

Chip.Pass = function ChipPass() {
  const theme = useTheme()

  return (
    <Chip
      icon={
        <View style={styles.iconWrapper}>
          <Icon name="check-circle" color={theme.palette.success} size={60} />
        </View>
      }
      color={theme.palette.success}
      bgColor={theme.palette.successLight}
      label={
        <Text style={[styles.label, { fontSize: 32, fontWeight: 'bold' }]}>
          Pass
        </Text>
      }
    />
  )
}

Chip.Fail = function ChipFail() {
  const theme = useTheme()

  return (
    <Chip
      icon={
        <View style={styles.iconWrapper}>
          <Icon name="cancel" color={theme.palette.error} size={60} />
        </View>
      }
      color={theme.palette.error}
      bgColor={theme.palette.redLighter}
      label={
        <Text style={[styles.label, { fontSize: 32, fontWeight: 'bold' }]}>
          Fail
        </Text>
      }
    />
  )
}

export default Chip
