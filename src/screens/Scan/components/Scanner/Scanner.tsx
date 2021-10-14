import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, ViewStyle } from 'react-native'
import { Camera } from 'expo-camera'
import { useTranslation } from 'react-i18next'

import { th } from '@app/lib/theme'

const edge: ViewStyle = {
  borderColor: 'white',
  borderLeftWidth: 6,
  borderTopWidth: 6,
  borderTopLeftRadius: 2,
  position: 'absolute',
  height: th.spacing(5),
  width: th.spacing(5),
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBox: {
    height: 300,
    width: 300,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomRight: {
    transform: [{ rotate: '180deg' }],
    ...edge,
    right: 0,
    bottom: 0,
  },
  bottomLeft: {
    transform: [{ rotateX: '180deg' }],
    ...edge,
    bottom: 0,
    left: 0,
  },
  topLeft: {
    ...edge,
    left: 0,
    top: 0,
  },
  topRight: {
    transform: [{ rotateY: '180deg' }],
    ...edge,
    top: 0,
    right: 0,
  },
})

type ScannerProps = {
  onScan: (_: string) => void
}

export default function Scanner({ onScan }: ScannerProps) {
  const { t } = useTranslation()
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    const fn = async () => {
      try {
        const { status } = await Camera.requestPermissionsAsync()
        console.log('Camera status', status)
        setHasPermission(status === 'granted')
      } catch(e) {
        console.log(e, 'failed to request camera permissions')
      }
    }

    fn()
  }, [])

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true)
    onScan(data)
  }

  if (hasPermission === null) {
    return null
  }

  if (hasPermission === false) {
    // TODO: Implement UI to notify user and request for permission again
    return <Text>{t('err:noCameraAccess')}</Text>
  }

  return (
    <View style={styles.container}>
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        ratio="16:9"
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.captureBox}>
        <View testID="top-left-corner" style={styles.topLeft} />
        <View testID="top-right-corner" style={styles.topRight} />
        <View testID="bottom-right-corner" style={styles.bottomRight} />
        <View testID="bottom-left-corner" style={styles.bottomLeft} />
      </View>
    </View>
  )
}
