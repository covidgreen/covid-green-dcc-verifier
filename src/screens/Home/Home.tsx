import React, { useMemo } from 'react'
import { Image, View, StyleSheet, ActivityIndicator } from 'react-native'
import { Text } from 'react-native-paper'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { ItemType } from 'react-native-dropdown-picker'

import Select from '@app/components/Select'
import PageLayout from '@app/components/PageLayout'
import Button from '@app/components/Button'
import ErrorSnackbar from '@app/components/ErrorSnackbar'

import { usePreferences } from '@app/context/preferences'
import { useConfig } from '@app/context/config'
import { useTheme } from '@app/context/theme'

import { th } from '@app/lib/theme'

import { MainStackParamList, RootStackParamList } from '@app/types/routes'

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>

type HomeProps = {
  navigation: NavigationProp
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },
  topSection: {
    flex: 0.6,
  },
  titleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: th.spacing(3),
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: th.spacing(3),
  },
  logoWrapper: {
    flex: 1,
    marginBottom: th.spacing(3),
  },
  logo: {
    maxWidth: '75%',
    height: '100%',
  },
  label: {
    marginBottom: th.spacing(1),
  },
  selectWrapper: {
    marginHorizontal: th.spacing(6),
    marginBottom: th.spacing(3),
  },
})

export default function Home({ navigation }: HomeProps) {
  const { t } = useTranslation()
  const { prefs, changeCountry, changeLocation } = usePreferences()
  const theme = useTheme()
  const {
    config,
    error: configError,
    loading: configLoading,
    refetch: refetchConfig,
  } = useConfig()

  const handleStartScan = () => navigation.navigate('Scan')

  const availableCountries = useMemo(
    () => (config?.rules ? Object.keys(config.rules) : []),
    [config]
  )

  const locationList = useMemo<ItemType[]>(
    () =>
      config?.locations?.map(l => ({
        label: l.name,
        value: l.name,
      })) ?? [],
    [config]
  )

  const countryList = useMemo<ItemType[]>(() => {
    if (!config) return []

    const list: ItemType[] = availableCountries.map(c => ({
      label: config.valuesets.countryCodes[c].display,
      value: c,
    }))

    list.unshift({
      label: 'No Rules',
      value: 'NO_RULES',
    })

    return list
  }, [config, availableCountries])

  const allowScan =
    !!configError || configLoading || !prefs?.countryCode || !prefs?.location

  return (
    <PageLayout style={styles.container} showSettings>
      <ErrorSnackbar
        visible={!!configError}
        title={t('err:noData')}
        message={t('err:noDataMessage')}
        onRetry={refetchConfig}
      />
      <View style={styles.topSection}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{t('ireland')}</Text>
          <Text style={styles.title}>{t('dccVerifier')}</Text>
        </View>
        <View style={styles.selectWrapper}>
          <Text style={[styles.label, { color: theme.palette.white }]}>
            {t('passengerDestination')}
          </Text>
          {prefs && (
            <Select
              onChange={changeCountry}
              items={countryList}
              placeholder={t('passengerDestinationPlaceholder')}
              value={prefs?.countryCode}
              disabled={countryList.length === 0}
              zIndex={2000}
              zIndexInverse={1000}
            />
          )}
        </View>
        <View style={styles.selectWrapper}>
          <Text style={[styles.label, { color: theme.palette.white }]}>
            {t('yourLocation')}
          </Text>
          {prefs && (
            <Select
              onChange={changeLocation}
              items={locationList}
              placeholder={t('yourLocationPlaceholder')}
              value={prefs?.location}
              disabled={locationList.length === 0}
              zIndex={1000}
              zIndexInverse={2000}
            />
          )}
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="center"
          />
        </View>
        {configLoading ? (
          <ActivityIndicator size={50} animating color={theme.colors.primary} />
        ) : (
          <Button
            onPress={handleStartScan}
            variant="primary"
            fullWidth
            disabled={allowScan}
          >
            {t('scan')}
          </Button>
        )}
      </View>
    </PageLayout>
  )
}
