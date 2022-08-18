import { View, Text, ImageBackground, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import React from 'react'
import { login } from '../style/login'
import Bar from '../components/Bar'
import Font from '../components/Font'
import color from '../style/color'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import { setEmail, setPassword } from '../features/userSlice'
import { useState } from 'react'

const Login = ({ navigation }) => {
  const email = useSelector(state => state.user.email)
  const password = useSelector(state => state.user.password)
  const signInLoading = useSelector(state => state.user.signInLoading)
  const googleLoadng = useSelector(state => state.user.googleLoadng)

  const dispatch = useDispatch()

  const [securePasswordEntry, setSecurePasswordEntry] = useState(false)

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
              <Font style={login.headingText} font='montserrat_medium' text='Welcome back' />
              <Font style={login.headingSubText} font='montserrat_medium' text='Log into your account' />
            </View>

            <View style={{ marginTop: 40, width: '100%' }}>
              <View style={login.textInputContainer}>
                <MaterialIcons name='alternate-email' size={24} color={color.white} style={{ marginHorizontal: 10 }} />
                <TextInput
                  autoCapitalize='none'
                  placeholder='Email'
                  value={email}
                  onChangeText={value => dispatch(setEmail(value))}
                  placeholderTextColor={color.white}
                  style={[login.textInput, { fontFamily: 'text' }]}
                />
              </View>

              <View style={[login.textInputContainer, { marginTop: 20 }]}>
                <MaterialIcons name='alternate-email' size={24} color={color.white} style={{ marginHorizontal: 10 }} />
                <TextInput
                  autoCapitalize='none'
                  placeholder='Email'
                  value={password}
                  placeholderTextColor={color.white}
                  secureTextEntry={securePasswordEntry}
                  style={[login.textInput, { fontFamily: 'text' }]}
                  onChangeText={value => dispatch(setPassword(value))}
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
                <TouchableOpacity style={login.signupButton}>
                  {
                    signInLoading ?
                      <ActivityIndicator color={color.white} size='small' /> :
                      <Font
                        style={{
                          fontSize: 16,
                          color: color.white
                        }}
                        font='montserrat_medium'
                        text='Sign Up'
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
                  <Font
                    style={{
                      color: color.white,
                      fontSize: 12
                    }}
                    font='montserrat_medium' text="Don't have an account?"
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