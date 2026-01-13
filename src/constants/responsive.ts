import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Responsive multiplier based on screen width
const baseWidth = 375; // iPhone 11 width
const responsiveMultiplier = windowWidth / baseWidth;

export const Responsive = {
  // Spacing
  spacing: {
    xs: 4 * responsiveMultiplier,
    sm: 8 * responsiveMultiplier,
    md: 12 * responsiveMultiplier,
    lg: 16 * responsiveMultiplier,
    xl: 20 * responsiveMultiplier,
    xxl: 24 * responsiveMultiplier,
    xxxl: 32 * responsiveMultiplier,
  },

  // Font sizes
  fontSize: {
    xs: 10 * responsiveMultiplier,
    sm: 12 * responsiveMultiplier,
    md: 14 * responsiveMultiplier,
    lg: 16 * responsiveMultiplier,
    xl: 18 * responsiveMultiplier,
    xxl: 20 * responsiveMultiplier,
    xxxl: 24 * responsiveMultiplier,
    display: 32 * responsiveMultiplier,
  },

  // Width percentages
  width: {
    full: '100%',
    half: '50%',
    third: '33.33%',
    twoThird: '66.66%',
    quarter: '25%',
    threeQuarter: '75%',
  },

  // Responsive sizes based on screen width
  size: (baseSize: number) => baseSize * responsiveMultiplier,

  // Container padding
  containerPadding: {
    horizontal: Math.max(10, 16 * responsiveMultiplier),
    vertical: Math.max(10, 20 * responsiveMultiplier),
  },

  // Border radius
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 15,
    xl: 20,
    full: 999,
  },

  // Screen dimensions
  screen: {
    width: windowWidth,
    height: windowHeight,
    isSmallScreen: windowWidth < 350,
    isMediumScreen: windowWidth >= 350 && windowWidth < 430,
    isLargeScreen: windowWidth >= 430,
  },
};
