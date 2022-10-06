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
                    <Screen name='Drawer' component={Drawer} />
                    <Screen name='Profile' component={Profile} />
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
                  </Group>

                  <Group screenOptions={{ presentation: 'transparentModal' }}>
                    <Screen name='NewMatch' component={NewMatch} />
                    <Screen name='SetupModal' component={SetupModal} />
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
                      name='ViewAvatar'
                      component={ViewAvatar}
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
                <Screen name='Login' component={Login} />
            }
          </>
      }
    </Navigator>
  )
}

export default StackNavigation