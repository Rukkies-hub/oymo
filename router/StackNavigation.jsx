import { View, Text } from 'react-native'
import React, { useEffect } from 'react'

import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'

const { Navigator, Screen, Group } = createStackNavigator()

import Login from '../screens/Login'
import Signup from '../screens/Signup'
import BottomNavigation from './BottomNavigation'
import { useDispatch, useSelector } from 'react-redux'
import { auth, db, onAuthStateChanged } from '../hooks/firebase'
import { logout, setProfile, setUser } from '../features/userSlice'
import Splash from './Splash'
import { doc, onSnapshot } from 'firebase/firestore'
import Profile from '../screens/profile/Profile'

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
    <Navigator
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
          <Screen name="Splash" component={Splash} /> :
          <>
            {
              user ? (
                <>
                  <Group>
                    <Screen name="BottomNavigation" component={BottomNavigation} />
                    <Screen name="Profile" component={Profile} />
                  </Group>
                </>
              ) :
                (
                  <>
                    <Screen name="Login" component={Login} />
                    <Screen name="Signup" component={Signup} />
                  </>
                )
            }
          </>
      }
    </Navigator>
  )
}

export default StackNavigation