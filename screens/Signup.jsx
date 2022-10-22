import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { su } from '../style/auth'
import OymoFont from '../components/OymoFont'
import color from '../style/color'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'

const Signup = () => {
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
    <View style={su.container}>
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={su.goBack}>
          <AntDesign name="back" size={24} color={color.black} />
        </TouchableOpacity>

        <OymoFont message="Welcome to Oymo" fontFamily='montserrat_bold' fontStyle={su.headText} />
        <OymoFont message='Find friends, and dates around you' fontStyle={su.mainText} />

        <View style={su.inputView}>
          <MaterialIcons name='alternate-email' size={24} color={color.dark} style={{ marginHorizontal: 10 }} />
          <TextInput
            autoCapitalize='none'
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={color.dark}
            style={su.input}
          />
        </View>

        <View style={su.passwordView}>
          <Ionicons name='lock-open-outline' size={24} color={color.dark} style={{ marginHorizontal: 10 }} />
          <TextInput
            autoCapitalize='none'
            placeholder='Password'
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={color.dark}
            secureTextEntry={securePasswordEntry}
            style={su.input}
          />
          <TouchableOpacity onPress={() => setSecurePasswordEntry(!securePasswordEntry)} style={su.peekButton}>
            <Ionicons name={!securePasswordEntry ? 'ios-eye-off-outline' : 'ios-eye-outline'} size={24} color={color.dark} style={{ marginHorizontal: 10 }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={su.navigationView}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={su.bottomText}>Already have an account? <OymoFont message='Sign In' fontFamily='montserrat_bold' fontStyle={{ color: color.black }} /></Text>
        </TouchableOpacity>
        <TouchableOpacity style={su.signInButton}>
          <OymoFont message='Register' />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Signup