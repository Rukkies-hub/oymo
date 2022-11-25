import React, { useLayoutEffect, useState } from 'react'
import color from '../../style/color'

import { useRoute } from '@react-navigation/native'

import { useSelector } from 'react-redux'
import { useFonts } from 'expo-font'

import ProfileDetails from './ProfileDetails'
import Reels from './Reels'
import { query, collection, where, getDocs } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
const { Navigator, Screen } = createMaterialTopTabNavigator()

const UserProfile = () => {
  const { user } = useRoute().params
  const { theme } = useSelector(state => state.user)

  const [reels, setReels] = useState([])

  useLayoutEffect(() => {
    (async () => {
      await getDocs(query(collection(db, 'reels'), where('user.id', '==', user?.id)),
        snapshot => setReels(
          snapshot?.docs?.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))
        )
      )
    })()
  }, [db])

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

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
      <Screen name="ProfileDetails" component={ProfileDetails} initialParams={{ user, reels }} options={{ tabBarLabel: 'Profile' }} />
      <Screen name="ProfileReels" component={Reels} initialParams={{ user, reels }} options={{ tabBarLabel: 'Reels' }} />
    </Navigator>
  )
}

export default UserProfile