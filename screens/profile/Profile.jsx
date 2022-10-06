import React from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import color from '../../style/color'
import { profile } from '../../style/profile'

import { useIsFocused, useNavigation } from '@react-navigation/native'

import * as NavigationBar from 'expo-navigation-bar'
import { useSelector } from 'react-redux'
import ProfileDetails from './ProfileDetailes'
import Reels from './Reels'
import Events from './Events'
import Header from '../../components/Header'
import Bar from '../../components/Bar'
import OymoFont from '../../components/OymoFont'
import { useState } from 'react'

const Profile = () => {
  const { user, profile: _profile } = useSelector(state => state.user)
  const focus = useIsFocused()
  const navigation = useNavigation()

  const [view, setView] = useState('reels')

  if (focus) {
    NavigationBar.setVisibilityAsync('hidden')
    NavigationBar.setBehaviorAsync('overlay-swipe')
  }

  navigation.addListener('blur', () => {
    NavigationBar.setVisibilityAsync('visible')
  })

  return (
    <View style={profile.container}>
      <Bar color={'dark'} />

      <Header
        showBack
        showTitle
        showNotification
        title={_profile?.username}
        backgroundColor={color.transparent}
        showAratar={_profile?.photoURL ? true : false}
      />
      <ScrollView style={profile.container} showsVerticalScrollIndicator={false}>
        <>
          {
            _profile && user &&
            <>
              <ProfileDetails profile={_profile} user={user} />
              <View style={profile.navigationView}>
                <TouchableOpacity onPress={() => setView('reels')} style={profile.navigationViewButtons}>
                  <OymoFont message='Reels' fontStyle={{ color: view == 'reels' ? color.black : color.lightText }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setView('events')} style={profile.navigationViewButtons}>
                  <OymoFont message='Events' fontStyle={{ color: view == 'events' ? color.black : color.lightText }} />
                </TouchableOpacity>
              </View>
              {
                view == 'reels' ?
                  <Reels /> :
                  <Events />
              }
            </>
          }
        </>
      </ScrollView>
    </View>
  )
}

export default Profile