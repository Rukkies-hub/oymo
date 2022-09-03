import { NavigationContainer } from '@react-navigation/native'

import 'react-native-gesture-handler'
import StackNavigation from './router/StackNavigation'

import { Provider } from 'react-redux'
import { store } from './store'

import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()


export default function App () {

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </Provider>
  )
}
