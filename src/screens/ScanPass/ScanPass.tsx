import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native'
import { Text, Surface, IconButton } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import { useTranslation } from 'react-i18next'
import Icon from 'react-native-vector-icons/MaterialIcons'

import Chip from '@app/components/Chip'
import PageLayout from '@app/components/PageLayout'
import Button from '@app/components/Button'
import RecoveryDetails from '@app/components/RecoveryDetails'
import VaccinationDetails from '@app/components/VaccinationDetails'
import TestDetails from '@app/components/TestDetails'

import { useConfig } from '@app/context/config'
import { useTheme } from '@app/context/theme'
import { usePreferences } from '@app/context/preferences'

import { th } from '@app/lib/theme'
import { formatDate } from '@app/lib/util'

import { MainStackParamList, RootStackParamList } from '@app/types/routes'

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackParamList>,
  StackNavigationProp<RootStackParamList, 'ScanPass'>
>

type ScanPassScreenRouteProp = RouteProp<RootStackParamList, 'ScanPass'>

type ScanPassProps = {
  navigation: NavigationProp
  route: ScanPassScreenRouteProp
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentWrapper: { flex: 1, backgroundColor: 'transparent' },
  content: {
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 100,
    borderTopLeftRadius: th.spacing(1),
    borderTopRightRadius: th.spacing(1),
    elevation: 2,
    marginHorizontal: th.spacing(4),
  },
  scrollContainer: {
    justifyContent: 'center',
    paddingHorizontal: th.spacing(2),
    paddingTop: th.spacing(2),
  },
  nextWrapper: {
    zIndex: 9,
    backgroundColor: 'white',
    position: 'absolute',
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: th.spacing(3),
    alignItems: 'center',
    borderTopWidth: 0.5,
    flexDirection: 'row',
  },
  header: {
    alignItems: 'center',
    marginBottom: th.spacing(2),
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: th.spacing(2),
    textAlign: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dob: {},
})

export default function ScanPass({ navigation, route }: ScanPassProps) {
  const { t } = useTranslation()
  const { prefs } = usePreferences()
  const { config } = useConfig()
  const [paused, setPaused] = useState(prefs.autoCount ? false : true)
  const theme = useTheme()
  const [nextScanIn, setNextScanIn] = useState(10)
  const { data: cert } = route.params

  const handleClickNext = () => navigation.goBack()

  useEffect(() => {
    let timer

    function startCountdown() {
      timer = setInterval(() => {
        setNextScanIn(n => {
          if (n === 1 || paused) clearInterval(timer)
          return n - 1
        })
      }, 1000)
    }

    if (!paused) startCountdown()

    return () => clearInterval(timer)
  }, [navigation, paused])

  useEffect(() => {
    if (nextScanIn === 0) navigation.goBack()
  }, [nextScanIn, navigation])

  const vaccination = cert.v?.[0]
  const test = cert.t?.[0]
  const recovery = cert.r?.[0]

  const renderCert = () => {
    if (!config) return null
    if (vaccination) return <VaccinationDetails data={vaccination} />
    if (test) return <TestDetails data={test} />
    if (recovery) return <RecoveryDetails data={recovery} />
  }

  return (
    <PageLayout style={styles.container} showSettings>
      <View style={styles.contentWrapper}>
        <Surface style={styles.content}>
          <ScrollView
            keyboardShouldPersistTaps="never"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            <Text style={styles.type}>
              {t(
                vaccination ? 'vaccineCert' : test ? 'pcrCert' : 'recoveryCert'
              )}
            </Text>

            <Chip.Pass />

            <View style={styles.header}>
              <Text style={styles.name}>
                {cert.nam.fn}, {cert.nam.gn}
              </Text>
              <Text style={styles.dob}>
                {t('dob')}: {formatDate(cert.dob)}
              </Text>
            </View>

            {renderCert()}
          </ScrollView>
        </Surface>
      </View>
      <View
        style={[styles.nextWrapper, { borderTopColor: theme.palette.divider }]}
      >
        <Button variant="primary" onPress={handleClickNext} fullWidth>
          {paused ? t('nextScan') : `${t('nextScanIn')} ${nextScanIn}`}
        </Button>
        {!paused && (
          <IconButton
            color={theme.palette.white}
            onPress={() => setPaused(true)}
            style={{
              position: 'absolute',
              borderRadius: 0,
              right: th.spacing(3),
            }}
            size={30}
            icon={props => <Icon {...props} name="pause-circle-filled" />}
          />
        )}
      </View>
    </PageLayout>
  )
}
