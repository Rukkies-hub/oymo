import { View, Text } from 'react-native'
import React, { useEffect } from 'react'

import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'

const Stack = createStackNavigator()

import Login from '../screens/Login'
import Signup from '../screens/Signup'
import BottomNavigation from './BottomNavigation'
import { useDispatch, useSelector } from 'react-redux'
import { auth, db, onAuthStateChanged } from '../hooks/firebase'
import { logout, setProfile, setUser } from '../features/userSlice'
import Splash from './Splash'
import { doc, onSnapshot } from 'firebase/firestore'

const StackNavigation = () => {
  const user = useSelector(state => state.user.user)
  const loadingInitial = useSelector(state => state.user.loadingInitial)

  const dispatch = useDispatch()

  useEffect(() => {
    onAuthStateChanged(auth, userAuth => {
      if (userAuth) {
        dispatch(setUser(userAuth))
      } else {
        dispatch(logout())
      }
    })
  }, [])

  useEffect(() => {
    (() => {
      if (user)
        onSnapshot(doc(db, 'users', user?.uid),
          doc => {
            let profile = doc?.data()
            dispatch(setProfile(profile))
          })
    })()
  }, [user, db])

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        keyboardHandlingEnabled: true,
        animationEnabled: true,
        ...TransitionPresets.SlideFromRightIOS
      }}
    >
      {
        loadingInitial ?
          <Stack.Screen name="Splash" component={Splash} /> :
          <>
            {
              user ? (
                <>
                  <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
                </>
              ) :
                (
                  <>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Signup" component={Signup} />
                  </>
                )
            }
          </>
      }
    </Stack.Navigator>
  )
}

export default StackNavigation