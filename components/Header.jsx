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
import { useSelector } from 'react-redux'
import OymoFont from './OymoFont'
import { header } from '../style/header'

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
  const user = useSelector(state => state.user.user)
  const profile = useSelector(state => state.user.profile)

  const [notificationCount, setNotificationCount] = useState([])

  return (
    <View>
      <View
        style={header.container}
      >
        <View
          style={header.subContainer1}
        >
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
            <OymoFont
              fontStyle={header.logo}
              fontFamily='pacifico'
              message='Oymo'
            />
          }

          {
            showAratar &&
            <>
              {
                !profile &&
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditProfile')}
                  style={header.placeholderImage}
                >
                  <SimpleLineIcons name='user' size={20} color={color.dark} />
                </TouchableOpacity>
              }

              {
                profile &&
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                  style={header.profileImageButton}
                >
                  <Image
                    source={{ uri: profile?.photoURL }}
                    style={header.profileImage}
                  />
                </TouchableOpacity>
              }
            </>
          }
        </View>
      </View>
    </View>
  )
}

export default Header