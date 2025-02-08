const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  return {
    ...config,
    resolver: {
      ...config.resolver,
      // 이미지 확장자 명시적 추가
      assetExts: [...config.resolver.assetExts, 'png', 'jpg', 'jpeg', 'gif'],
      // 기본 소스 확장자 유지
      sourceExts: [...config.resolver.sourceExts],
      // React Navigation 에셋 경로 추가
      assets: ['./node_modules/@react-navigation/elements/src/assets'],
      resolverMainFields: ['sbmodern', 'react-native', 'browser', 'main'],
      extraNodeModules: new Proxy({}, {
        get: (target, name) => {
          if (name === '@') {
            return path.resolve(__dirname, 'src');
          }
          return path.join(__dirname, `node_modules/${name}`);
        },
      }),
    },
    watchFolders: [path.resolve(__dirname)],
  };
})();
