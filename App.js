import { NavigationContainer } from '@react-navigation/native'

import 'react-native-gesture-handler'
import StackNavigation from './router/StackNavigation'

import { Provider } from 'react-redux'
import { store } from './store'

export default function App () {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </Provider>
  )
}
