import React, { useState, useEffect } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Text
} from 'react-native'

import {
  FontAwesome,
  Entypo,
  SimpleLineIcons,
  MaterialCommunityIcons
} from '@expo/vector-icons'

import { useNavigation } from '@react-navigation/native'

import color from '../style/color'

import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'

import { db } from '../hooks/firebase'

import getMatchedUserInfo from '../lib/getMatchedUserInfo'
import { useDispatch, useSelector } from 'react-redux'
import OymoFont from './OymoFont'
import { header } from '../style/header'
import { setNotificatios } from '../features/notificationSlice'
import { nav } from '../style/navigation'

const Header = ({
  showAratar,
  showLogo,
  showTitle,
  title,
  showBack,
  showMatchAvatar,
  matchAvatar,
  showPhone,
  matchDetails,
  showNotification,
  backgroundColor,
  showChatOptions,
  textColor,
  showAdd
}) => {
  const navigation = useNavigation()
  const { user, profile, theme } = useSelector(state => state.user)
  const dispatch = useDispatch()

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  useEffect(() => {
    (async () => {
      if (profile) {
        onSnapshot(query(collection(db, 'users', id, 'notifications'), orderBy('timestamp', 'desc')),
          snapshot => {
            dispatch(
              setNotificatios(
                snapshot?.docs?.map(doc => ({
                  notification: doc?.id,
                  ...doc?.data(),
                  id: doc?.id
                }))
              )
            )
          })
      }
    })()
  }, [])

  return (
    <View>
      <View style={[header.container, { backgroundColor: backgroundColor ? backgroundColor : color.transparent }]}>
        <View style={header.leftContainer}>
          {
            showBack &&
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              onLongPress={() => navigation.navigate('Match')}
              style={header.backButton}
            >
              <Entypo name='chevron-left' size={24} color={textColor || theme ? color.white : color.black} />
            </TouchableOpacity>
          }

          {
            showLogo &&
            <OymoFont fontStyle={{ ...header.logo, color: theme ? color.white : color.black }} fontFamily='pacifico' message='Oymo' />
          }

          {
            showMatchAvatar &&
            <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: getMatchedUserInfo(matchDetails?.users, id), nearby: false })}>
              <Image source={{ uri: matchAvatar }} style={header.showMatchAvatar} />
            </TouchableOpacity>
          }

          {
            showTitle &&
            <Text style={[header.showTitle, { color: theme ? color.white : color.dark }]}>
              {title}
            </Text>
          }
        </View>

        <View style={header.rightContainer}>
          {
            showPhone &&
            <TouchableOpacity style={header.showPhone}>
              <Entypo name='phone' size={20} color={color.dark} />
            </TouchableOpacity>
          }

          {
            profile &&
            <>
              {
                showAdd &&
                <TouchableOpacity onPress={() => {
                  if (profile?.photoURL != undefined && profile?.username != undefined)
                    navigation.navigate('AddReels')
                  else
                    navigation.navigate('SetupModal')
                }}
                  style={[header.notificationButton, { backgroundColor: theme ? color.dark : color.offWhite }]}>
                  <FontAwesome name='plus-square-o' color={theme ? color.white : color.black} size={22} />
                </TouchableOpacity>
              }
            </>
          }

          {
            profile &&
            <>
              {
                showNotification &&
                <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={[header.notificationButton, { backgroundColor: theme ? color.dark : color.offWhite }]}>
                  <SimpleLineIcons name='bell' size={20} color={theme ? color.white : color.dark} />

                  {
                    profile?.notificationCount > 0 &&
                    <View style={header.notificationCountView}>
                      <OymoFont message={profile?.notificationCount} fontStyle={header.notificationCountText} />
                    </View>
                  }
                </TouchableOpacity>
              }
            </>
          }

          {
            showAratar &&
            <>
              {
                !profile ?
                  <TouchableOpacity onPress={() => navigation.openDrawer == undefined ? navigation.navigate('EditProfile') : navigation.openDrawer()} style={header.placeholderImage}>
                    <FontAwesome name='user-o' size={22} color={theme ? color.white : color.dark} />
                  </TouchableOpacity> :
                  <TouchableOpacity onPress={() => navigation.openDrawer == undefined ? navigation.navigate('Profile') : navigation.openDrawer()} style={header.profileImageButton}>
                    {
                      profile?.photoURL ?
                        <View style={{ position: 'relative' }}>
                          {
                            profile?.paid &&
                            <View style={nav.paidImageContainer}>
                              <Image source={require('../assets/vip.png')} style={nav.paidImage} />
                            </View>
                          }
                          <Image source={{ uri: profile?.photoURL }} style={header.profileImage} />
                        </View> :
                        <FontAwesome name='user-o' size={22} color={theme ? color.white : color.dark} />
                    }
                  </TouchableOpacity>
              }
            </>
          }

          {
            showChatOptions &&
            <TouchableOpacity onPress={() => navigation.navigate('ChatOptions', { matchDetails })} style={header.showMessageOptions}>
              <MaterialCommunityIcons name='dots-vertical' size={24} color={theme ? color.white : color.dark} />
            </TouchableOpacity>
          }
        </View>
      </View>
    </View>
  )
}

export default Header