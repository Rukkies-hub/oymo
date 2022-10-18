import React from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import color from '../../style/color'
import { profile } from '../../style/profile'

import { useSelector } from 'react-redux'
import ProfileDetails from './ProfileDetailes'
import Reels from './Reels'
import Events from './Events'
import Header from '../../components/Header'
import OymoFont from '../../components/OymoFont'
import { useState } from 'react'

const Profile = () => {
  const { user, profile: _profile, theme } = useSelector(state => state.user)

  const [view, setView] = useState('reels')

  return (
    <View style={[profile.container, { backgroundColor: theme ? color.dark : color.white }]}>
      <Header
        showBack
        showTitle
        showNotification
        title={_profile?.username}
        showAratar={_profile?.photoURL ? true : false}
      />
      <ScrollView style={[profile.container, { backgroundColor: theme ? color.dark : color.white }]} showsVerticalScrollIndicator={false}>
        <>
          {
            _profile && user &&
            <>
              <ProfileDetails profile={_profile} user={user} />
              <View style={profile.navigationView}>
                <TouchableOpacity onPress={() => setView('reels')} style={profile.navigationViewButtons}>
                  <OymoFont message='Reels' fontStyle={{ color: view == 'reels' ? color.red : (theme ? color.white : color.lightText) }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setView('events')} style={profile.navigationViewButtons}>
                  <OymoFont message='Events' fontStyle={{ color: view == 'events' ? color.red : (theme ? color.white : color.lightText) }} />
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