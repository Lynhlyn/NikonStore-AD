import type { Config } from 'tailwindcss';

const BaseColors = {
  white: '#FFFFFF',

  red100: '#FFE1E7',
  red200: '#FFC8D6',
  red300: '#FF9CB3',
  red400: '#FF2E68',
  red500: '#E1024F',
  red600: '#D1003F',
  red700: '#FF1717',

  violet100: '#E5E9FA',
  violet200: '#CFD5F6',
  violet300: '#9398E6',
  violet400: '#7977DB',
  violet500: '#695ECD',
  violet600: '#5A4EB4',

  green100: '#E0F8E9',
  green200: '#C3EFD4',
  green300: '#95E0B3',
  green400: '#5FC98A',
  green500: '#40C174',
  green600: '#30A65F',

  yellow100: '#FFF9EB',
  yellow200: '#FFEEC6',
  yellow300: '#FFDB88',
  yellow400: '#FFCC67',
  yellow500: '#FFBF41',
  yellow600: '#F8B83A',

  orange100: '#FFEDD5',
  orange200: '#FED8AA',
  orange300: '#FEBB73',
  orange400: '#FC943B',
  orange500: '#FA781A',
  orange600: '#EB5A0B',

  blue100: '#DFEAFA',
  blue200: '#C6DAF7',
  blue300: '#9FC2F1',
  blue400: '#71A1E9',
  blue500: '#4A7CE0',
  blue600: '#3B64D5',

  brand100: '#E1F8F5',
  brand200: '#D1F0ED',
  brand300: '#B9E8E4',
  brand400: '#33BBB2',
  brand500: '#00AA9F',
  brand600: '#4CD596',
  brand700: '#38DBD0',

  gray50: '#F2F5F7',
  gray100: '#E7EAED',
  gray150: '#E6E6E6',
  gray200: '#D8DCDF',
  gray300: '#B9BEC0',
  gray400: '#999999',
  gray500: '#646464',
  gray600: '#3D3D3D',
  gray700: '#202020',
  gray800: '#CCC',
};

const colorsConfig = {
  transparent: 'rgba(0,0,0,0)',
  circleButtonBackground: '#E1E1EF',
  circleButtonColor: '#44427D',
  bgOnboard: '#E8F3F1',
  bgProgressInActive: '#ECECEC',
  bgVerifyCode: '#EFF9F9',
  bgOtherContact: '#EF3F47',
  borderNeutralDark: BaseColors.gray200,
  borderNeutralLight: BaseColors.gray50,
  borderSoftNeutral: BaseColors.gray100,
  borderNeutralDisable: BaseColors.gray300,
  borderPrimary: BaseColors.brand500,
  borderDanger: BaseColors.red500,

  fgBase: BaseColors.white,
  fgWarning: BaseColors.orange500,
  fgInProgress: BaseColors.blue500,
  fgTenant: BaseColors.yellow500,
  fgSuccess: BaseColors.green500,
  fgDanger: BaseColors.red500,
  fgPrimary: BaseColors.brand500,
  fgSupplier: BaseColors.violet500,
  fgHyperlink: '#0D42FF',

  fgNeutralDisable: BaseColors.gray300,
  fgNeutralSubtle: BaseColors.gray400,
  fgNeutralNormal: BaseColors.gray500,
  fgNeutralEmphasis: BaseColors.gray600,
  fgNeutralHighEmphasis: BaseColors.gray700,

  bgBase: BaseColors.white,

  bgWarningTonalDefault: BaseColors.orange100,
  bgWarningTonalHover: BaseColors.orange200,
  bgWarningTonalFocus: BaseColors.orange300,

  bgWarningSolidDefault: BaseColors.orange500,
  bgWarningSolidHover: BaseColors.orange400,
  bgWarningSolidFocus: BaseColors.orange600,

  bgSuccessTonalDefault: BaseColors.green100,
  bgSuccessTonalHover: BaseColors.green200,
  bgSuccessTonalFocus: BaseColors.green300,

  bgSuccessSolidDefault: BaseColors.green500,
  bgSuccessSolidHover: BaseColors.green400,
  bgSuccessSolidFocus: BaseColors.green600,

  bgDangerTonalDefault: BaseColors.red100,
  bgDangerTonalHover: BaseColors.red200,
  bgDangerTonalFocus: BaseColors.red300,

  bgDangerSolidDefault: BaseColors.red500,
  bgDangerSolidHover: BaseColors.red400,
  bgDangerSolidFocus: BaseColors.red700,

  bgPrimaryTonalDefault: BaseColors.brand100,
  bgPrimaryTonalHover: BaseColors.brand200,
  bgPrimaryTonalFocus: BaseColors.brand300,

  bgPrimarySolidDefault: 'var(--bg-primary-solid-default)',
  bgPrimarySolidHover: 'var(--bg-primary-solid-hover)',
  bgPrimarySolidFocus: 'var(--bg-primary-solid-focus)',

  bgPrimaryHighContrast: BaseColors.brand700,

  bgPrimaryDisable: BaseColors.brand300,

  bgNeutralTonalDefault: BaseColors.gray50,
  bgNeutralTonalHover: BaseColors.gray100,
  bgNeutralSkeleton: BaseColors.gray150,
  bgNeutralTonalFocus: BaseColors.gray200,
  bgNeutralTonalDisable: BaseColors.gray800,
  bgNeutralDisable: BaseColors.gray200,
  bgNeutralTonalSkeleton: BaseColors.gray100,
  bgNeutralSolidDefault: BaseColors.gray100,

  bgOverlayDark: 'rgba(0, 0, 0, 0.6)',
  bgOverlayDarkish: 'rgba(0, 0, 0, 0.7)',
  bgOverlayLight: 'rgba(0, 0, 0, 0.2)',
  bgOverlaySemiTransparent: 'rgba(0, 0, 0, 0.40)',

  bgInProgressTonalDefault: BaseColors.blue100,
  bgInProgressTonalFocus: BaseColors.blue300,

  shadowNeutral: '#00000080',
};
const config: Config = {
  darkMode: ['class'],
  content: [
    './src/common/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/core/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		keyframes: {
  			zoomInLeft: {
  				'0%': {
  					transform: 'scale(0) translateX(100%)'
  				},
  				'100%': {
  					transform: 'scale(1) translateX(0)'
  				}
  			},
  			blob: {
  				'0%, 100%': {
  					transform: 'translate(0, 0) scale(1)'
  				},
  				'33%': {
  					transform: 'translate(30px, -50px) scale(1.1)'
  				},
  				'66%': {
  					transform: 'translate(-20px, 20px) scale(0.9)'
  				}
  			}
  		},
  		boxShadow: {
  			card: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        wrapper: '0px 10px 20px 0px rgba(0, 0, 0, 0.05)',
        global: '0px 0px 4px 0px rgba(0, 0, 0, 0.05)'
  		},
  		animation: {
  			zoomInLeft: 'zoomInLeft 3s ease-in-out forwards',
  			blob: 'blob 7s infinite'
  		},
  		colors: {
                ...BaseColors,
                ...colorsConfig,
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
