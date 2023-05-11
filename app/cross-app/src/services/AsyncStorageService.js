import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageService = {
  setToken: async ({ accessToken, refreshToken }) => {
    await AsyncStorage.setItem('@accessToken', accessToken);
    await AsyncStorage.setItem('@refreshToken', refreshToken);
    await AsyncStorage.setItem('@isLoggedIn', 'true');
  },
  setUser: async (user) => {
    await AsyncStorage.setItem('@user', JSON.stringify(user));
  },
  getAccessToken: async () => {
    const accessToken = await AsyncStorage.getItem('@accessToken');
    return accessToken;
  },
  getLogginState: async () => {
    const isLoggedIn = await AsyncStorage.getItem('@isLoggedIn');
    return !!isLoggedIn;
  },
  clearAll: async () => {
    try {
      await AsyncStorage.removeItem('@accessToken');
      await AsyncStorage.removeItem('@user');
      await AsyncStorage.setItem('@isLoggedIn', 'false');
    } catch (e) {
      // saving error
      console.log(e);
    }
  },
};

export default AsyncStorageService;