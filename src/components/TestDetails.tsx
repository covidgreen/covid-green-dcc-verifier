import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { formatDateTime } from '@app/lib/util'

import { TestGroup } from 'dcc-decoder'

import LineItem from './LineItem'

type TestDetailsProps = {
  data: TestGroup
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})

export default function TestDetails({ data }: TestDetailsProps) {
  const { t } = useTranslation()
 
  return (
    <View style={styles.container}>
      <LineItem
        label={t('targetedDisease')}
        value={data.tg}
      />
      <LineItem
        label={t('testType')}
        value={data.tt}
      />
      <LineItem label={t('testName')} value={data.nm} />
      <LineItem
        label={t('testDevice')}
        value={data.ma}
      />
      <LineItem label={t('testDateTime')} value={formatDateTime(data.sc)} />
      <LineItem
        label={t('testResult')}
        value={data.tr}
      />
      <LineItem label={t('testingCenter')} value={data.tc} />
      <LineItem
        label={t('country')}
        value={data.co}
      />
      <LineItem label={t('certificateIssuer')} value={data.is} />
      <LineItem label={t('certificateId')} value={data.ci} />
    </View>
  )
}
