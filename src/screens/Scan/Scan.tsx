import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, InteractionManager } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import {
  useFocusEffect,
  CompositeNavigationProp,
} from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Spinner from 'react-native-loading-spinner-overlay'

import Button from '@app/components/Button'
import PageLayout from '@app/components/PageLayout'
import { useLogger } from '@app/context/logger'

import { th } from '@app/lib/theme'

import { MainStackParamList, RootStackParamList } from '@app/types/routes'

import { useVerifier } from '@app/context/verifier'

import Scanner from './components/Scanner'

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackParamList, 'Scan'>,
  StackNavigationProp<RootStackParamList>
>

type ScanProps = {
  navigation: NavigationProp
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scannerWrapper: {
    flex: 1,
  },
  closeBtn: {
    position: 'absolute',
    bottom: th.spacing(3),
    left: th.spacing(3),
    right: th.spacing(3),
  },
})

export default function Scan({ navigation }: ScanProps) {
  const { t } = useTranslation()
  const logger = useLogger()
  const verifier = useVerifier()
  const [scanning, setScanning] = useState(false)
  const [verifying, setVerifying] = useState(false)

  // for smooth transition away from scanner
  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      e.preventDefault()
      setScanning(false)
      setVerifying(false)
      setTimeout(() => navigation.dispatch(e.data.action), 0)
    })
  }, [navigation])

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setScanning(true)
      })

      return () => {
        task.cancel()
        setScanning(false)
        setVerifying(false)
      }
    }, [])
  )

  const handleStopScan = () => {
    navigation.navigate('Home')
  }

  const handleScan = async (qr: string) => {
    setVerifying(true)

    const result = await verifier.run(qr)

    logger.log(result)

    const { cert, ruleErrors, error, type } = result

    if (error || (ruleErrors && ruleErrors.length)) {
      return navigation.navigate('ScanFail', {
        error: error?.name,
        data: cert,
        type,
        ruleErrors,
      })
    }

    navigation.navigate('ScanPass', { data: cert, type })
  }

  return (
    <PageLayout style={styles.container}>
      {verifying && <Spinner animation="fade" visible />}
      <View style={styles.scannerWrapper}>
        {!verifying && scanning && <Scanner onScan={handleScan} />}
      </View>
      <Button
        onPress={handleStopScan}
        variant="secondary"
        style={styles.closeBtn}
      >
        {t('closeScanner')}
      </Button>
    </PageLayout>
  )
}
