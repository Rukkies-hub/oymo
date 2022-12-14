import { View, Text, Switch, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { settings } from '../../style/settings'

import Header from '../../components/Header'
import OymoFont from '../../components/OymoFont'
import color from '../../style/color'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch, useSelector } from 'react-redux'
import { setTheme } from '../../features/userSlice'
import Bar from '../../components/Bar'
import * as NavigationBar from 'expo-navigation-bar'
import { useIsFocused } from '@react-navigation/native'
import Slider from '@react-native-community/slider'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

const { width } = Dimensions.get('window')

const Settings = () => {
  const dispatch = useDispatch()
  const { theme, user, profile } = useSelector(state => state.user)
  const focus = useIsFocused()

  const [distance, setDistance] = useState(profile?.radius != undefined ? profile?.radius : 1)

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  if (focus) {
    NavigationBar.setBackgroundColorAsync(theme ? color.dark : color.white)
    NavigationBar.setButtonStyleAsync(theme ? 'light' : 'dark')
  }

  const toggleTheme = async () => {
    try {
      const value = await AsyncStorage.getItem('@oymo_theme')
      if (value !== null) {
        let _val = JSON.parse(value)
        if (_val == true) {
          dispatch(setTheme(false))
          await AsyncStorage.setItem('@oymo_theme', JSON.stringify(false))
        } else {
          dispatch(setTheme(true))
          await AsyncStorage.setItem('@oymo_theme', JSON.stringify(true))
        }
      } else {
        dispatch(setTheme(true))
        await AsyncStorage.setItem('@oymo_theme', JSON.stringify(true))
      }
    } catch (e) { }
  }

  useEffect(() => {
    const call = async () => {
      try {
        const value = await AsyncStorage.getItem('@oymo_theme')
        if (value !== null) {
          let _val = JSON.parse(value)
          dispatch(setTheme(_val))
        }
      } catch (e) { }
    }
    call()
  }, [theme])

  useEffect(() => {
    const call = async () => {
      await updateDoc(doc(db, 'users', id), {
        radius: distance
      })
    }
    call()
  }, [distance])

  return (
    <View style={[settings.container, { backgroundColor: theme ? color.dark : color.white }]}>
      <Header
        showBack
        showTitle
        title='Settings'
        showAratar
      />
      <Bar color={theme ? 'light' : 'dark'} />

      <View style={settings.settingView}>
        <OymoFont message={`App theme (${theme == true ? 'dark' : 'light'})`} fontFamily='montserrat_bold' fontStyle={settings.settingViewHead} />
        <View style={[settings.settingViewContent, { marginTop: 10 }]}>
          <View>
            <Text style={[settings.title, { color: theme ? color.white : color.dark }]}>Theme</Text>
            <Text style={[settings.text, { color: theme ? color.white : color.dark }]}>
              Select a preferd theme for your account
            </Text>
          </View>
          <Switch
            trackColor={{ false: color.lightText, true: color.offWhite }}
            thumbColor={theme ? color.red : color.offWhite}
            ios_backgroundColor={color.lightText}
            onValueChange={toggleTheme}
            value={theme}
          />
        </View>
      </View>

      {
        (profile?.photoURL != undefined && profile?.username != undefined) &&
        <View style={settings.settingView}>
          <OymoFont message='Match settings' fontFamily='montserrat_bold' fontStyle={settings.settingViewHead} />
          <View style={[settings.settingViewContent, { marginTop: 10 }]}>
            <View>
              <Text style={[settings.title, { color: theme ? color.white : color.dark }]}>Match radius ({profile?.radius != undefined ? profile?.radius : 1})</Text>
              <Text style={[settings.text, { color: theme ? color.white : color.dark }]}>
                Set your search radius to find people around you
              </Text>
              <Text style={[settings.text, { color: theme ? color.white : color.dark }]}>
                You can see users {profile?.radius != undefined ? profile?.radius : 1}kilometer around you
              </Text>
              <Slider
                style={{ width, height: 40, marginLeft: -10 }}
                step={1}
                value={distance}
                minimumValue={0}
                maximumValue={10}
                thumbTintColor={color.red}
                minimumTrackTintColor={color.lightBorderColor}
                maximumTrackTintColor={theme ? color.white : color.dark}
                onSlidingComplete={(low, high, fromUser) => {
                  setDistance(low)
                }}
              />
            </View>
          </View>
        </View>
      }
    </View>
  )
}

export default Settings