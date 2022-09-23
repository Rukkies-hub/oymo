import React from 'react'

import { createDrawerNavigator } from '@react-navigation/drawer'
import BottomNavigation from './BottomNavigation'
import CustomDrawerContent from './CustomDrawerContent'
import Reels from '../screens/reels/Reels'
import LikesNavigation from '../screens/likes/LikesNavigation'
import Chat from '../screens/chat/Chat'
import AddReels from '../screens/addReels/AddReels'
import Profile from '../screens/profile/Profile'
import EditProfile from '../screens/editProfile/EditProfile'
import Notifications from '../screens/notification/Notifications'

const { Navigator, Screen, DrawerContentScrollView } = createDrawerNavigator()

const Drawer = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        drawerType: 'slide'
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Screen name="MatchScreen" component={BottomNavigation} options={{ title: 'Match' }} />
      <Screen name="Notifications" component={Notifications} options={{ title: 'Notifications' }} />
      <Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
      <Screen name="EditProfile" component={EditProfile} options={{ title: 'Edit Profile' }} />
      <Screen name="AddReelsNav" component={AddReels} options={{ title: 'Post' }} />
    </Navigator>
  )
}

export default Drawer