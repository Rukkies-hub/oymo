import { View, Text, ImageBackground, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
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
import * as Linking from 'expo-linking'
import { useEffect } from 'react'
import { useState } from 'react'

const CustomDrawerContent = ({ navigation }) => {
  const dispatch = useDispatch()

  const { profile } = useSelector(state => state.user)

  const logoutUser = () => {
    navigation.closeDrawer()
    signOut(auth)
    dispatch(logout())
    dispatch(setProfile(null))
  }

  return (
    <DrawerContentScrollView style={dw.scrollView}>
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
          <TouchableWithoutFeedback onPress={() => navigation.navigate('Profile')}>
            <OymoFont message={profile.username} lines={1} fontStyle={{ color: color.white, fontSize: 20, marginTop: 15 }} />
          </TouchableWithoutFeedback>
        }
      </ImageBackground>

      <DrawerItem
        label={() => <OymoFont message='Match' />}
        onPress={() => navigation.navigate('MatchScreen')}
        icon={() => <AntDesign name='find' size={20} color={color.black} />}
      />
      <DrawerItem
        label={() => <OymoFont message='Notifications' />}
        onPress={() => navigation.navigate('Notifications')}
        icon={() => <SimpleLineIcons name='bell' size={20} color={color.dark} />}
      />
      {
        profile &&
        <DrawerItem
          label={() => <OymoFont message='Profile' />}
          onPress={() => navigation.navigate('Profile')}
          icon={() => <FontAwesome name='user-o' size={20} color={color.dark} />}
        />
      }
      <DrawerItem
        label={() => <OymoFont message='Edit profile' />}
        onPress={() => navigation.navigate('EditProfile')}
        icon={() => <Feather name="edit" size={20} color="black" />}
      />
      <DrawerItem
        label={() => <OymoFont message='New Post' />}
        onPress={() => navigation.navigate('AddReelsNav')}
        icon={() => <FontAwesome name='plus-square-o' color={color.black} size={22} />}
      />
      <TouchableOpacity
        onPress={() => {
          navigation.closeDrawer()
          navigation.navigate('Upgrade')
        }}
        style={dw.upgradeButton}
      >
        <Image source={require('../assets/star.png')} style={dw.star} />
        <OymoFont message='Oymo Premium' fontStyle={dw.upgradeButtonText} />
      </TouchableOpacity>

      <TouchableOpacity onPress={logoutUser} style={dw.logoutButton}>
        <OymoFont message='Logout' fontStyle={dw.logoutButtonText} />
      </TouchableOpacity>
    </DrawerContentScrollView>
  )
}

export default CustomDrawerContent