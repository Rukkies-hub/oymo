import React, { useState, useLayoutEffect, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity
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

const Header = ({
  showAratar,
  showLogo,
  showTitle,
  title,
  showBack,
  showMatchAvatar,
  matchAvatar,
  showPhone,
  showAdd,
  matchDetails,
  showNotification,
  backgroundColor,
  showMessageOptions
}) => {
  const navigation = useNavigation()
  const { user, profile } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [notificationCount, setNotificationCount] = useState([])

  useEffect(() => {
    (async () => {
      if (profile) {
        onSnapshot(query(collection(db, 'users', user?.uid, 'notifications'), orderBy('timestamp', 'desc')),
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

  useEffect(() => {
    (async () => {
      if (profile) {
        onSnapshot(query(collection(db, 'users', user?.uid, 'notifications'), where('seen', '==', false)),
          snapshot => {
            setNotificationCount(
              snapshot?.docs?.map(doc => ({
                id: doc?.id,
                notification: doc?.id,
                ...doc?.data()
              }))
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
              <Entypo name='chevron-left' size={24} color={color.black} />
            </TouchableOpacity>
          }

          {
            showLogo &&
            <OymoFont fontStyle={header.logo} fontFamily='pacifico' message='Oymo' />
          }

          {
            showMatchAvatar &&
            <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: getMatchedUserInfo(matchDetails?.users, user?.uid) })}>
              <Image source={{ uri: matchAvatar }} style={header.showMatchAvatar} />
            </TouchableOpacity>
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
                showNotification &&
                <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={header.notificationButton}>
                  <SimpleLineIcons name='bell' size={20} color={color.dark} />

                  {
                    notificationCount?.length > 0 &&
                    <View style={header.notificationCountView}>
                      <OymoFont message={notificationCount?.length} fontStyle={header.notificationCountText} />
                    </View>
                  }
                </TouchableOpacity>
              }
            </>
          }

          {
            profile &&
            <>
              {
                showAdd &&
                <TouchableOpacity onPress={() => navigation.navigate('AddReels')} style={header.showAdd}>
                  <FontAwesome name='plus-square-o' color={color.dark} size={26} />
                </TouchableOpacity>
              }
            </>
          }

          {
            showAratar &&
            <>
              {
                !profile &&
                <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={header.placeholderImage}>
                  <SimpleLineIcons name='user' size={20} color={color.dark} />
                </TouchableOpacity>
              }

              {
                profile &&
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={header.profileImageButton}>
                  <Image source={{ uri: profile?.photoURL }} style={header.profileImage} />
                </TouchableOpacity>
              }
            </>
          }

          {
            showMessageOptions &&
            <TouchableOpacity onPress={() => navigation.navigate('MessageOptions', { matchDetails })} style={header.showMessageOptions}>
              <MaterialCommunityIcons name='dots-vertical' size={24} color={color.dark} />
            </TouchableOpacity>
          }
        </View>
      </View>
    </View>
  )
}

export default Header