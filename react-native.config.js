module.exports = {
  assets: ['./node_modules/@react-navigation/elements/src/assets'],
  dependencies: {
    '@react-navigation/native': {
      platforms: {
        ios: null,
        android: null,
      },
    },
    'react-native': {
      hermes: false,
    },
  },
};
