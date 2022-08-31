import React, { useEffect } from 'react'
import {
  View,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native'
import { login } from '../style/login'
import Bar from '../components/Bar'
import color from '../style/color'
import { useState } from 'react'
import { useFonts } from 'expo-font'
import OymoFont from '../components/OymoFont'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { auth } from '../hooks/firebase'

import { webClientId, iosClientId, androidClientId } from '@env'

import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'

WebBrowser.maybeCompleteAuthSession()

const Login = () => {
  const [googleLoadng, setGoogleLoadng] = useState(false)

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
              <OymoFont message='Login to your account' fontStyle={login.headingSubText} fontFamily='montserrat_medium' />
            </View>

            <View style={{ marginTop: 40, width: '100%' }}>
              <View style={login.signupButtonContainer}>
                <TouchableOpacity onPress={() => promptAsync()} style={login.googleLoginButton}>
                  {
                    googleLoadng ?
                      <ActivityIndicator size='small' color={color.red} /> :
                      <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../assets/google.png')} style={login.googleImage} />
                        <OymoFont message='Continue with Google' fontStyle={{ fontSize: 16, marginLeft: 10 }} />
                      </View>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

export default Login