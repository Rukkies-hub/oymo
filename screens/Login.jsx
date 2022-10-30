import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
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
import { auth } from '../hooks/firebase'
import { useDispatch } from 'react-redux'
import { setUser } from '../features/userSlice'
import { updateDoc } from 'firebase/firestore'
import Bar from '../components/Bar'

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
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
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