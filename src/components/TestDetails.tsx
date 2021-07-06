import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { getValue, useConfig } from '@app/context/config'

import { formatDateTime } from '@app/lib/util'

import { TestGroup } from '@app/types/hcert'

import LineItem from './LineItem'

type TestDetailsProps = {
  data: TestGroup
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})

export default function TestDetails({ data }: TestDetailsProps) {
  const { t } = useTranslation()
  const {
    config: { valuesets },
  } = useConfig()

  return (
    <View style={styles.container}>
      <LineItem
        label={t('targetedDisease')}
        value={getValue(valuesets.diseaseAgentTargeted, data.tg)}
      />
      <LineItem
        label={t('testType')}
        value={getValue(valuesets.testType, data.tt)}
      />
      <LineItem label={t('testName')} value={data.nm} />
      <LineItem
        label={t('testDevice')}
        value={getValue(valuesets.testManf, data.ma)}
      />
      <LineItem label={t('testDateTime')} value={formatDateTime(data.sc)} />
      <LineItem
        label={t('testResult')}
        value={getValue(valuesets.testResult, data.tr)}
      />
      <LineItem label={t('testingCenter')} value={data.tc} />
      <LineItem
        label={t('country')}
        value={getValue(valuesets.countryCodes, data.co)}
      />
      <LineItem label={t('certificateIssuer')} value={data.is} />
      <LineItem label={t('certificateId')} value={data.ci} />
    </View>
  )
}
