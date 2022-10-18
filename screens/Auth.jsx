import React, { useEffect } from 'react'
import {
  View,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Text
} from 'react-native'
import { login } from '../style/login'
import Bar from '../components/Bar'
import color from '../style/color'
import { useState } from 'react'
import { useFonts } from 'expo-font'
import OymoFont from '../components/OymoFont'
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendPasswordResetEmail, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../hooks/firebase'

import { webClientId, iosClientId, androidClientId } from '@env'

import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { setProfile, setUser } from '../features/userSlice'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import * as Location from 'expo-location'
WebBrowser.maybeCompleteAuthSession()

const Auth = () => {
  const dispatch = useDispatch()
  const [googleLoadng, setGoogleLoadng] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [securePasswordEntry, setSecurePasswordEntry] = useState(true)
  const [authType, setAuthType] = useState('login')
  const [authLoading, setAuthLoading] = useState(false)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.dismiss()
    })
  }, [Keyboard])

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: webClientId,
    iosClientId: iosClientId,
    androidClientId: androidClientId
  })

  useEffect(() => {
    if (response?.type === 'success') {
      setGoogleLoadng(true)
      const { id_token } = response?.params
      const credential = GoogleAuthProvider.credential(id_token)
      signInWithCredential(auth, credential)
    } else {
      setGoogleLoadng(false)
    }
  }, [response])

  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  const signin = async () => {
    if (email.match(regexEmail) && password != '') {
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
        }).catch(error => {
          if (error.message.includes('wrong-password'))
            alert('Wrong password. Check your passwod then try again.')
          else if (error.message.includes('user-not-found'))
            alert('Oops. Seems like tou do not have an account with Oymo')
        }).finally(() => setAuthLoading(false))
    }
  }

  const signup = async () => {
    if (email.match(regexEmail) && password != '') {
      setAuthLoading(true)
      let { coords } = await Location.getCurrentPositionAsync({})
      const address = await Location.reverseGeocodeAsync(coords)

      createUserWithEmailAndPassword(auth, email, password)
        .then(async userCredential => {
          dispatch(setUser(userCredential))
          setAuthLoading(false)
          let id = userCredential?.uid != undefined ? userCredential?.uid : userCredential?.user?.uid
          await setDoc(doc(db, 'users', id), {
            email,
            coords,
            address: address[0],
            coins: 5000,
            timestamp: serverTimestamp(),
            id
          })

          const profile = await (await getDoc(doc(db, 'users', id))).data()
          dispatch(setProfile(profile))
        }).catch(error => {
          if (error.message.includes('email-already-in-use'))
            alert('Ooops. Seems this email is already in use. Try another')
          else if (error.message.includes('weak-password'))
            alert('weak-password\nPassword should be at least 6 characters')
        }).finally(() => setAuthLoading(false))
    }
  }

  const recoverPassword = () => {
    if (email == '') return
    sendPasswordResetEmail(auth, email)
    alert("Email sent.\n\nCheck ur inbox, reset ur password then try logging in again.\n\nIf you do not wish to change your password. Please Ignore Email.\n\n PS. check your spam")
  }


  const [loaded] = useFonts({
    pacifico: require('../assets/fonts/Pacifico/Pacifico-Regular.ttf'),
    montserrat_medium: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={login.container}
      resizeMode='cover'
      blurRadius={10}
    >
      <Bar color='light' />
      <KeyboardAvoidingView style={login.KeyboardView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <View style={login.heading}>
              <OymoFont message='Welcome to Oymo' fontStyle={login.headingText} fontFamily='montserrat_medium' />
              <OymoFont message={authType == 'login' ? 'Login to your account' : authType == 'signup' ? 'Create an account' : 'Login to your account'} fontStyle={login.headingSubText} fontFamily='montserrat_medium' />
            </View>

            <View style={{ marginTop: 40, width: '100%' }}>
              <View style={login.inputView}>
                <MaterialIcons name='alternate-email' size={24} color={color.white} style={{ marginHorizontal: 10 }} />
                <TextInput
                  autoCapitalize='none'
                  placeholder='Email'
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor={color.white}
                  style={login.input}
                />
              </View>

              {
                email.length >= 2 &&
                <Text style={[login.errorText, { display: !showError ? 'none' : 'flex' }]}>
                  Please, enter a valid email
                </Text>
              }

              {
                authType != 'forgotPassword' &&
                <View style={login.passwordView}>
                  <Ionicons name='lock-open-outline' size={24} color={color.white} style={{ marginHorizontal: 10 }} />
                  <TextInput
                    autoCapitalize='none'
                    placeholder='Password'
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor={color.white}
                    secureTextEntry={securePasswordEntry}
                    style={login.input}
                  />
                  <TouchableOpacity onPress={() => setSecurePasswordEntry(!securePasswordEntry)} style={login.peekButton}>
                    <Ionicons name={!securePasswordEntry ? 'ios-eye-off-outline' : 'ios-eye-outline'} size={24} color={color.white} style={{ marginHorizontal: 10 }} />
                  </TouchableOpacity>
                </View>
              }

              <View style={login.authButtonView}>
                <TouchableOpacity
                  onPress={() => authType == 'login' ? signin() : authType == 'signup' ? signup() : recoverPassword()}
                  style={[login.authButton, { backgroundColor: authType == 'login' ? color.red : color.white }]}
                >
                  {
                    authLoading ? <ActivityIndicator size='small' color={authType == 'login' ? color.white : color.red} /> :
                      <Text
                        style={{
                          fontFamily: 'text',
                          fontSize: 16,
                          color: authType == 'login' ? color.white : color.red
                        }}
                      >
                        {authType == 'login' ? 'Login' : authType == 'signup' ? 'Sign Up' : 'Recover Password'}
                      </Text>
                  }
                </TouchableOpacity>

                {/* <TouchableOpacity onPress={() => promptAsync()} style={login.googleLoginButton}>
                  {
                    googleLoadng ?
                      <ActivityIndicator size='small' color={color.red} /> :
                      <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../assets/google.png')} style={login.googleImage} />
                      </View>
                  }
                </TouchableOpacity> */}
              </View>

              <View style={login.buttomView}>
                <TouchableOpacity onPress={() => setAuthType(authType == 'login' ? 'signup' : 'login')}>
                  <Text style={{ color: color.white, fontSize: 12, fontFamily: 'text' }}>{authType == 'login' ? "Don't have an account?" : "Already have an account?"}</Text>
                </TouchableOpacity>

                {
                  authType == 'login' &&
                  <TouchableOpacity onPress={() => setAuthType(authType == 'forgotPassword' ? 'signin' : 'forgotPassword')}>
                    <Text style={{ color: color.white, fontSize: 12, fontFamily: 'text' }}>Forgot your password?</Text>
                  </TouchableOpacity>
                }
              </View>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

export default Auth