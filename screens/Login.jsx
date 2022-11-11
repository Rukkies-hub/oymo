import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React from 'react'
import { login } from '../style/auth'
import OymoFont from '../components/OymoFont'
import color from '../style/color'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'
import * as Location from 'expo-location'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../hooks/firebase'
import { useDispatch } from 'react-redux'
import { setSetup, setUser } from '../features/userSlice'
import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import Bar from '../components/Bar'
import { setProfiles } from '../features/matchSlice'

const Login = () => {
  const focused = useIsFocused()
  const navigation = useNavigation()
  const dispatch = useDispatch()

  if (focused) {
    NavigationBar.setBackgroundColorAsync(color.white)
    NavigationBar.setButtonStyleAsync('dark')
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [securePasswordEntry, setSecurePasswordEntry] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  const distance = (lat1, lon1, lat2, lon2, unit) => {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
  }

  const getAllProfiles = async id => {
    const profile = await (await getDoc(doc(db, 'users', id))).data()
    if (!profile) return

    const passes = await getDocs(collection(db, 'users', id, 'passes'))
      .then(snapshot => snapshot?.docs?.map(doc => doc?.id))

    const passeedUserIds = (await passes).length > 0 ? passes : ['test']

    const swipes = await getDocs(collection(db, 'users', id, 'swipes'))
      .then(snapshot => snapshot?.docs?.map(doc => doc?.id))

    const swipededUserIds = (await swipes).length > 0 ? swipes : ['test']

    onSnapshot(query(collection(db, 'users'), where('id', 'not-in', [...passeedUserIds, ...swipededUserIds])),
      snapshot => {
        const array = snapshot?.docs?.filter(doc => doc?.data()?.photoURL != null)
          .filter(doc => doc?.data()?.username != null || doc?.data()?.username != '')
          .filter(doc => doc?.id !== id)
          .filter(doc => distance(doc?.data()?.coords?.latitude, doc?.data()?.coords?.longitude, profile?.coords?.latitude, profile?.coords?.longitude).toFixed(2) <= profile?.radius != undefined ? profile?.radius : 1)
          .map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))

        if (array.length >= 1) dispatch(setProfiles(array))
        else dispatch(setProfiles([]))
      })
  }

  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  const signin = async () => {
    if (!email.match(regexEmail) && password == '') {
      navigation.navigate('Alert', {
        theme: false,
        showBody: true,
        body: 'Please complete the form and try again 🙂',
        showOk: true
      })
    } else {
      setAuthLoading(true)
      let { coords } = await Location.getCurrentPositionAsync({})
      const address = await Location.reverseGeocodeAsync(coords)

      signInWithEmailAndPassword(auth, email, password)
        .then(async userCredential => {
          let id = userCredential?.uid != undefined ? userCredential?.uid : userCredential?.user?.uid
          dispatch(setUser(userCredential))
          setAuthLoading(false)
          await updateDoc(doc(db, 'users', id), {
            coords,
            address: address[0],
          })
          getAllProfiles(id)
        }).catch(error => {
          if (error.message.includes('wrong-password'))
            navigation.navigate('Alert', {
              theme: false,
              showTitle: true,
              title: 'Oops!!!',
              showBody: true,
              body: 'Wrong password. Check your passwod then try again. 🙂',
              showOk: true
            })
          else if (error.message.includes('user-not-found'))
            navigation.navigate('Alert', {
              theme: false,
              showTitle: true,
              title: 'Oops!!!',
              showBody: true,
              body: 'Seems like tou do not have an account with us \n Please create an account 🙂',
              showOk: true
            })
        }).finally(() => setAuthLoading(false))
    }
  }

  return (
    <View style={login.container}>
      <Bar color='dark' />
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={login.goBack}>
          <AntDesign name="back" size={24} color={color.black} />
        </TouchableOpacity>

        <OymoFont message="Let's sign you in." fontFamily='montserrat_bold' fontStyle={login.headText} />
        <OymoFont message='Welcome back. You have been missed!' fontStyle={login.mainText} />
        <View style={login.inputView}>
          <MaterialIcons name='alternate-email' size={24} color={color.dark} style={{ marginHorizontal: 10 }} />
          <TextInput
            autoCapitalize='none'
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={color.dark}
            style={login.input}
          />
        </View>

        <View style={login.passwordView}>
          <Ionicons name='lock-open-outline' size={24} color={color.dark} style={{ marginHorizontal: 10 }} />
          <TextInput
            autoCapitalize='none'
            placeholder='Password'
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={color.dark}
            secureTextEntry={securePasswordEntry}
            style={login.input}
          />
          <TouchableOpacity onPress={() => setSecurePasswordEntry(!securePasswordEntry)} style={login.peekButton}>
            <Ionicons name={!securePasswordEntry ? 'ios-eye-off-outline' : 'ios-eye-outline'} size={24} color={color.dark} style={{ marginHorizontal: 10 }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={login.navigationView}>
        <TouchableOpacity
          onPress={() => {
            dispatch(setSetup(true))
            navigation.navigate('Signup')
          }}
        >
          <Text style={login.bottomText}>Don't have an account? <OymoFont message='Register' fontFamily='montserrat_bold' fontStyle={{ color: color.black }} /></Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={signin} style={login.signInButton}>
          {
            authLoading ? <ActivityIndicator size='small' color={color.white} /> :
              <OymoFont message='Sign In' fontStyle={login.signInButtonText} />
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Login