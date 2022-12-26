import {  StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { Roboto_400Regular, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
import { AuthContextProvider } from '@contexts/AuthContexts';

import { THEME} from './src/theme';
import {Loading} from '@components/loading'
import { Routes } from './src/routes';
export default function App() {
  const [fontsloaded] = useFonts({Roboto_400Regular, Roboto_700Bold})
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
      barStyle='light-content'
      backgroundColor='transparent'
      translucent />
      <AuthContextProvider>
        {fontsloaded ? <Routes/>: <Loading/>}
      </AuthContextProvider>

    </NativeBaseProvider>

  );
}


