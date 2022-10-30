import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Keyboard } from 'react-native'
import React, { useEffect } from 'react'
import { su } from '../style/auth'
import OymoFont from '../components/OymoFont'
import { useState } from 'react'
import { AntDesign, Entypo, Foundation } from '@expo/vector-icons'
import color from '../style/color'
import * as Location from 'expo-location'
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'
import { useSelector } from 'react-redux'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'
import Bar from '../components/Bar'

const Step1 = () => {
  const navigation = useNavigation()
  const focused = useIsFocused()
  const { user } = useSelector(state => state.user)
  const [gender, setGender] = useState('')
  const [username, setUsername] = useState('')
  const [location, setLocation] = useState(null)
  const [coords, setCoords] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.dismiss()
    })
  }, [Keyboard])

  if (focused) {
    NavigationBar.setBackgroundColorAsync(color.white)
    NavigationBar.setButtonStyleAsync('dark')
  }

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  const setMyLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()


    let { coords } = await Location.getCurrentPositionAsync({})
    const address = await Location.reverseGeocodeAsync(coords)

    setCoords(coords)
    setLocation(address[0])
  }

  const updateProfile = async () => {
    setLoading(true)
    await updateDoc(doc(db, 'users', id), {
      gender,
      username,
      address: location,
      coords
    })
    setLoading(false)
    navigation.navigate('Step2')
  }

  return (
    <View style={su.container}>
      <Bar style='light' />
      <OymoFont message='Update profile' fontFamily='montserrat_bold' fontStyle={{ ...su.headText, textAlign: 'center' }} />

      <View style={su.stepperView}>
        <Entypo name='dot-single' size={30} color={color.faintBlack} />
        <Entypo name='dot-single' size={30} color={color.red} />
        <Entypo name='dot-single' size={30} color={color.faintBlack} />
      </View>

      <ScrollView style={su.scrollViewContainer}>
        <OymoFont message="I'm a" fontFamily='montserrat_bold' fontStyle={{ ...su.headText, textAlign: 'center' }} />
        <View style={su.genderView}>
          <TouchableOpacity style={su.genderCol} onPress={() => setGender('male')}>
            <View style={[su.male, { backgroundColor: gender == 'male' ? color.blue : color.lightText }]}>
              <Foundation name="male-symbol" size={45} color={color.white} />
            </View>
            <OymoFont message='Male' fontStyle={{ color: gender == 'male' ? color.blue : color.lightText }} />
          </TouchableOpacity>

          <TouchableOpacity style={su.genderCol} onPress={() => setGender('female')}>
            <View style={[su.female, { backgroundColor: gender == 'female' ? color.pink : color.lightText }]}>
              <Foundation name="male-symbol" size={45} color={color.white} />
            </View>
            <OymoFont message='Female' fontStyle={{ color: gender == 'female' ? color.pink : color.lightText }} />
          </TouchableOpacity>
        </View>

        <View style={su.inputView}>
          <TextInput
            value={username}
            style={su.input}
            placeholder='Username'
            onChangeText={setUsername}
            placeholderTextColor={color.lightText}
          />

          <TouchableOpacity style={su.locationButton} onPress={setMyLocation}>
            <OymoFont message={location == null ? 'Location' : `${location?.city}, ${location?.country}`} fontStyle={{ color: color.lightText }} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={updateProfile}
          disabled={username == '' && location == null && gender == ''}
          style={[su.nextButton, { backgroundColor: (username != '' && location != null && gender != '') ? color.red : color.lightText }]}
        >
          {
            loading ?
              <ActivityIndicator color={color.white} size='small' /> :
              <Entypo name='chevron-right' size={24} color={color.white} />
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default Step1