import React from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { IconButton, Switch, Text } from 'react-native-paper'
import { StackNavigationProp } from '@react-navigation/stack'
import { CompositeNavigationProp } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useTranslation } from 'react-i18next'
import { getBuildNumber, getVersion } from 'react-native-device-info'
import { CONFIG_URL } from 'react-native-dotenv'

import Button from '@app/components/Button'

import { useTheme } from '@app/context/theme'
import { useConfig } from '@app/context/config'
import { usePreferences } from '@app/context/preferences'

import { formatDateTime } from '@app/lib/util'
import { th } from '@app/lib/theme'

import { MainStackParamList, RootStackParamList } from '@app/types/routes'

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackParamList, 'Scan'>,
  StackNavigationProp<RootStackParamList>
>

type SettingsProps = {
  navigation: NavigationProp
}
const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    flex: 1,
    padding: th.spacing(3),
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeIcon: {},
  content: { flex: 1 },
  row: {
    marginTop: th.spacing(2),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: th.spacing(2),
    paddingHorizontal: th.spacing(1),
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vertical: {},
  label: {
    fontSize: 14,
  },
  labelBig: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 12,
    padding: th.spacing(1),
  },
  refreshBtn: {
    marginTop: th.spacing(2),
  },
  refreshBtnLabel: {
    fontSize: 16,
  },
  footer: { alignItems: 'center' },
  footerText: {
    fontSize: 12,
  },
})

export default function Scan({ navigation }: SettingsProps) {
  const { t } = useTranslation()
  const theme = useTheme()
  const { prefs, toggleAutoCount } = usePreferences()
  const {
    refetch: refetchConfig,
    loading: configLoading,
    refreshedAt,
  } = useConfig()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>{t('settings')}</Text>
        <IconButton
          color={theme.colors.primary}
          onPress={() => navigation.goBack()}
          style={styles.closeIcon}
          size={30}
          icon={props => <Icon {...props} name="close" />}
        />
      </View>

      <View style={styles.content}>
        <View
          style={[
            styles.row,
            styles.horizontal,
            { borderColor: theme.palette.divider },
          ]}
        >
          <Text style={styles.label}>{t('autoCount')}</Text>
          <Switch value={prefs.autoCount} onValueChange={toggleAutoCount} />
        </View>
        <Text style={[styles.infoText, { color: theme.palette.grey }]}>
          {t('autoCountInfo')}
        </Text>

        <View style={[styles.row, { borderColor: theme.palette.divider }]}>
          <Text style={styles.labelBig}>{t('appData')}</Text>
          {configLoading ? (
            <ActivityIndicator
              size={30}
              animating
              color={theme.colors.primary}
            />
          ) : (
            <Button
              variant="secondary"
              onPress={refetchConfig}
              style={styles.refreshBtn}
              labelStyle={styles.refreshBtnLabel}
            >
              {t('refreshAppData')}
            </Button>
          )}
        </View>
        <Text style={[styles.infoText, { color: theme.palette.grey }]}>
          {t('refreshAppDataInfo', {
            date: formatDateTime(new Date(refreshedAt)),
          })}
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.palette.grey }]}>
          {t('build', { env: CONFIG_URL.indexOf('nf-') > -1 ? 'QA' : 'PROD' })}
        </Text>
        <Text style={[styles.footerText, { color: theme.palette.grey }]}>
          {t('buildNumber')} - {getBuildNumber()}
        </Text>
        <Text style={[styles.footerText, { color: theme.palette.grey }]}>
          {t('version')} - {getVersion()}
        </Text>
      </View>
    </View>
  )
}
