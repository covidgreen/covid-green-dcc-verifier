import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { formatDate } from '@app/lib/util'

import { RecoveryGroup } from 'dcc-decoder'

import LineItem from './LineItem'

type RecoveryDetailsProps = {
  data: RecoveryGroup
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})

export default function RecoveryDetails({ data }: RecoveryDetailsProps) {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <LineItem
        label={t('targetedDisease')}
        value={data.tg}
      />
      <LineItem label={t('firstPositive')} value={formatDate(data.fr)} />
      <LineItem
        label={t('country')}
        value={data.co}
      />
      <LineItem label={t('certificateIssuer')} value={data.is} />
      <LineItem label={t('validFrom')} value={formatDate(data.df)} />
      <LineItem label={t('validUntil')} value={formatDate(data.du)} />
      <LineItem label={t('certificateId')} value={data.ci} />
    </View>
  )
}
