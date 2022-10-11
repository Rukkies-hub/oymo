import { View, Text, Switch } from 'react-native'
import React, { useEffect, useLayoutEffect } from 'react'
import { settings } from '../../style/settings'

import Header from '../../components/Header'
import OymoFont from '../../components/OymoFont'
import { useState } from 'react'
import color from '../../style/color'

import * as Location from 'expo-location'
import { Camera } from 'expo-camera'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch, useSelector } from 'react-redux'
import { setTheme } from '../../features/userSlice'
import Bar from '../../components/Bar'
import * as NavigationBar from 'expo-navigation-bar'
import { useIsFocused } from '@react-navigation/native'

const Settings = () => {
  const dispatch = useDispatch()
  const { theme } = useSelector(state => state.user)
  const focus = useIsFocused()

  if (focus) {
    NavigationBar.setBackgroundColorAsync(theme ? color.dark : color.white)
    NavigationBar.setButtonStyleAsync(theme ? 'light' : 'dark')
  }

  const [locationPermision, setLocationPermision] = useState(false)
  const [cameraPermision, setCameraPermision] = useState(false)

  const toggleLocationPermision = () => setLocationPermision(previousState => !previousState)
  const toggleCameraPermision = () => setCameraPermision(previousState => !previousState)

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
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status == 'granted') setLocationPermision(true)
      else setLocationPermision(false)
    }
    call()
  }, [])

  useEffect(() => {
    const call = async () => {
      const { status } = await Camera?.requestCameraPermissionsAsync()
      if (status == 'granted') setCameraPermision(true)
      else setCameraPermision(false)
    }
    call()
  }, [])

  useEffect(() => {
    const call = async () => {
      try {
        const value = await AsyncStorage.getItem('@oymo_theme')
        if (value !== null) {
          let _val = JSON.parse(value)
          dispatch(setTheme(_val))
        }
      } catch (e) {}
    }
    call()
  }, [theme])

  return (
    <View style={[settings.container, {backgroundColor: theme ? color.dark : color.white}]}>
      <Header
        showBack
        showTitle
        title='Settings'
        showAratar
      />
      <Bar color={theme ? 'light' : 'dark'} />

      <View style={settings.settingView}>
        <OymoFont message='Permissions' fontFamily='montserrat_bold' fontStyle={settings.settingViewHead} />
        <View style={[settings.settingViewContent, { marginTop: 10 }]}>
          <View>
            <Text style={[settings.title, {color: theme ? color.white : color.dark}]}>Location</Text>
            <Text style={[settings.text, { color: theme ? color.white : color.dark }]}>
              Allow Oymo match access your location
            </Text>
          </View>
          <Switch
            trackColor={{ false: color.lightText, true: color.offWhite }}
            thumbColor={locationPermision ? color.red : color.offWhite}
            ios_backgroundColor={color.lightText}
            onValueChange={toggleLocationPermision}
            value={locationPermision}
          />
        </View>

        <View style={settings.settingViewContent}>
          <View>
            <Text style={[settings.title, { color: theme ? color.white : color.dark }]}>Camera</Text>
            <Text style={[settings.text, { color: theme ? color.white : color.dark }]}>
              Allow Oymo match access your camera
            </Text>
          </View>
          <Switch
            trackColor={{ false: color.lightText, true: color.offWhite }}
            thumbColor={cameraPermision ? color.red : color.offWhite}
            ios_backgroundColor={color.lightText}
            onValueChange={toggleCameraPermision}
            value={cameraPermision}
          />
        </View>
      </View>

      <View style={settings.settingView}>
        <OymoFont message={`App theme (${theme == true ? 'dark' : 'light'})`} fontFamily='montserrat_bold' fontStyle={settings.settingViewHead} />
        <View style={[settings.settingViewContent, { marginTop: 10 }]}>
          <View>
            {/* <OymoFont message='Theme' fontFamily='montserrat_bold' />
            <OymoFont message='Select a preferd theme for your account' fontFamily='montserrat_light' /> */}
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
    </View>
  )
}

export default Settings