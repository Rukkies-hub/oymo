import React, { useEffect, useState } from 'react'
import {
  View,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native'
import { login } from '../style/login'
import Bar from '../components/Bar'
import OymoFont from '../components/OymoFont'
import color from '../style/color'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { setUser } from '../features/userSlice'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../hooks/firebase'

const Signup = ({ navigation }) => {
  const [securePasswordEntry, setSecurePasswordEntry] = useState(true)
  const [loading, setLoading] = useState(false)
  const [googleLoadng, setGoogleLoadng] = useState(false)
  const [email, setEmail] = useState('rukkiecodes4@gmail.com')
  const [password, setPassword] = useState('amagboro')

  const dispatch = useDispatch()

  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  const signupUser = () => {
    if (email.match(regexEmail) && password != '') {
      setLoading(true)
      createUserWithEmailAndPassword(auth, email, password)
        .then(user => {
          setLoading(false)
          return dispatch(setUser(user))
        })
        .catch(error => {
          Alert.alert('Signup error. Seems you already have an account.')
          setLoading(false)
        })
    } else {
      Alert.alert('please complete the form to signin')
    }
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.dismiss()
    })
  }, [Keyboard])

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
              <OymoFont fontStyle={login.headingText} fontFamily='montserrat_medium' message='Hello there' />
              <OymoFont fontStyle={login.headingSubText} fontFamily='montserrat_medium' message='create an account😊' />
            </View>

            <View style={{ marginTop: 40, width: '100%' }}>
              <View style={login.textInputContainer}>
                <MaterialIcons name='alternate-email' size={24} color={color.white} style={{ marginHorizontal: 10 }} />
                <TextInput
                  autoCapitalize='none'
                  placeholder='Email'
                  value={email}
                  onChangeText={setEmail}
                  style={login.textInput}
                  placeholderTextColor={color.white}
                />
              </View>

              <View style={[login.textInputContainer, { marginTop: 20 }]}>
                <MaterialIcons name='alternate-email' size={24} color={color.white} style={{ marginHorizontal: 10 }} />
                <TextInput
                  autoCapitalize='none'
                  placeholder='Email'
                  value={password}
                  onChangeText={setPassword}
                  style={login.textInput}
                  placeholderTextColor={color.white}
                  secureTextEntry={securePasswordEntry}
                />
                <TouchableOpacity
                  onPress={() => setSecurePasswordEntry(!securePasswordEntry)}
                  style={{
                    width: 45,
                    height: 45,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Ionicons name={securePasswordEntry ? 'ios-eye-off-outline' : 'ios-eye-outline'} size={24} color={color.white} style={{ marginHorizontal: 10 }} />
                </TouchableOpacity>
              </View>

              <View style={login.signupButtonContainer}>
                <TouchableOpacity
                  onPress={signupUser}
                  style={login.signupButton}
                >
                  {
                    loading ?
                      <ActivityIndicator color={color.white} size='small' /> :
                      <OymoFont
                        fontStyle={{
                          fontSize: 16,
                          color: color.white
                        }}
                        fontFamily='montserrat_medium'
                        message='Sign Up'
                      />
                  }
                </TouchableOpacity>

                <TouchableOpacity
                  style={login.googleLoginButton}
                >
                  {
                    googleLoadng ?
                      <ActivityIndicator size='small' color={color.red} /> :
                      <Image
                        source={require('../assets/google.png')}
                        style={login.googleImage}
                      />
                  }
                </TouchableOpacity>
              </View>

              <View style={login.bottomContainer}>
                <View />
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <OymoFont
                    fontStyle={{
                      color: color.white,
                      fontSize: 12
                    }}
                    fontFamily='montserrat_medium'
                    message="Already have an account?"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

export default Signup