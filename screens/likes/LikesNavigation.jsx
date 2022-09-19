import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import Likes from './Likes'
import Passes from './Passes'
import { useSelector } from 'react-redux'
import { likes } from '../../style/likes'

import OymoFont from '../../components/OymoFont'
import color from '../../style/color'

const LikesNavigation = ({ navigation }) => {
  const { profile } = useSelector(state => state.user)
  const [visible, setVisible] = useState('likes')

  return (
    <View style={likes.container}>
      {
        !profile &&
        <View style={likes.setupView}>
          <View style={likes.setupViewSub}>
            <OymoFont message='Creat a profile' fontFamily='montserrat_bold' fontStyle={likes.cp} />
            <OymoFont message='You do not have a profile.' fontStyle={{ color: color.dark }} />
            <OymoFont message='Please create a profile to perform any action' fontStyle={{ color: color.dark }} />
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              style={likes.ep}
            >
              <OymoFont message='Create a profile' fontStyle={{ color: color.white }} />
            </TouchableOpacity>
          </View>
        </View>
      }

      {
        profile &&
        <>
          <View style={likes.nav}>
            <TouchableOpacity onPress={() => setVisible('likes')} style={likes.navButton}>
              <OymoFont message='Likes' fontStyle={{ color: visible == 'likes' ? color.red : color.dark }} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setVisible('passes')} style={likes.navButton}>
              <OymoFont message='Passes' fontStyle={{ color: visible == 'passes' ? color.red : color.dark }} />
            </TouchableOpacity>
          </View>

          {
            visible == 'likes' &&
            <Likes />
          }

          {/* {
            visible == 'passes' &&
            <Passes />
          } */}
        </>
      }
    </View>
  )
}

export default LikesNavigation