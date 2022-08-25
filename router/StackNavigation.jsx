import React from 'react'

import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'

const { Navigator, Screen, Group } = createStackNavigator()

import Login from '../screens/Login'
import Signup from '../screens/Signup'
import BottomNavigation from './BottomNavigation'
import { useSelector } from 'react-redux'
import Splash from './Splash'
import Profile from '../screens/profile/Profile'
import EditProfile from '../screens/editProfile/EditProfile'
import SaveAvatar from '../screens/editProfile/SaveAvatar'
import Gender from '../screens/editProfile/components/Gender'
import color from '../style/color'
import ReelsComment from '../screens/ReelsComment'
import ViewReelsComments from '../screens/viewReelsComments/ViewReelsComments'

const StackNavigation = () => {
  const { user, loadingInitial } = useSelector(state => state.user)

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
                    <Screen name='ReelsComment' component={ReelsComment} />
                    <Screen name='ViewReelsComments' component={ViewReelsComments} />
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