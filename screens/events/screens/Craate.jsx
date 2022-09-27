import { View, Text, ImageBackground, TouchableOpacity, Image, ScrollView, TextInput, Button, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native'
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

const Craate = ({ navigation }) => {
  const [image, setImage] = useState(null)
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [mode, setMode] = useState('date')
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [showButton, setShowButton] = useState(true)

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }

  const hideDatePicker = () => {
    setDatePickerVisibility(false)
  }

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date)
    hideDatePicker()
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
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [9, 16]
    })

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri)
    }
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
            <OymoFont message={title} fontStyle={create.title} />
            <OymoFont message={location} fontStyle={create.location} />
          </BlurView>
        </View>
      </ImageBackground>

      <KeyboardAvoidingView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={create.scroll}>
            <TextInput
              value={title}
              onChangeText={setTitle}
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
                  <OymoFont message='Date' />
                </TouchableOpacity>
              </View>

              <View style={create.dateInputView}>
                <OymoFont message='Time' />
                <TouchableOpacity
                  onPress={() => {
                    setMode('time')
                    showDatePicker()
                  }}
                  style={create.dateInput}
                >
                  <OymoFont message='Time' />
                </TouchableOpacity>
              </View>
              <View style={create.dateInputView}>
                <OymoFont message='Duration' />
                <TouchableOpacity
                  onPress={() => {
                    setMode('time')
                    showDatePicker()
                  }}
                  style={create.dateInput}
                >
                  <OymoFont message='Duration' />
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              value={location}
              numberOfLines={1}
              onChangeText={setLocation}
              placeholder='Locaation'
              style={create.input}
            />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder='Event description'
              style={create.input}
            />
            <DateTimePickerModal
              mode={mode}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              isVisible={isDatePickerVisible}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>


      {
        showButton &&
        <TouchableOpacity style={create.save}>
          <OymoFont message='Save event' fontStyle={create.saveText} />
        </TouchableOpacity>
      }
    </View>
  )
}

export default Craate