import { NavigationContainer } from '@react-navigation/native'

import 'react-native-gesture-handler'
import StackNavigation from './router/StackNavigation'

import { Provider } from 'react-redux'
import { store } from './store'

import { LogBox } from 'react-native'
import { useFonts } from 'expo-font'
LogBox.ignoreAllLogs()


export default function App () {
  const [loaded] = useFonts({
    logo: require('./assets/fonts/Pacifico/Pacifico-Regular.ttf'),
    text: require('./assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('./assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf'),
    lightText: require('./assets/fonts/Montserrat_Alternates/MontserratAlternates-Light.ttf')
  })

  if (!loaded) return null

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </Provider>
  )
}
