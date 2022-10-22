import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { login } from '../style/auth'
import OymoFont from '../components/OymoFont'
import color from '../style/color'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'

const Login = () => {
  const focused = useIsFocused()
  const navigation = useNavigation()

  if (focused) {
    NavigationBar.setBackgroundColorAsync(color.white)
    NavigationBar.setButtonStyleAsync('dark')
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [securePasswordEntry, setSecurePasswordEntry] = useState(true)

  return (
    <View style={login.container}>
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
        <TouchableOpacity style={login.signInButton}>
          <OymoFont message='Sign In' />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Login