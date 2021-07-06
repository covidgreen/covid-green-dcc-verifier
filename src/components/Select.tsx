import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker'

import { useTheme } from '@app/context/theme'

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
  },
  dropdownContainer: {
    borderWidth: 0,
  },
  selectedItemLabel: {
    fontWeight: 'bold',
  },
})

type SelectProps = {
  items: ItemType[]
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  value: string
  zIndex?: number
  zIndexInverse?: number
}

export default function Select({
  items,
  onChange,
  placeholder,
  disabled = false,
  value: initialValue,
  zIndex,
  zIndexInverse,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(initialValue)
  const theme = useTheme()

  return (
    <DropDownPicker
      style={styles.container}
      dropDownContainerStyle={[
        styles.dropdownContainer,
        {
          backgroundColor: theme.palette.lightGrey,
        },
      ]}
      selectedItemLabelStyle={styles.selectedItemLabel}
      disabled={disabled}
      open={open}
      value={value}
      items={items}
      placeholder={placeholder}
      setOpen={() => setOpen(f => !f)}
      setValue={setValue}
      onChangeValue={onChange}
      zIndex={zIndex}
      zIndexInverse={zIndexInverse}
    />
  )
}
