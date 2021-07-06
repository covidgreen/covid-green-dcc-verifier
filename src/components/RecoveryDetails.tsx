import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { getValue, useConfig } from '@app/context/config'

import { formatDate } from '@app/lib/util'

import { RecoveryGroup } from '@app/types/hcert'

import LineItem from './LineItem'

type RecoveryDetailsProps = {
  data: RecoveryGroup
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})

export default function RecoveryDetails({ data }: RecoveryDetailsProps) {
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
      <LineItem label={t('firstPositive')} value={formatDate(data.fr)} />
      <LineItem
        label={t('country')}
        value={getValue(valuesets.countryCodes, data.co)}
      />
      <LineItem label={t('certificateIssuer')} value={data.is} />
      <LineItem label={t('validFrom')} value={formatDate(data.df)} />
      <LineItem label={t('validUntil')} value={formatDate(data.du)} />
      <LineItem label={t('certificateId')} value={data.ci} />
    </View>
  )
}
