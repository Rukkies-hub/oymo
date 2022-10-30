import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, Keyboard } from 'react-native'
import React, { useEffect } from 'react'
import { su } from '../style/auth'
import { AntDesign, Entypo } from '@expo/vector-icons'
import OymoFont from '../components/OymoFont'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import color from '../style/color'
import { useDispatch, useSelector } from 'react-redux'
import uuid from 'uuid-random'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'
import { setProfile, setSetup } from '../features/userSlice'
import { db } from '../hooks/firebase'
import { setProfiles } from '../features/matchSlice'

const Step2 = () => {
  const navigation = useNavigation()
  const focused = useIsFocused()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.user)
  const [image, setImage] = useState('')
  const [about, setAbout] = useState('')
  const [birthday, setBirthday] = useState(new Date(1598051730000))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      Keyboard.dismiss()
    })
  }, [Keyboard])

  if (focused) {
    NavigationBar.setBackgroundColorAsync(color.white)
    NavigationBar.setButtonStyleAsync('dark')
  }

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  const storage = getStorage()

  const date = new Date()

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: birthday,
      onChange: (event, selectedDate) => {
        setBirthday(selectedDate)
      },
      mode: 'date',
      is24Hour: true,
      maximumDate: new Date(parseInt(date.getFullYear() - 18), 10, 20)
    })
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [9, 16]
    })

    if (!result?.cancelled && result?.type == 'image')
      setImage(result?.uri)
  }

  function getAge (dateString) {
    var today = new Date()
    var birthDate = new Date(dateString)
    var age = today.getFullYear() - birthDate.getFullYear()
    var m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const distance = (lat1, lon1, lat2, lon2, unit) => {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
  }

  const getAllProfiles = async () => {
    const profile = await (await getDoc(doc(db, 'users', id))).data()
    if (!profile) return

    const passes = await getDocs(collection(db, 'users', id, 'passes'))
      .then(snapshot => snapshot?.docs?.map(doc => doc?.id))

    const passeedUserIds = (await passes).length > 0 ? passes : ['test']

    const swipes = await getDocs(collection(db, 'users', id, 'swipes'))
      .then(snapshot => snapshot?.docs?.map(doc => doc?.id))

    const swipededUserIds = (await swipes).length > 0 ? swipes : ['test']

    onSnapshot(query(collection(db, 'users'), where('id', 'not-in', [...passeedUserIds, ...swipededUserIds])),
      snapshot => {
        const array = snapshot?.docs?.filter(doc => doc?.data()?.photoURL != null)
          .filter(doc => doc?.data()?.username != null || doc?.data()?.username != '')
          .filter(doc => doc?.id !== id)
          .filter(doc => distance(doc?.data()?.coords?.latitude, doc?.data()?.coords?.longitude, profile?.coords?.latitude, profile?.coords?.longitude).toFixed(2) <= profile?.radius != undefined ? profile?.radius : 1)
          .map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))

        if (array.length >= 1) dispatch(setProfiles(array))
        else dispatch(setProfiles([]))
      })
  }

  const updateProfile = async () => {
    setLoading(true)
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.response)

      xhr.responseType = 'blob'
      xhr.open('GET', image, true)
      xhr.send(null)
    })

    const link = `avatars/${id}/${uuid()}`
    const photoRef = ref(storage, link)

    uploadBytes(photoRef, blob)
      .then(snapshot => {
        getDownloadURL(snapshot?.ref)
          .then(async downloadURL => {
            await updateDoc(doc(db, 'users', id), {
              photoURL: downloadURL,
              photoLink: link,
              about,
              birthday,
              age: getAge(`${birthday.getFullYear()}/${birthday.getMonth()}/${birthday.getDate()}`)
            })
            setLoading(false)
            dispatch(setSetup(false))

            const profile = await (await getDoc(doc(db, 'users', id))).data()
            dispatch(setProfile(profile))
            getAllProfiles()
          }).catch((e) => setLoading(false))
      })
  }

  return (
    <View style={su.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={su.goBack}>
        <AntDesign name="back" size={24} color={color.black} />
      </TouchableOpacity>
      <OymoFont message='Update profile' fontFamily='montserrat_bold' fontStyle={{ ...su.headText, textAlign: 'center' }} />

      <View style={su.stepperView}>
        <Entypo name='dot-single' size={30} color={color.faintBlack} />
        <Entypo name='dot-single' size={30} color={color.faintBlack} />
        <Entypo name='dot-single' size={30} color={color.red} />
      </View>

      <ScrollView style={su.scrollViewContainer}>
        <View style={su.inputView}>
          {
            image == '' ?
              <TouchableOpacity onPress={pickImage} style={su.avatarView}>
                <AntDesign name="plus" size={35} color={color.red} />
                <OymoFont message='Add avatar' fontFamily='montserrat_light' />
              </TouchableOpacity> :
              <TouchableOpacity onPress={pickImage} style={su.avatarView}>
                <Image source={{ uri: image }} style={su.avatar} />
              </TouchableOpacity>
          }

          <TouchableOpacity style={[su.locationButton, { marginTop: 10 }]} onPress={showDatepicker}>
            <OymoFont message={birthday == null ? 'Birthday' : `Birthday ${new Date(birthday).getDate()}/${new Date(birthday).getMonth()}/${new Date(birthday).getFullYear()}`} fontStyle={{ color: color.lightText }} />
          </TouchableOpacity>

          <TextInput
            value={about}
            style={su.input}
            placeholder='About'
            onChangeText={setAbout}
            placeholderTextColor={color.lightText}
          />
        </View>

        <TouchableOpacity
          onPress={updateProfile}
          disabled={image == '' && about == '' && birthday == ''}
          style={[su.nextButton, { backgroundColor: (image != '' && about != '' && birthday != '') ? color.red : color.lightText }]}
        >
          {
            loading ?
              <ActivityIndicator color={color.white} size='small' /> :
              <Entypo name='chevron-right' size={24} color={color.white} />
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default Step2