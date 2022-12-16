import React from 'react'

import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'

const { Navigator, Screen, Group } = createStackNavigator()

import Login from '../screens/Login'
import { useSelector } from 'react-redux'
import Splash from './Splash'
import Profile from '../screens/profile/Profile'
import EditProfile from '../screens/editProfile/EditProfile'
import SaveAvatar from '../screens/editProfile/SaveAvatar'
import Gender from '../screens/editProfile/components/Gender'
import color from '../style/color'
import ReelsComment from '../screens/ReelsComment'
import ViewReelsComments from '../screens/viewReelsComments/ViewReelsComments'
import UserProfile from '../screens/userProfile/UserProfile'
import ViewReel from '../screens/viewReel/ViewReel'
import Message from '../screens/message/Message'
import ViewAvatar from '../screens/modals/ViewAvatar'
import ViewVideo from '../screens/modals/ViewVideo'
import MessageOptions from '../screens/modals/MessageOptions'
import MessageCamera from '../screens/message/MessageCamera'
import PreviewMessageImage from '../screens/message/PreviewMessageImage'
import AddReels from '../screens/addReels/AddReels'
import SaveReels from '../screens/addReels/SaveReels'
import Notifications from '../screens/notification/Notifications'
import NewMatch from '../screens/modals/NewMatch'
import SetupModal from '../screens/modals/SetupModal'
import Passion from '../screens/editProfile/components/Passion'
import Drawer from './Drawer'
import Upgrade from '../screens/Upgrade'
import Events from '../screens/events/Events'
import Rooms from '../screens/rooms/Rooms'
import Craate from '../screens/events/screens/Craate'
import Event from '../screens/event/Event'
import ViewAtendees from '../screens/event/screens/ViewAtendees'
import Room from '../screens/room/Room'
import Map from '../screens/Map'
import DOB from '../screens/editProfile/screens/DOB'
import ReelsOption from '../screens/modals/ReelsOption'
import Settings from '../screens/settings/Settings'
import { useIsFocused } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'
import EventOption from '../screens/modals/EventOption'
import Alert from '../screens/modals/Alert'
import ChatOptions from '../screens/modals/chatOptions/ChatOptions'
import Welcome from '../screens/Welcome'
import Signup from '../screens/Signup'
import ForgotPassword from '../screens/ForgotPassword'
import Step1 from '../screens/Step1'
import Step2 from '../screens/Step2'
import BottomNavigation from './BottomNavigation'
import DeleteGalleryImage from '../screens/modals/DeleteGalleryImage'

