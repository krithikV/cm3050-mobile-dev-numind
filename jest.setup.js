jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// @expo/vector-icons loads its font asynchronously (expo-font) and calls
// setState once it resolves — in tests that async resolution lands after the
// synchronous assertions finish, producing a harmless but noisy "not wrapped
// in act(...)" warning on every render. Stub the icon set with a plain View
// so tests don't pull in the real async font-loading lifecycle at all.
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: View,
  };
});
