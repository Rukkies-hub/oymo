import React, { useEffect } from 'react'
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
import color from '../style/color'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { setUser } from '../features/userSlice'
import { useState } from 'react'
import { useFonts } from 'expo-font'
import OymoFont from '../components/OymoFont'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../hooks/firebase'

const Login = ({ navigation }) => {
  const dispatch = useDispatch()

  const [securePasswordEntry, setSecurePasswordEntry] = useState(true)
  const [loading, setLoading] = useState(false)
  const [googleLoadng, setGoogleLoadng] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  const signinUser = () => {
    if (email.match(regexEmail) && password != '') {
      setLoading(true)
      signInWithEmailAndPassword(auth, email, password)
        .then(user => {
          setLoading(false)
          return dispatch(setUser(user))
        })
        .catch(error => {
          Alert.alert('Signin error. Check your details and try again.')
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
              <OymoFont message='Welcome back' fontStyle={login.headingText} fontFamily='montserrat_medium' />
              <OymoFont message='Log into your account' fontStyle={login.headingSubText} fontFamily='montserrat_medium' />
            </View>

            <View style={{ marginTop: 40, width: '100%' }}>
              <View style={login.textInputContainer}>
                <MaterialIcons name='alternate-email' size={24} color={color.white} style={{ marginHorizontal: 10 }} />
                <TextInput
                  autoCapitalize='none'
                  placeholder='Email'
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor={color.white}
                  style={login.textInput}
                />
              </View>

              <View style={[login.textInputContainer, { marginTop: 20 }]}>
                <MaterialIcons name='alternate-email' size={24} color={color.white} style={{ marginHorizontal: 10 }} />
                <TextInput
                  autoCapitalize='none'
                  placeholder='Password'
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor={color.white}
                  secureTextEntry={securePasswordEntry}
                  style={login.textInput}
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
                  onPress={signinUser}
                  style={login.signupButton}
                >
                  {
                    loading ?
                      <ActivityIndicator color={color.white} size='small' /> :
                      <OymoFont
                        message='Sign In'
                        fontStyle={{
                          fontSize: 16,
                          color: color.white,
                        }}
                        fontFamily='montserrat_medium'
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
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <OymoFont
                    message="Don't have an account?"
                    fontStyle={{
                      fontSize: 12,
                      color: color.white,
                    }}
                    fontFamily='montserrat_medium'
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

export default Login