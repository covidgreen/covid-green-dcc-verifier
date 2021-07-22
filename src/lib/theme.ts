import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native'
import {
  configureFonts,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper'
import merge from 'deepmerge'

const fontConfig = {
  web: {
    thin: {
      fontFamily: 'Lato_300Light',
      fontWeight: '300' as const,
    },
    light: {
      fontFamily: 'Lato_300Light',
      fontWeight: '300' as const,
    },
    regular: {
      fontFamily: 'Lato_400Regular',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'Lato_500Medium',
      fontWeight: '500' as const,
    },
  },
  ios: {
    thin: {
      fontFamily: 'Lato_300Light',
      fontWeight: '300' as const,
    },
    light: {
      fontFamily: 'Lato_300Light',
      fontWeight: '300' as const,
    },
    regular: {
      fontFamily: 'Lato_400Regular',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'Lato_500Medium',
      fontWeight: '500' as const,
    },
  },
  android: {
    thin: {
      fontFamily: 'Lato_300Light',
      fontWeight: '300' as const,
    },
    light: {
      fontFamily: 'Lato_300Light',
      fontWeight: '300' as const,
    },
    regular: {
      fontFamily: 'Lato_400Regular',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'Lato_500Medium',
      fontWeight: '500' as const,
    },
  },
}

const CustomTheme = {
  colors: {
    primary: '#275F56',
    error: '#E43325',
  },
  // separate key to avoid TS issues
  palette: {
    lightGrey: '#CCCCCC',
    divider: '#EEEEEF',
    grey: '#6A6A6A',
    white: '#FFFFFF',
    success: '#459530',
    successLight: '#E2F1D8',
    error: '#DF4F41',
    redLight: '#F2DEE5',
    redLighter: '#EFDFE5',
    warning: '#FFFACF',
    background: {
      default: '#FBFBFB',
      dark: '#122C5A',
    },
    textLight: '#505050',
  },
  fonts: configureFonts(fontConfig),
}

const CustomDefaultTheme = {
  colors: {
    background: '#FBFBFB',
    text: '#0F0F0F',
  },
  palette: {
    primaryDark: '#000000',
  },
}

const CustomDarkTheme = {
  colors: {
    background: '#000000',
    text: '#FFFFFF',
  },
  palette: {
    primaryDark: '#AAAAAA',
  },
}

type CustomDefaultThemeType = typeof PaperDefaultTheme &
  typeof NavigationDefaultTheme &
  typeof CustomDefaultTheme &
  typeof CustomTheme

type CustomDarkThemeType = typeof PaperDarkTheme &
  typeof NavigationDarkTheme &
  typeof CustomDarkTheme &
  typeof CustomTheme

export const DefaultTheme = merge.all([
  PaperDefaultTheme,
  NavigationDefaultTheme,
  CustomTheme,
  CustomDefaultTheme,
]) as CustomDefaultThemeType

export const DarkTheme = merge.all([
  PaperDarkTheme,
  NavigationDarkTheme,
  CustomTheme,
  CustomDarkTheme,
]) as CustomDarkThemeType

export const th = {
  spacing: (m = 1) => m * 8,
  inputHeight: 56,
}
