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
  Keyboard,
  Dimensions
} from 'react-native'
import color from '../../style/color'
import Header from '../../components/Header'
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../../hooks/firebase'
import { getStorage } from 'firebase/storage'
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { useDispatch, useSelector } from 'react-redux'
import { editProfile } from '../../style/editProfile'
import OymoFont from '../../components/OymoFont'
import { logout, setProfile } from '../../features/userSlice'
import LookingFor from './components/LookingFor'
import { signOut } from 'firebase/auth'
import * as Location from 'expo-location'
import SelectDropdown from 'react-native-select-dropdown'
import Slider from '@react-native-community/slider'

const { width } = Dimensions.get('window')

const EditProfile = () => {
  const { user, profile, theme } = useSelector(state => state.user)
  const storage = getStorage()
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const responseListener = useRef()
  const notificationListener = useRef()

  const [height, setHeight] = useState(50)
  const [disabled, setDisabled] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [yourHeight, setYourHeight] = useState(profile?.height != undefined ? profile?.height : 155)
  const [yourWeight, setYourWeight] = useState(profile?.weight != undefined ? profile?.weight : 75)

  // INPUTS
  const [city, setCity] = useState(profile?.address?.city)
  const [username, setUsername] = useState(profile?.username)
  const [about, setAbout] = useState(profile?.about)

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

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
        if (username != undefined)
          setDisabled(false)
    })()
  }, [username])

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

    await setDoc(doc(db, 'users', id), {
      id: id,
      username,
      coins: 5000,
      timestamp: serverTimestamp()
    })
    schedulePushNotification('Update successful', 'Your profile has been updated successfully')
    setUpdateLoading(false)
  }

  const updateUserProfile = async () => {
    setUpdateLoading(true)

    if (username != '' && username != undefined) await updateDoc(doc(db, 'users', id), { username })
    if (about != '' && about != undefined) await updateDoc(doc(db, 'users', id), { about })
    setUpdateLoading(false)
    schedulePushNotification('Update successful', 'Your profile has been updated successfully')

    const profile = await (await getDoc(doc(db, 'users', id))).data()
    dispatch(setProfile(profile))
  }

  const logoutUser = () => {
    signOut(auth)
    dispatch(logout())
    dispatch(setProfile(null))
  }

  const setMyLocation = async user => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied')
      return
    }

    let { coords } = await Location.getCurrentPositionAsync({})
    const address = await Location.reverseGeocodeAsync(coords)

    setCity(address[0].city)

    await updateDoc(doc(db, 'users', id), {
      coords,
      address: address[0]
    })
  }

  useEffect(() => {
    const call = () => {
      updateDoc(doc(db, 'users', id), { height: yourHeight })
    }
    call()
  }, [yourHeight])

  useEffect(() => {
    const call = () => {
      updateDoc(doc(db, 'users', id), { weight: yourWeight })
    }
    call()
  }, [yourWeight])

  return (
    <KeyboardAvoidingView style={[editProfile.container, { backgroundColor: theme ? color.dark : color.white }]}>
      <Header showBack showTitle showAratar title='Edit Profile' />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={editProfile.mainView}>
          {
            profile?.photoURL ?
              <Image source={{ uri: profile?.photoURL }} style={editProfile.avatar} /> :
              <View style={editProfile.placeholderAvatar}>
                <SimpleLineIcons name='user' size={30} color={theme ? color.white : color.lightText} />
              </View>
          }

          <View style={editProfile.profileInfoContainer}>
            <OymoFont
              message={profile?.username ? profile?.username : 'username'}
              fontFamily='montserrat_bold'
              fontStyle={{ ...editProfile.username, color: theme ? color.white : color.dark }}
            />
          </View>

          {
            profile?.username != undefined &&
            <TouchableOpacity onPress={pickImage} style={[editProfile.pickImage, { backgroundColor: theme ? color.lightText : color.offWhite }]}>
              <AntDesign name='picture' size={24} color={theme ? color.white : color.dark} />
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
              placeholderTextColor={theme ? color.white : color.dark}
              style={[
                editProfile.input,
                {
                  fontFamily: 'text',
                  backgroundColor: theme ? color.lightText : color.offWhite,
                  color: theme ? color.white : color.dark
                }
              ]}
            />

            <TouchableOpacity
              onPress={setMyLocation}
              style={[
                editProfile.input,
                {
                  backgroundColor: theme ? color.lightText : color.offWhite,
                  justifyContent: 'center',
                  alignItems: 'flex-start'
                }
              ]}
            >
              <OymoFont message={city == undefined ? 'City' : city} fontStyle={{ color: theme ? color.white : color.dark }} />
            </TouchableOpacity>

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
                  placeholderTextColor={theme ? color.white : color.dark}
                  style={[
                    editProfile.input,
                    {
                      fontFamily: 'text',
                      backgroundColor: theme ? color.lightText : color.offWhite,
                      color: theme ? color.white : color.dark
                    }
                  ]}
                />
              </View>
            }

            {
              profile &&
              <View style={editProfile.aboutContainer}>
                <OymoFont message='The purposes of dating' fontStyle={editProfile.aboutText} fontFamily='montserrat_bold' />

                <SelectDropdown
                  data={['Find the ideal woman', 'Romantic date', 'Serious relationship', 'Travel together']}
                  onSelect={(selectedItem, index) => { updateDoc(doc(db, 'users', id), { purposeOfDating: selectedItem }) }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText={profile?.purposeOfDating || 'The purposes of dating'}
                  buttonStyle={{
                    flex: 1,
                    height: 50,
                    width: '100%',
                    borderRadius: 12,
                    backgroundColor: theme ? color.lightText : color.offWhite,
                    padding: 0,
                    flexDirection: 'row',
                    justifyContent: 'flex-start'
                  }}
                  buttonTextStyle={{
                    color: theme ? color.white : color.dark,
                    fontFamily: 'text',
                    fontSize: 12,
                    textAlign: 'left',
                    marginLeft: 8
                  }}
                  dropdownStyle={{
                    overflow: 'hidden',
                    borderRadius: 12
                  }}
                  dropdownOverlayColor={color.transparent}
                  rowStyle={{ backgroundColor: color.white }}
                  rowTextStyle={{
                    textAlign: 'left',
                    marginLeft: 10
                  }}
                  selectedRowStyle={{ backgroundColor: color.red }}
                  selectedRowTextStyle={{ color: color.white }}
                />
              </View>
            }

            {
              profile &&
              <View style={editProfile.aboutContainer}>
                <OymoFont message='Hair color' fontStyle={editProfile.aboutText} fontFamily='montserrat_bold' />

                <SelectDropdown
                  data={['Blond', 'Brunette', 'Brown-haired', 'Redhead', 'Light brown', 'Black']}
                  onSelect={(selectedItem, index) => { updateDoc(doc(db, 'users', id), { hairColor: selectedItem }) }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText={profile?.hairColor || 'Hair color'}
                  buttonStyle={{
                    flex: 1,
                    height: 50,
                    width: '100%',
                    borderRadius: 12,
                    backgroundColor: theme ? color.lightText : color.offWhite,
                    padding: 0,
                    flexDirection: 'row',
                    justifyContent: 'flex-start'
                  }}
                  buttonTextStyle={{
                    color: theme ? color.white : color.dark,
                    fontFamily: 'text',
                    fontSize: 12,
                    textAlign: 'left',
                    marginLeft: 8
                  }}
                  dropdownStyle={{
                    overflow: 'hidden',
                    borderRadius: 12
                  }}
                  dropdownOverlayColor={color.transparent}
                  rowStyle={{ backgroundColor: color.white }}
                  rowTextStyle={{
                    textAlign: 'left',
                    marginLeft: 10
                  }}
                  selectedRowStyle={{ backgroundColor: color.red }}
                  selectedRowTextStyle={{ color: color.white }}
                />
              </View>
            }

            {
              profile &&
              <View style={editProfile.aboutContainer}>
                <OymoFont message={`Height: ${yourHeight}cm`} fontStyle={editProfile.aboutText} fontFamily='montserrat_bold' />

                <Slider
                  style={{ width, height: 40, marginLeft: -10 }}
                  step={1}
                  value={yourHeight}
                  minimumValue={140}
                  maximumValue={200}
                  thumbTintColor={color.red}
                  minimumTrackTintColor={color.lightBorderColor}
                  maximumTrackTintColor={theme ? color.white : color.dark}
                  onSlidingComplete={(low, high, fromUser) => {
                    setYourHeight(low)
                  }}
                />
              </View>
            }

            {
              profile &&
              <View style={editProfile.aboutContainer}>
                <OymoFont message={`Weight: ${yourWeight}kg`} fontStyle={editProfile.aboutText} fontFamily='montserrat_bold' />

                <Slider
                  style={{ width, height: 40, marginLeft: -10 }}
                  step={1}
                  value={yourWeight}
                  minimumValue={40}
                  maximumValue={150}
                  thumbTintColor={color.red}
                  minimumTrackTintColor={color.lightBorderColor}
                  maximumTrackTintColor={theme ? color.white : color.dark}
                  onSlidingComplete={(low, high, fromUser) => {
                    setYourWeight(low)
                  }}
                />
              </View>
            }

            {
              profile &&
              <View style={editProfile.aboutContainer}>
                <OymoFont message='Eyes color' fontStyle={editProfile.aboutText} fontFamily='montserrat_bold' />

                <SelectDropdown
                  data={['Blue', 'Green', 'Brown', 'Grey']}
                  onSelect={(selectedItem, index) => { updateDoc(doc(db, 'users', id), { eyeColor: selectedItem }) }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText={profile?.eyeColor || 'Eyes color'}
                  buttonStyle={{
                    flex: 1,
                    height: 50,
                    width: '100%',
                    borderRadius: 12,
                    backgroundColor: theme ? color.lightText : color.offWhite,
                    padding: 0,
                    flexDirection: 'row',
                    justifyContent: 'flex-start'
                  }}
                  buttonTextStyle={{
                    color: theme ? color.white : color.dark,
                    fontFamily: 'text',
                    fontSize: 12,
                    textAlign: 'left',
                    marginLeft: 8
                  }}
                  dropdownStyle={{
                    overflow: 'hidden',
                    borderRadius: 12
                  }}
                  dropdownOverlayColor={color.transparent}
                  rowStyle={{ backgroundColor: color.white }}
                  rowTextStyle={{
                    textAlign: 'left',
                    marginLeft: 10
                  }}
                  selectedRowStyle={{ backgroundColor: color.red }}
                  selectedRowTextStyle={{ color: color.white }}
                />
              </View>
            }

            {
              profile &&
              <View style={editProfile.aboutContainer}>
                <OymoFont message='Relationship status' fontStyle={editProfile.aboutText} fontFamily='montserrat_bold' />

                <SelectDropdown
                  data={['Free', "It's complicated", 'Divorced']}
                  onSelect={(selectedItem, index) => { updateDoc(doc(db, 'users', id), { relationshipStatus: selectedItem }) }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText={profile?.relationshipStatus || 'Relationship status'}
                  buttonStyle={{
                    flex: 1,
                    height: 50,
                    width: '100%',
                    borderRadius: 12,
                    backgroundColor: theme ? color.lightText : color.offWhite,
                    padding: 0,
                    flexDirection: 'row',
                    justifyContent: 'flex-start'
                  }}
                  buttonTextStyle={{
                    color: theme ? color.white : color.dark,
                    fontFamily: 'text',
                    fontSize: 12,
                    textAlign: 'left',
                    marginLeft: 8
                  }}
                  dropdownStyle={{
                    overflow: 'hidden',
                    borderRadius: 12
                  }}
                  dropdownOverlayColor={color.transparent}
                  rowStyle={{ backgroundColor: color.white }}
                  rowTextStyle={{
                    textAlign: 'left',
                    marginLeft: 10
                  }}
                  selectedRowStyle={{ backgroundColor: color.red }}
                  selectedRowTextStyle={{ color: color.white }}
                />
              </View>
            }

            {
              profile &&
              <View style={editProfile.aboutContainer}>
                <OymoFont message='Children' fontStyle={editProfile.aboutText} fontFamily='montserrat_bold' />

                <SelectDropdown
                  data={["Don't have children", 'Have children']}
                  onSelect={(selectedItem, index) => { updateDoc(doc(db, 'users', id), { children: selectedItem }) }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText={profile?.children || 'Children'}
                  buttonStyle={{
                    flex: 1,
                    height: 50,
                    width: '100%',
                    borderRadius: 12,
                    backgroundColor: theme ? color.lightText : color.offWhite,
                    padding: 0,
                    flexDirection: 'row',
                    justifyContent: 'flex-start'
                  }}
                  buttonTextStyle={{
                    color: theme ? color.white : color.dark,
                    fontFamily: 'text',
                    fontSize: 12,
                    textAlign: 'left',
                    marginLeft: 8
                  }}
                  dropdownStyle={{
                    overflow: 'hidden',
                    borderRadius: 12
                  }}
                  dropdownOverlayColor={color.transparent}
                  rowStyle={{ backgroundColor: color.white }}
                  rowTextStyle={{
                    textAlign: 'left',
                    marginLeft: 10
                  }}
                  selectedRowStyle={{ backgroundColor: color.red }}
                  selectedRowTextStyle={{ color: color.white }}
                />
              </View>
            }

            {
              profile &&
              <View style={editProfile.aboutContainer}>
                <OymoFont message='Drinking' fontStyle={editProfile.aboutText} fontFamily='montserrat_bold' />

                <SelectDropdown
                  data={['Non drinker', 'Occationally drink', 'Social drinker', 'Heavy drinker']}
                  onSelect={(selectedItem, index) => { updateDoc(doc(db, 'users', id), { drinking: selectedItem }) }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText={profile?.drinking || 'Drinking'}
                  buttonStyle={{
                    flex: 1,
                    height: 50,
                    width: '100%',
                    borderRadius: 12,
                    backgroundColor: theme ? color.lightText : color.offWhite,
                    padding: 0,
                    flexDirection: 'row',
                    justifyContent: 'flex-start'
                  }}
                  buttonTextStyle={{
                    color: theme ? color.white : color.dark,
                    fontFamily: 'text',
                    fontSize: 12,
                    textAlign: 'left',
                    marginLeft: 8
                  }}
                  dropdownStyle={{
                    overflow: 'hidden',
                    borderRadius: 12
                  }}
                  dropdownOverlayColor={color.transparent}
                  rowStyle={{ backgroundColor: color.white }}
                  rowTextStyle={{
                    textAlign: 'left',
                    marginLeft: 10
                  }}
                  selectedRowStyle={{ backgroundColor: color.red }}
                  selectedRowTextStyle={{ color: color.white }}
                />
              </View>
            }

            {
              profile &&
              <View style={editProfile.aboutContainer}>
                <OymoFont message='Smoking' fontStyle={editProfile.aboutText} fontFamily='montserrat_bold' />

                <SelectDropdown
                  data={['Non smoker', 'Occationally smoke', 'Social smoker', 'Smoker']}
                  onSelect={(selectedItem, index) => { updateDoc(doc(db, 'users', id), { smoking: selectedItem }) }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText={profile?.smoking || 'Smoking'}
                  buttonStyle={{
                    flex: 1,
                    height: 50,
                    width: '100%',
                    borderRadius: 12,
                    backgroundColor: theme ? color.lightText : color.offWhite,
                    padding: 0,
                    flexDirection: 'row',
                    justifyContent: 'flex-start'
                  }}
                  buttonTextStyle={{
                    color: theme ? color.white : color.dark,
                    fontFamily: 'text',
                    fontSize: 12,
                    textAlign: 'left',
                    marginLeft: 8
                  }}
                  dropdownStyle={{
                    overflow: 'hidden',
                    borderRadius: 12
                  }}
                  dropdownOverlayColor={color.transparent}
                  rowStyle={{ backgroundColor: color.white }}
                  rowTextStyle={{
                    textAlign: 'left',
                    marginLeft: 10
                  }}
                  selectedRowStyle={{ backgroundColor: color.red }}
                  selectedRowTextStyle={{ color: color.white }}
                />
              </View>
            }

            {
              profile &&
              <View style={editProfile.aboutContainer}>
                <OymoFont message='Occupation' fontStyle={editProfile.aboutText} fontFamily='montserrat_bold' />

                <SelectDropdown
                  data={['IT', 'Study', 'Health care', 'Finance', 'Politics', 'Sport', 'Law', 'Engineering', 'Education', 'Economy', 'Agriculture', 'Construction', 'Own business', 'Do not work yet', 'Other']}
                  onSelect={(selectedItem, index) => { updateDoc(doc(db, 'users', id), { occupation: selectedItem }) }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText={profile?.occupation || 'Occupation'}
                  buttonStyle={{
                    flex: 1,
                    height: 50,
                    width: '100%',
                    borderRadius: 12,
                    backgroundColor: theme ? color.lightText : color.offWhite,
                    padding: 0,
                    flexDirection: 'row',
                    justifyContent: 'flex-start'
                  }}
                  buttonTextStyle={{
                    color: theme ? color.white : color.dark,
                    fontFamily: 'text',
                    fontSize: 12,
                    textAlign: 'left',
                    marginLeft: 8
                  }}
                  dropdownStyle={{
                    overflow: 'hidden',
                    borderRadius: 12
                  }}
                  dropdownOverlayColor={color.transparent}
                  rowStyle={{ backgroundColor: color.white }}
                  rowTextStyle={{
                    textAlign: 'left',
                    marginLeft: 10
                  }}
                  selectedRowStyle={{ backgroundColor: color.red }}
                  selectedRowTextStyle={{ color: color.white }}
                />
              </View>
            }

            {
              (profile && profile?.age == undefined) &&
              <View style={{ marginBottom: 20 }}>
                <OymoFont message='Date of birth' fontStyle={editProfile.passionsText} fontFamily='montserrat_bold' />

                <TouchableOpacity onPress={() => navigation.navigate('DOB')} style={[editProfile.genderButton, { marginTop: 10 }]}>
                  <OymoFont message='Set your birth date' fontStyle={editProfile.genderText} fontFamily='montserrat_bold' />
                </TouchableOpacity>
              </View>
            }

            {
              profile &&
              <>
                {
                  profile?.passions != '' &&
                  <TouchableOpacity style={{ marginVertical: 20 }} onPress={() => navigation.navigate('Passion')}>
                    <OymoFont message='Hobbies' fontStyle={editProfile.passionsText} fontFamily='montserrat_bold' />

                    {
                      profile?.passions == undefined ?
                        <View>
                          <OymoFont message='Select your hobbies' />
                        </View> :
                        <View
                          style={[
                            editProfile.passionContainer,
                            { backgroundColor: profile?.passions.length < 1 ? color.offWhite : color.transparent }
                          ]}
                        >
                          {
                            profile?.passions?.map((passion, index) => (
                              <View key={index} style={[editProfile.passions, { backgroundColor: theme ? color.lightText : color.offWhite }]}>
                                <OymoFont message={passion} fontStyle={{ ...editProfile.passion, color: theme ? color.white : color.dark }} />
                              </View>
                            ))
                          }
                        </View>
                    }
                  </TouchableOpacity>
                }
              </>
            }

            {
              (profile && !profile.gender) &&
              <TouchableOpacity onPress={() => navigation.navigate('Gender')} style={editProfile.genderButton}>
                <OymoFont message='Set your gender' fontStyle={editProfile.genderText} fontFamily='montserrat_bold' />
              </TouchableOpacity>
            }

            {profile && <LookingFor />}

            {profile?.username != undefined &&
              <TouchableOpacity
                onPress={() => navigation.navigate('Upgrade')}
                style={[editProfile.goPro, { backgroundColor: theme ? color.lightText : color.offWhite }]}
              >
                <Image source={require('../../assets/star.png')} style={editProfile.star} />
                <OymoFont message='Buy Coins' fontStyle={{ ...editProfile.upgradeButtonText, color: theme ? color.white : color.dark }} />
              </TouchableOpacity>
            }

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

            <TouchableOpacity onPress={logoutUser} style={[editProfile.logoutButton, { backgroundColor: theme ? color.lightText : color.offWhite }]}>
              <OymoFont message='Logout' fontStyle={editProfile.logoutButtonText} />
            </TouchableOpacity>

            <View style={editProfile.bottomContainer}>
              <Image source={require('../../assets/adaptive-icon.png')} style={editProfile.logo} />
              <OymoFont message={`Version ${Constants?.manifest?.version}`} fontStyle={{ ...editProfile.version, color: theme ? color.white : color.dark }} />
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