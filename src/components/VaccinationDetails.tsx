import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@app/lib/util'

import { VaccinationGroup } from '@app/types/hcert'

import LineItem from './LineItem'

type VaccinationDetailsProps = {
  data: VaccinationGroup
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})

export default function VaccinationDetails({ data }: VaccinationDetailsProps) {
  const { t } = useTranslation()
  return (
    <View style={styles.container}>
      <LineItem
        label={t('targetedDisease')}
        value={data.tg}
      />
      <LineItem
        label={t('vaccineOrProphylaxis')}
        value={data.vp}
      />
      <LineItem
        label={t('vaccineProduct')}
        value={data.mp}
      />
      <LineItem
        label={t('manufacturer')}
        value={data.ma}
      />
      <LineItem label={t('doseNumber')} value={data.dn} />
      <LineItem label={t('totalDoses')} value={data.sd} />
      <LineItem label={t('vaccinationDate')} value={formatDate(data.dt)} />
      <LineItem
        label={t('country')}
        value={data.co}
      />
      <LineItem label={t('certificateIssuer')} value={data.is} />
      <LineItem label={t('certificateId')} value={data.ci} />
    </View>
  )
}
