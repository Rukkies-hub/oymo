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
import EditProfile from '../screens/editProfile/EditProfile'
import SaveAvatar from '../screens/editProfile/SaveAvatar'
import Gender from '../screens/editProfile/components/Gender'
import color from '../style/color'

const StackNavigation = () => {
  const { user, loadingInitial } = useSelector(state => state.user)

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
          <Screen name='Splash' component={Splash} /> :
          <>
            {
              user ? (
                <>
                  <Group>
                    <Screen name='BottomNavigation' component={BottomNavigation} />
                    <Screen name='Profile' component={Profile} />
                    <Screen name='EditProfile' component={EditProfile} options={{ gestureEnabled: false }} />
                    <Screen name='SaveAvatar' component={SaveAvatar} options={{ gestureEnabled: false }} />
                  </Group>

                  <Group screenOptions={{ presentation: 'transparentModal' }}>
                    <Screen
                      name='Gender'
                      component={Gender}
                      options={{
                        gestureEnabled: false,
                        ...TransitionPresets.FadeFromBottomAndroid,
                        cardStyle: {
                          backgroundColor: color.transparent
                        }
                      }}
                    />
                  </Group>
                </>
              ) :
                (
                  <>
                    <Screen name='Login' component={Login} />
                    <Screen name='Signup' component={Signup} />
                  </>
                )
            }
          </>
      }
    </Navigator>
  )
}

export default StackNavigation