const StackNavigation = () => {
  const { user, loadingInitial, theme, setup } = useSelector(state => state.user)

  const focused = useIsFocused()

  if (focused) {
    NavigationBar.setBackgroundColorAsync(theme ? color.dark : color.white)
    NavigationBar.setButtonStyleAsync(theme ? 'light' : 'dark')
  }



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
                  {
                    setup ?
                      <Group>
                        <Screen name='Step1' component={Step1} />
                        <Screen name='Step2' component={Step2} />
                      </Group> :
                      <Group>
                        <Screen name='BottomNavigation' component={BottomNavigation} />
                        <Screen name='Profile' component={Profile} options={{ gestureEnabled: false }} />
                        <Screen name='EditProfile' component={EditProfile} options={{ gestureEnabled: false }} />
                        <Screen name='SaveAvatar' component={SaveAvatar} options={{ gestureEnabled: false }} />
                        <Screen name='ReelsComment' component={ReelsComment} />
                        <Screen name='ViewReelsComments' component={ViewReelsComments} />
                        <Screen name='UserProfile' component={UserProfile} />
                        <Screen name='ViewReel' component={ViewReel} />
                        <Screen name='Message' component={Message} />
                        <Screen name='ViewVideo' component={ViewVideo} />
                        <Screen name='MessageCamera' component={MessageCamera} />
                        <Screen name='PreviewMessageImage' component={PreviewMessageImage} />
                        <Screen name='AddReels' component={AddReels} />
                        <Screen name='SaveReels' component={SaveReels} />
                        <Screen name='Notifications' component={Notifications} />
                        <Screen name='Events' component={Events} />
                        <Screen name='Rooms' component={Rooms} />
                        <Screen name='Event' component={Event} />
                        <Screen name='Room' component={Room} />
                        <Screen name='Map' component={Map} />
                        <Screen name='Settings' component={Settings} options={{ gestureEnabled: false }} />
                      </Group>
                  }

                  <Group screenOptions={{ presentation: 'transparentModal' }}>
                    <Screen name='NewMatch' component={NewMatch} />
                    <Screen name='SetupModal' component={SetupModal} />
                    <Screen
                      name='Alert'
                      component={Alert}
                      options={{
                        gestureEnabled: false,
                        ...TransitionPresets.FadeFromBottomAndroid,
                        cardStyle: {
                          backgroundColor: color.transparent
                        }
                      }}
                    />
                    <Screen
                      name='Upgrade'
                      component={Upgrade}
                      options={{
                        gestureEnabled: false,
                        ...TransitionPresets.FadeFromBottomAndroid,
                        cardStyle: {
                          backgroundColor: color.transparent
                        }
                      }}
                    />
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
                    <Screen
                      name='MessageOptions'
                      component={MessageOptions}
                      options={{
                        gestureEnabled: false,
                        ...TransitionPresets.FadeFromBottomAndroid,
                        cardStyle: {
                          backgroundColor: color.transparent
                        }
                      }}
                    />
                    <Screen
                      name='ChatOptions'
                      component={ChatOptions}
                      options={{
                        gestureEnabled: false,
                        ...TransitionPresets.FadeFromBottomAndroid,
                        cardStyle: {
                          backgroundColor: color.transparent
                        }
                      }}
                    />
                    <Screen
                      name='Craate'
                      component={Craate}
                      options={{
                        ...TransitionPresets.FadeFromBottomAndroid,
                        cardStyle: {
                          backgroundColor: color.transparent
                        }
                      }}
                    />
                    <Screen
                      name='ViewAtendees'
                      component={ViewAtendees}
                      options={{
                        ...TransitionPresets.FadeFromBottomAndroid,
                        cardStyle: {
                          backgroundColor: color.transparent
                        }
                      }}
                    />
                    <Screen
                      name='DOB'
                      component={DOB}
                      options={{
                        ...TransitionPresets.FadeFromBottomAndroid,
                        cardStyle: {
                          backgroundColor: color.transparent
                        }
                      }}
                    />
                    <Screen
                      name='ReelsOption'
                      component={ReelsOption}
                      options={{
                        ...TransitionPresets.FadeFromBottomAndroid,
                        cardStyle: {
                          backgroundColor: color.transparent
                        }
                      }}
                    />
                    <Screen
                      name='EventOption'
                      component={EventOption}
                      options={{
                        ...TransitionPresets.FadeFromBottomAndroid,
                        cardStyle: {
                          backgroundColor: color.transparent
                        }
                      }}
                    />
                    <Screen
                      name='ViewAvatar'
                      component={ViewAvatar}
                      options={{
                        ...TransitionPresets.FadeFromBottomAndroid,
                        cardStyle: {
                          backgroundColor: color.transparent
                        }
                      }}
                    />
                    <Screen
                      name='DeleteGalleryImage'
                      component={DeleteGalleryImage}
                      options={{
                        ...TransitionPresets.FadeFromBottomAndroid,
                        cardStyle: {
                          backgroundColor: color.transparent
                        }
                      }}
                    />
                  </Group>

                  <Group screenOptions={{ presentation: 'modal' }}>
                    <Screen name='Passion' component={Passion} />
                  </Group>
                </>
              ) :
                <>
                  <Group>
                    <Screen name='Welcome' component={Welcome} />
                    <Screen name='Login' component={Login} />
                    <Screen name='Signup' component={Signup} />
                    <Screen name='ForgotPassword' component={ForgotPassword} />
                  </Group>
                  <Group screenOptions={{ presentation: 'transparentModal' }}>
                    <Screen
                      name='Alert'
                      component={Alert}
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
            }
          </>
      }
    </Navigator>
  )
}

export default StackNavigation