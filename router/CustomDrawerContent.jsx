import { View, Text, ImageBackground, Image, TouchableOpacity, TouchableWithoutFeedback, Pressable } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { dw } from '../style/drawer'
import { AntDesign, Feather, FontAwesome, Ionicons, SimpleLineIcons } from '@expo/vector-icons'
import color from '../style/color'
import OymoFont from '../components/OymoFont'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { logout, setProfile } from '../features/userSlice'
import { signOut } from 'firebase/auth'
import { auth } from '../hooks/firebase'

const CustomDrawerContent = ({ navigation }) => {
  const dispatch = useDispatch()

  const { profile, theme } = useSelector(state => state.user)

  const logoutUser = () => {
    navigation.closeDrawer()
    signOut(auth)
    dispatch(logout())
    dispatch(setProfile(null))
  }

  return (
    <DrawerContentScrollView style={[dw.scrollView, { backgroundColor: theme ? color.dark : color.white }]}>
      <ImageBackground source={!profile?.photoURL ? require('../assets/background2.jpg') : { uri: profile?.photoURL }} blurRadius={70} style={dw.imgBg}>
        {
          !profile?.photoURL ?
            <View style={dw.avatarView}>
              <FontAwesome name='user-o' size={32} color={color.white} />
            </View> :
            <TouchableWithoutFeedback style={dw.avatarView} onPress={() => navigation.navigate('Profile')}>
              <Image source={{ uri: profile?.photoURL }} style={dw.avatar} />
            </TouchableWithoutFeedback>
        }
        {
          profile &&
          <>
            <Pressable onPress={() => navigation.navigate('Profile')} style={{ flexDirection: 'row', marginTop: 15 }}>
              <OymoFont message={profile?.username} lines={1} fontFamily='montserrat_bold' fontStyle={{ color: theme ? color.black : color.white, fontSize: 20, marginRight: 10 }} />
              {profile?.age != undefined && <OymoFont message={profile?.age} lines={1} fontStyle={{ color: theme ? color.black : color.white, fontSize: 20 }} />}
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Profile')} style={dw.pointsButton}>
              <Image source={require('../assets/points.png')} style={dw.pointsImage} />
              <OymoFont message={`${profile?.coins} Points`} lines={1} fontStyle={{ color: theme ? color.black : color.white, fontSize: 16 }} />
            </Pressable>
          </>
        }
      </ImageBackground>

      <DrawerItem
        label={() => <OymoFont message='Match' fontStyle={{ color: theme ? color.white : color.black }} />}
        onPress={() => navigation.navigate('MatchScreen')}
        icon={() => <AntDesign name='find' size={20} color={theme ? color.white : color.black} />}
      />
      <DrawerItem
        label={() => <OymoFont message='Notifications' fontStyle={{ color: theme ? color.white : color.black }} />}
        onPress={() => {
          navigation.closeDrawer()
          navigation.navigate('Notifications')
        }}
        icon={() => <SimpleLineIcons name='bell' size={20} color={theme ? color.white : color.black} />}
      />
      {
        profile &&
        <DrawerItem
          label={() => <OymoFont message='Profile' fontStyle={{ color: theme ? color.white : color.black }} />}
          onPress={() => {
            navigation.closeDrawer()
            navigation.navigate('Profile')
          }}
          icon={() => <FontAwesome name='user-o' size={20} color={theme ? color.white : color.black} />}
        />
      }
      <DrawerItem
        label={() => <OymoFont message='Edit profile' fontStyle={{ color: theme ? color.white : color.black }} />}
        onPress={() => {
          navigation.closeDrawer()
          navigation.navigate('EditProfile')
        }}
        icon={() => <Feather name="edit" size={20} color={theme ? color.white : color.black} />}
      />
      <DrawerItem
        label={() => <OymoFont message='Settings' fontStyle={{ color: theme ? color.white : color.black }} />}
        onPress={() => {
          navigation.closeDrawer()
          navigation.navigate('Settings')
        }}
        icon={() => <Ionicons name="cog-outline" size={20} color={theme ? color.white : color.black} />}
      />
      <DrawerItem
        label={() => <OymoFont message='New Post' fontStyle={{ color: theme ? color.white : color.black }} />}
        onPress={() => {
          navigation.closeDrawer()
          navigation.navigate('AddReelsNav')
        }}
        icon={() => <FontAwesome name='plus-square-o' color={theme ? color.white : color.black} size={22} />}
      />

      <View style={{ width: '100%', height: 1, backgroundColor: theme ? color.lightBorderColor : color.borderColor, marginVertical: 10 }} />

      <TouchableOpacity
        style={[dw.upgradeButton, { backgroundColor: theme ? color.dark : color.white }]}
        onPress={() => {
          navigation.closeDrawer()
          navigation.navigate('Events')
        }}
      >
        <Image source={require('../assets/event.png')} style={dw.star} />
        <OymoFont message='Events' fontStyle={{ ...dw.upgradeButtonText, color: theme ? color.white : color.black }} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[dw.upgradeButton, { backgroundColor: theme ? color.dark : color.white }]}
        onPress={() => {
          navigation.closeDrawer()
          navigation.navigate('Rooms')
        }}
      >
        <Image source={require('../assets/room.png')} style={dw.star} />
        <OymoFont message='Rooms' fontStyle={{ ...dw.upgradeButtonText, color: theme ? color.white : color.black }} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.closeDrawer()
          navigation.navigate('Upgrade')
        }}
        style={[dw.upgradeButton, { backgroundColor: theme ? color.dark : color.white }]}
      >
        <Image source={require('../assets/star.png')} style={dw.star} />
        <OymoFont message='Oymo Premium' fontStyle={{ ...dw.upgradeButtonText, color: theme ? color.white : color.black }} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={logoutUser}
        style={[dw.upgradeButton, { backgroundColor: theme ? color.dark : color.white }]}
      >
        <Image source={require('../assets/power.png')} style={dw.star} />
        <OymoFont message='Logout' fontStyle={{ ...dw.upgradeButtonText, color: theme ? color.white : color.black }} />
      </TouchableOpacity>
    </DrawerContentScrollView>
  )
}

export default CustomDrawerContent