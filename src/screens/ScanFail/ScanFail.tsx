import React from 'react'
import { StyleSheet, View } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native'
import { Text, Surface } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import { useTranslation } from 'react-i18next'

import VaccinationDetails from '@app/components/VaccinationDetails'
import RecoveryDetails from '@app/components/RecoveryDetails'
import TestDetails from '@app/components/TestDetails'
import Chip from '@app/components/Chip'
import PageLayout from '@app/components/PageLayout'
import Button from '@app/components/Button'

import { useTheme } from '@app/context/theme'
import { useConfig } from '@app/context/config'

import { th } from '@app/lib/theme'
import { formatDate } from '@app/lib/util'

import { MainStackParamList, RootStackParamList } from '@app/types/routes'

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackParamList>,
  StackNavigationProp<RootStackParamList, 'ScanFail'>
>

type ScanFailScreenRouteProp = RouteProp<RootStackParamList, 'ScanFail'>

type ScanFailProps = {
  navigation: NavigationProp
  route: ScanFailScreenRouteProp
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
  failReason: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: th.spacing(2),
    textAlign: 'center',
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
    justifyContent: 'center',
    borderTopWidth: 0.5,
  },
  header: {
    alignItems: 'center',
    marginBottom: th.spacing(2),
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dob: {},
})

export default function ScanFail({ navigation, route }: ScanFailProps) {
  const { t } = useTranslation()
  const theme = useTheme()
  const { config } = useConfig()
  const { data: cert, error, ruleErrors } = route.params

  const handleClickNext = () => navigation.goBack()

  const vaccination = cert?.v?.[0]
  const test = cert?.t?.[0]
  const recovery = cert?.r?.[0]

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
                vaccination
                  ? 'vaccineCert'
                  : test
                  ? 'pcrCert'
                  : recovery
                  ? 'recoveryCert'
                  : 'unknownCert'
              )}
            </Text>

            <Chip.Fail />
            {error && (
              <Chip
                color={theme.palette.error}
                bgColor={theme.palette.redLighter}
                label={
                  <Text style={styles.failReason}>
                    {t(`err:${error}`, t('err:UNKNOWN'))}
                  </Text>
                }
              />
            )}

            {ruleErrors?.map((err, index) => (
              <Chip
                key={index}
                color={theme.palette.error}
                bgColor={theme.palette.redLighter}
                label={<Text style={styles.failReason}>{err}</Text>}
                style={{ borderRadius: 10 }}
              />
            ))}

            {cert && (
              <View style={styles.header}>
                <Text style={styles.name}>
                  {cert.nam.fn}, {cert.nam.gn}
                </Text>
                <Text style={styles.dob}>
                  {t('dob')}: {formatDate(cert.dob)}
                </Text>
              </View>
            )}

            {renderCert()}
          </ScrollView>
        </Surface>
      </View>
      <View
        style={[styles.nextWrapper, { borderTopColor: theme.palette.divider }]}
      >
        <Button variant="primary" onPress={handleClickNext}>
          {t('nextScan')}
        </Button>
      </View>
    </PageLayout>
  )
}
