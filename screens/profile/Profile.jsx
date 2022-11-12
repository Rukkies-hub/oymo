import React, { useEffect, useState } from 'react'
import color from '../../style/color'

import { useSelector } from 'react-redux'
import ProfileDetails from './ProfileDetailes'
import Reels from './Reels'
import Events from './Events'
import { collection, limit, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
const { Navigator, Screen } = createMaterialTopTabNavigator()

const Profile = () => {
  const { user, profile: _profile, theme } = useSelector(state => state.user)

  const [reels, setReels] = useState([])

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  useEffect(() => {
    return onSnapshot(query(collection(db, 'reels'), where('user.id', '==', id)),
      snapshot => setReels(
        snapshot?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        }))
      )
    )
  }, [db])

  return (
    <Navigator
      tabBarPosition='bottom'
      screenOptions={{
        tabBarStyle: {
          height: 45,
          elevation: 0,
          backgroundColor: theme ? color.dark : color.white
        },

        tabBarIndicatorStyle: {
          backgroundColor: color.red
        },

        tabBarLabelStyle: {
          color: theme ? color.white : color.dark,
          textTransform: 'capitalize',
          fontWeight: 'bold'
        }
      }}
    >
      <Screen name="ProfileDetails" component={ProfileDetails} initialParams={{ profile: _profile, user: user, reels }} options={{ tabBarLabel: 'Profile' }} />
      <Screen name="Reels" component={Reels} initialParams={{ profile: _profile, user: user, reels }} />
      <Screen name="Events" component={Events} initialParams={{ profile: _profile, user: user }} />
    </Navigator>
  )
}

export default Profile