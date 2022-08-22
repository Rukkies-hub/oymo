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

  const [notificationCount, setNotificationCount] = useState([])

  return (
    <View>
      <View
        style={{
          backgroundColor: color.white,
          height: 50,
          marginTop: 40,
          paddingHorizontal: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          {
            showBack &&
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              onLongPress={() => navigation.navigate('Match')}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10
              }}
            >
              <Entypo name='chevron-left' size={24} color={color.black} />
            </TouchableOpacity>
          }

          {
            showLogo &&
            <OymoFont
              fontStyle={{
                fontSize: 30,
                margin: 0,
                marginTop: -10,
                color: color.black
              }}
              fontFamily='pacifico'
              message='Oymo'
            />
          }
        </View>
      </View>
    </View>
  )
}

export default Header