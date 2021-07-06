import React, { MutableRefObject } from 'react'
import { NavigationContainerRef } from '@react-navigation/native'

export const isMountedRef: MutableRefObject<boolean> = React.createRef()

export const navigationRef: MutableRefObject<NavigationContainerRef | null> =
  React.createRef()
