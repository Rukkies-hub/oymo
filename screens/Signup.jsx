import { View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Keyboard } from 'react-native'
import React, { useEffect } from 'react'
import { su } from '../style/auth'
import OymoFont from '../components/OymoFont'
import color from '../style/color'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../hooks/firebase'
import { useDispatch } from 'react-redux'
import { setProfile, setUser } from '../features/userSlice'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'

const Signup = () => {
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
  const [step, setStep] = useState(1)

  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.dismiss()
    })
  }, [Keyboard])

  const signupUser = async () => {
    setAuthLoading(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then(async user => {
        dispatch(setUser(user))
        setAuthLoading(false)

        let id = user?.uid != undefined ? user?.uid : user?.user?.uid

        await setDoc(doc(db, 'users', id), {
          email,
          coins: 5000,
          timestamp: serverTimestamp(),
          id
        })

        const profile = await (await getDoc(doc(db, 'users', id))).data()
        dispatch(setProfile(profile))
      }).catch(error => {
        if (error.message.includes('email-already-in-use'))
          navigation.navigate('Alert', {
            theme: false,
            showTitle: true,
            title: 'Oops!!!',
            showBody: true,
            body: 'Seems this email is already in use. \nTry another 🙂',
            showOk: true
          })
        else if (error.message.includes('weak-password'))
          navigation.navigate('Alert', {
            theme: false,
            showTitle: true,
            title: 'Oops!!!',
            showBody: true,
            body: 'weak-password\nPassword should be at least 6 characters',
            showOk: true
          })
      }).finally(() => setAuthLoading(false))
  }

  return (
    <View style={su.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={su.goBack}>
        <AntDesign name="back" size={24} color={color.black} />
      </TouchableOpacity>
      <OymoFont message='Register' fontFamily='montserrat_bold' fontStyle={{ ...su.headText, textAlign: 'center' }} />

      <View style={su.stepperView}>
        <Entypo name='dot-single' size={30} color={color.red} />
        <Entypo name='dot-single' size={30} color={color.faintBlack} />
        <Entypo name='dot-single' size={30} color={color.faintBlack} />
      </View>

      <ScrollView style={su.scrollViewContainer}>
        <View style={su.inputView}>
          <TextInput
            value={email}
            style={su.input}
            placeholder='Email'
            onChangeText={setEmail}
            placeholderTextColor={color.lightText}
          />

          <View style={[su.passwordView, { marginTop: 10 }]}>
            <TextInput
              autoCapitalize='none'
              placeholder='Password'
              value={password}
              onChangeText={setPassword}
              placeholderTextColor={color.lightText}
              secureTextEntry={securePasswordEntry}
              style={su.input}
            />
            <TouchableOpacity onPress={() => setSecurePasswordEntry(!securePasswordEntry)} style={su.peekButton}>
              <Ionicons name={!securePasswordEntry ? 'ios-eye-off-outline' : 'ios-eye-outline'} size={24} color={color.dark} style={{ marginHorizontal: 10 }} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) && (password != '' && password.length >= 6))
              signupUser()
            else
              navigation.navigate('Alert', {
                theme: false,
                showTitle: true,
                title: 'Oops!!!',
                showBody: true,
                body: 'weak-password\nPassword should be at least 6 characters',
                showOk: true
              })
          }}
          disabled={email == '' && password == ''}
          style={[su.nextButton, { backgroundColor: (email != '' && password != '') ? color.red : color.lightText }]}
        >
          {
            authLoading ?
              <ActivityIndicator color={color.white} size='small' /> :
              <Entypo name='chevron-right' size={24} color={color.white} />
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default Signup