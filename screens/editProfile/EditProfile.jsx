import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import color from '../../style/color'
import Header from '../../components/Header'
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { useNavigation } from '@react-navigation/native'
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { getStorage } from 'firebase/storage'
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { useSelector } from 'react-redux'
import { editProfile } from '../../style/editProfile'
import OymoFont from '../../components/OymoFont'
import { logout } from '../../features/userSlice'
import AppTheme from './components/AppTheme'
import LookingFor from './components/LookingFor'
import Payment from './components/Payment'

const EditProfile = () => {
  const { user, profile } = useSelector(state => state.user)
  const storage = getStorage()
  const navigation = useNavigation()

  const responseListener = useRef()
  const notificationListener = useRef()

  const [height, setHeight] = useState(50)
  const [disabled, setDisabled] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)

  // INPUTS
  const [displayName, setDisplayName] = useState(user?.displayName || profile?.displayName)
  const [username, setUsername] = useState(profile?.username)
  const [phone, setPhone] = useState(profile?.phone)
  const [job, setJob] = useState(profile?.job)
  const [company, setCompany] = useState(profile?.company)
  const [school, setSchool] = useState(profile?.school)
  const [about, setAbout] = useState(profile?.about)
  const [_passions, setPassions] = useState(profile?.passions)
  const [city, setCity] = useState(profile?.city)

  useEffect(() => {
    const unsub = (() => {
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token))

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification)
      })

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => { })

      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current)
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    })()
    return unsub
  }, [])

  useEffect(() => {
    (() => {
      if (profile) setDisabled(false)
      else
        if (username != undefined && phone != undefined && city != undefined)
          setDisabled(false)
    })()
  }, [username, city, phone])

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.dismiss()
    })
  }, [Keyboard])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [9, 16]
    })

    if (!result?.cancelled && result?.type == 'image')
      navigation.navigate('SaveAvatar', { result })
  }

  const setupUser = async () => {
    setUpdateLoading(true)

    await setDoc(doc(db, 'users', user?.uid), {
      id: user?.uid,
      username,
      city,
      phone,
      theme: 'dark',
      timestamp: serverTimestamp()
    })
    schedulePushNotification('Update successful', 'Your profile has been updated successfully')
    setUpdateLoading(false)
  }

  const updateUserProfile = async () => {
    setUpdateLoading(true)

    await updateDoc(doc(db, 'users', user?.uid), {
      username,
      displayName,
      job,
      company,
      school,
      city,
      about,
      phone
    })
    schedulePushNotification('Update successful', 'Your profile has been updated successfully')
    setUpdateLoading(false)
  }

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <KeyboardAvoidingView style={editProfile.container}>
      <Header showBack showTitle showAratar title='Edit Profile' />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={editProfile.mainView}>
          {
            profile.photoURL ?
              <Image
                source={{ uri: profile?.photoURL }}
                style={editProfile.avatar}
              /> :
              <View style={editProfile.placeholderAvatar}>
                <SimpleLineIcons name='user' size={30} color={color.lightText} />
              </View>
          }

          <View style={editProfile.profileInfoContainer}>
            <View style={editProfile.profileInfo}>
              <OymoFont
                message={profile?.username ? profile?.username : 'username'}
                fontFamily='montserrat_bold'
                fontStyle={[
                  editProfile.username,
                  {
                    color: profile?.username ? color.dark : color.lightText
                  }
                ]}
              />
            </View>
            <OymoFont
              message={profile?.displayName ? profile?.displayName : user?.displayName ? user?.displayName : 'Display name'}
              fontStyle={editProfile.displayName}
            />
          </View>

          {
            profile &&
            <TouchableOpacity onPress={pickImage} style={editProfile.pickImage}>
              <AntDesign name='picture' size={24} color={color.dark} />
            </TouchableOpacity>
          }
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={{ flex: 1 }}>
          <View style={editProfile.inputContainer}>
            <TextInput
              value={username}
              placeholder='Username'
              autoCapitalize='none'
              textContentType='username'
              autoCorrect={false}
              onChangeText={setUsername}
              placeholderTextColor={color.dark}
              style={[editProfile.input, { fontFamily: 'text' }]}
            />

            {
              !user?.displayName && !user?.displayName != '' &&
              <TextInput
                value={displayName}
                placeholder='Display name'
                onChangeText={setDisplayName}
                placeholderTextColor={color.dark}
                style={[editProfile.input, { fontFamily: 'text' }]}
              />
            }

            <TextInput
              value={phone}
              placeholder='(Country code) Phone'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={setPhone}
              placeholderTextColor={color.dark}
              style={[editProfile.input, { fontFamily: 'text' }]}
            />

            {
              profile &&
              <TextInput
                value={job}
                onChangeText={setJob}
                placeholder='Enter your occupation'
                placeholderTextColor={color.dark}
                style={[editProfile.input, { fontFamily: 'text' }]}
              />
            }

            {
              profile &&
              <TextInput
                value={company}
                onChangeText={setCompany}
                placeholder='Where do you work'
                placeholderTextColor={color.dark}
                style={[editProfile.input, { fontFamily: 'text' }]}
              />
            }

            {
              profile &&
              <TextInput
                value={school}
                onChangeText={setSchool}
                placeholder='School'
                placeholderTextColor={color.dark}
                style={[editProfile.input, { fontFamily: 'text' }]}
              />
            }

            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder='I live in (City)'
              placeholderTextColor={color.dark}
              style={[editProfile.input, { fontFamily: 'text' }]}
            />

            {
              profile &&
              <View style={editProfile.aboutContainer}>
                <OymoFont message='About me' fontStyle={editProfile.aboutText} fontFamily='montserrat_bold' />

                <TextInput
                  multiline
                  value={about}
                  onChangeText={setAbout}
                  placeholder='About me'
                  onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
                  placeholderTextColor={color.dark}
                  style={[editProfile.input, { fontFamily: 'text' }]}
                />
              </View>
            }

            {
              profile &&
              <TouchableOpacity onPress={() => navigation.navigate('Passion')}>
                <OymoFont message='Passions' fontStyle={editProfile.passionsText} fontFamily='montserrat_bold' />

                <View
                  style={[
                    editProfile.passionContainer,
                    { backgroundColor: _passions?.length < 1 ? color.offWhite : color.transparent }
                  ]}
                >
                  {
                    _passions?.map((passion, index) => (
                      <View key={index} style={editProfile.passions}>
                        <OymoFont message={passion} fontStyle={editProfile.passion} />
                      </View>
                    ))
                  }
                </View>
              </TouchableOpacity>
            }

            {
              profile &&
              <>
                {
                  !profile.gender &&
                  <View style={editProfile.genderButtonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Gender')} style={editProfile.genderButton}>
                      <OymoFont message='Set your gender' fontStyle={editProfile.genderText} fontFamily='montserrat_bold' />
                    </TouchableOpacity>
                  </View>
                }
              </>
            }

            {profile && <LookingFor />}

            {/* {profile && <AppTheme />} */}

            {/* {profile && <Payment />} */}

            <TouchableOpacity
              onPress={() => profile ? updateUserProfile() : setupUser()}
              disabled={disabled}
              style={[editProfile.updateButton, { backgroundColor: disabled ? color.labelColor : color.red }]}
            >
              {
                updateLoading ?
                  <ActivityIndicator size='small' color={color.white} /> :
                  <OymoFont message='Update Profile' fontStyle={editProfile.updateButtonText} />
              }
            </TouchableOpacity>

            <TouchableOpacity style={editProfile.logoutButton}>
              <OymoFont message='Logout' fontStyle={editProfile.logoutButtonText} />
            </TouchableOpacity>

            <View style={editProfile.bottomContainer}>
              <Image source={require('../../assets/adaptive-icon.png')} style={editProfile.logo} />
              <OymoFont message={`Version ${Constants?.manifest?.version}`} fontStyle={editProfile.version} />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

async function schedulePushNotification (title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: require('../../assets/newMessage.mp3')
    },
    trigger: { seconds: 1 },
  })
}

async function registerForPushNotificationsAsync () {
  let token
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
    // console.log(token)
  } else {
    alert('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: color.red,
    })
  }

  return token
}

export default EditProfile