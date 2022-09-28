import { View, Text, ImageBackground, TouchableOpacity, Image, ScrollView, TextInput, Button, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { create } from '../../../style/events'
import { useState } from 'react'
import { profile } from '../../../style/profile'
import { BlurView } from 'expo-blur'
import color from '../../../style/color'
import OymoFont from '../../../components/OymoFont'
import { FontAwesome, SimpleLineIcons } from '@expo/vector-icons'

import DateTimePickerModal from "react-native-modal-datetime-picker"

import * as ImagePicker from 'expo-image-picker'

import SelectDropdown from 'react-native-select-dropdown'

import uuid from 'uuid-random'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { doc, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'

const events = [
  'Sleep over',
  'clubbing',
  'Sit out',
  'Birthday party',
  'Pool party',
  'Wedding',
  'Convocation',
  'Matriculation',
  'Wet shirt party'
]

const Craate = ({ navigation }) => {
  const { user, profile } = useSelector(state => state.user)
  const [image, setImage] = useState(null)
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [mode, setMode] = useState('date')
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false)
  const [isDurationPickerVisible, setDurationPickerVisibility] = useState(false)
  const [showButton, setShowButton] = useState(true)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState('')
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(false)

  const storage = getStorage()

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  // date
  const showDatePicker = () => setDatePickerVisibility(true)
  const hideDatePicker = () => setDatePickerVisibility(false)
  const handleDateConfirm = date => {
    hideDatePicker()
    setDate(JSON.stringify(date))
  }

  // time
  const showTimePicker = () => setTimePickerVisibility(true)
  const hideTimePicker = () => setTimePickerVisibility(false)
  const handleTimeConfirm = time => {
    hideTimePicker()
    setTime(JSON.stringify(time))
  }

  // duration
  const showDurationPicker = () => setDurationPickerVisibility(true)
  const hideDurationPicker = () => setDurationPickerVisibility(false)
  const handleDurationConfirm = duration => {
    hideDurationPicker()
    setDuration(JSON.stringify(duration))
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setShowButton(false)
    })
  }, [Keyboard])

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      setShowButton(true)
    })
  }, [Keyboard])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [9, 16]
    })

    if (!result?.cancelled && result?.type == 'image') setImage(result.uri)
  }

  const saveEvent = async () => {
    if (profile?.coins <= 0 && image) return
    if (image && title == '' && location == '' && description == '' && type == '' && date == '' && time == '' && duration == '') return

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.response)

      xhr.responseType = 'blob'
      xhr.open('GET', image, true)
      xhr.send(null)
    })

    const link = `events/${id}/${uuid()}`

    const photoRef = ref(storage, link)

    setLoading(true)

    uploadBytes(photoRef, blob)
      .then(snapshot => {
        getDownloadURL(snapshot?.ref)
          .then(async downloadURL => {
            await setDoc(doc(db, 'events', uuid()), {
              user: id,
              image: downloadURL,
              title,
              date,
              time,
              duration,
              location,
              type,
              description,
              timestamp: serverTimestamp()
            })

            await updateDoc(doc(db, 'users', id), {
              coins: increment(-100)
            })
            setLoading(false)
            setImage(null)
            setTitle('')
            setDate('')
            setTime('')
            setDuration('')
            setLocation('')
            setType('')
            setDescription('')
            navigation.goBack()
          })
      })
  }

  return (
    <View style={create.container}>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.goBack()} />
      <ImageBackground source={!image ? require('../../../assets/background2.jpg') : { uri: image }} style={create.imgBg} blurRadius={50}>
        <View style={create.profileDetailes}>
          {
            image ?
              <TouchableOpacity onPress={pickImage}>
                <Image source={{ uri: image }} style={create.avatar} />
              </TouchableOpacity> :
              <TouchableOpacity onPress={pickImage}>
                <BlurView intensity={50} tint='light' style={create.blurView}>
                  <FontAwesome name='user-o' size={29} color={color.white} />
                </BlurView>
              </TouchableOpacity>
          }

          <BlurView style={create.eventInfoContainer} intensity={50} tint='light'>
            <OymoFont message={title || 'Title'} fontStyle={create.title} />
            <OymoFont message={location || 'Location'} fontStyle={create.location} />
          </BlurView>
        </View>
      </ImageBackground>

      <KeyboardAvoidingView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={create.scroll}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={color.dark}
              placeholder='Event title'
              style={create.input}
            />

            <View style={create.dateView}>
              <View style={create.dateInputView}>
                <OymoFont message='Date' />
                <TouchableOpacity
                  onPress={() => {
                    setMode('date')
                    showDatePicker()
                  }}
                  style={create.dateInput}
                >
                  {
                    date == '' ?
                      <OymoFont message='Date' lines={1} /> :
                      <OymoFont message={JSON.parse(date) || 'Date'} lines={1} />
                  }
                </TouchableOpacity>
              </View>

              <View style={create.dateInputView}>
                <OymoFont message='Time' />
                <TouchableOpacity
                  onPress={() => {
                    setMode('time')
                    showTimePicker()
                  }}
                  style={create.dateInput}
                >
                  {
                    time == '' ?
                      <OymoFont message='Time' lines={1} /> :
                      <OymoFont message={JSON.parse(time) || 'Time'} lines={1} />
                  }
                </TouchableOpacity>
              </View>
              <View style={create.dateInputView}>
                <OymoFont message='Duration' />
                <TouchableOpacity
                  onPress={() => {
                    setMode('time')
                    showDurationPicker()
                  }}
                  style={create.dateInput}
                >
                  {
                    duration == '' ?
                      <OymoFont message='Duration' lines={1} /> :
                      <OymoFont message={JSON.parse(duration) || 'Duration'} lines={1} />
                  }
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              value={location}
              numberOfLines={1}
              onChangeText={setLocation}
              placeholderTextColor={color.dark}
              placeholder='Locaation'
              style={create.input}
            />
            <SelectDropdown
              data={events}
              onSelect={(selectedItem, index) => setType(selectedItem)}
              buttonTextAfterSelection={(selectedItem, index) => selectedItem}
              rowTextForSelection={(item, index) => item}
              buttonStyle={{
                width: Dimensions.get('window').width - 20,
                height: 45,
                borderRadius: 12,
                marginHorizontal: 10,
                marginTop: 10,
                backgroundColor: color.offWhite,
                padding: 0,
                flexDirection: 'row',
                justifyContent: 'flex-start'
              }}
              buttonTextStyle={{
                color: color.dark,
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
              rowStyle={{
                backgroundColor: color.white
              }}
              rowTextStyle={{
                textAlign: 'left',
                marginLeft: 10
              }}
              selectedRowStyle={{
                backgroundColor: color.red
              }}
              selectedRowTextStyle={{
                color: color.white
              }}
            />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={color.dark}
              placeholder='Event description'
              style={create.input}
            />
            <DateTimePickerModal
              mode='date'
              onConfirm={handleDateConfirm}
              onCancel={hideDatePicker}
              isVisible={isDatePickerVisible}
            />
            <DateTimePickerModal
              mode='time'
              onConfirm={handleTimeConfirm}
              onCancel={hideTimePicker}
              isVisible={isTimePickerVisible}
            />
            <DateTimePickerModal
              mode='time'
              onConfirm={handleDurationConfirm}
              onCancel={hideDurationPicker}
              isVisible={isDurationPickerVisible}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>


      {
        showButton &&
        <View style={{ backgroundColor: color.white, width: '100%', height: 50 }}>
          <TouchableOpacity style={create.save} onPress={saveEvent}>
            {
              loading ?
                <ActivityIndicator size='small' color={color.white} /> :
                <OymoFont message='Save event' fontStyle={create.saveText} />
            }
          </TouchableOpacity>
        </View>
      }
    </View>
  )
}

export default Craate