import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, Text, TouchableOpacity, Image, Dimensions } from 'react-native'

import { Camera } from 'expo-camera'

import { Audio } from 'expo-av'

import { useIsFocused } from '@react-navigation/core'

import color from '../../style/color'

import { useNavigation, useRoute } from '@react-navigation/native'

import * as ImagePicker from 'expo-image-picker'

import * as MediaLibrary from 'expo-media-library'

import { MaterialIcons, Entypo } from '@expo/vector-icons'

import Bar from '../../components/Bar'

import * as VideoThumbnails from 'expo-video-thumbnails'

import { mc } from '../../style/messageCamera'
import OymoFont from '../../components/OymoFont'

const { width } = Dimensions.get('window')

const MessageCamera = () => {
  const { matchDetails } = useRoute().params

  const navigation = useNavigation()
  const [hasCameraPermission, setHasCameraPermission] = useState(false)
  const [hasAudioPermission, setHasAudioPermission] = useState(false)
  const [hasGalleryPermission, setHasGalleryPermissions] = useState(false)
  const [galleryItems, setGalleryItems] = useState([])
  const [cameraRef, setCameraRef] = useState(null)
  const [cameraType, setCameraType] = useState(Camera?.Constants?.Type?.back)
  const [cameraFlash, setCameraFlash] = useState(Camera?.Constants?.FlashMode?.off)
  const [isCameraReady, setIsCameraReady] = useState(false)

  const isFocused = useIsFocused()

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera?.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraStatus?.status === 'granted')

      const audioStatus = await Audio.requestPermissionsAsync()
      setHasAudioPermission(audioStatus?.status === 'granted')

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setHasGalleryPermissions(galleryStatus?.status === 'granted')

      if (galleryStatus?.status == 'granted') {
        const userGalleryMedia = await MediaLibrary.getAssetsAsync({
          sortBy: ['creationTime'],
          mediaType: ['video']
        })
        setGalleryItems(userGalleryMedia.assets)
      }
    })()
  }, [])

  const recordVideo = async () => {
    if (cameraRef)
      try {
        const options = { maxDuration: 10, quality: Camera?.Constants?.VideoQuality['480'] }
        const videoRecordPromise = cameraRef?.recordAsync(options)

        if (videoRecordPromise) {
          const data = await videoRecordPromise
          const { uri } = await VideoThumbnails.getThumbnailAsync(data?.uri, { time: 1000 })
          if (uri) {
            navigation.navigate('PreviewMessageImage', {
              matchDetails,
              media: {
                uri: data?.uri,
                thumbnail: uri,
                type: 'video',
                width,
                height: null,
                duration: null,
                rotation: 1
              }
            })
          }
        }
      } catch (error) {
        console.warn('Oymo camera error: ', error)
      }
  }

  const stopVideo = async () => {
    if (cameraRef) cameraRef?.stopRecording()
  }

  const pickFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
      videoMaxDuration: 30
    })

    if (!result?.cancelled) {
      if (result?.type === 'image')
        navigation.navigate('PreviewMessageImage', {
          matchDetails,
          media: {
            ...result,
            type: 'image'
          }
        })
      if (result?.type === 'video') {
        let thumbnail = await generateThumbnail(result?.uri)
        if (thumbnail)
          navigation.navigate('PreviewMessageImage', {
            matchDetails,
            media: {
              uri: result?.uri,
              type: result?.type,
              width,
              thumbnail,
              height: result?.height || null,
              duration: result?.duration || null,
              rotation: 1
            }
          })
      }
    }
  }

  const generateThumbnail = async (source) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(source, { time: 3000 })
      return uri
    } catch (e) {
      console.warn(e.message)
    }
  }

  const takePictire = async () => {
    if (cameraRef) {
      const data = await cameraRef?.takePictureAsync(null)
      navigation.navigate('PreviewMessageImage', {
        matchDetails,
        media: {
          ...data,
          type: 'image'
        }
      })
    }
  }

  if (!hasCameraPermission || !hasAudioPermission || !hasGalleryPermission)
    return <View />

  return (
    <View style={mc.containr}>
      <Bar color={'light'} />

      {
        isFocused ?
          <Camera
            ref={ref => setCameraRef(ref)}
            ratio={'16:9'}
            type={cameraType}
            flashMode={cameraFlash}
            onCameraReady={() => setIsCameraReady(true)}
            style={mc.camera}
          />
          : null
      }

      <TouchableOpacity onPress={() => navigation.goBack()} style={mc.goBack}>
        <Entypo name='chevron-left' size={24} color={color.white} />
      </TouchableOpacity>

      <View style={mc.controlersView}>
        <TouchableOpacity
          onPress={
            () => setCameraType(
              cameraType === Camera?.Constants?.Type?.back ?
                Camera?.Constants?.Type?.front : Camera?.Constants?.Type?.back
            )
          }
          style={mc.flip}
        >
          <MaterialIcons name='flip-camera-android' color={color.white} size={24} />
          <OymoFont message='Flip' fontStyle={mc.flipText} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={
            () => setCameraFlash(
              cameraFlash === Camera?.Constants?.FlashMode?.torch ?
                Camera?.Constants?.FlashMode?.off : Camera?.Constants?.FlashMode?.torch
            )
          }
          style={mc.flash}
        >
          <MaterialIcons name='bolt' color={color.white} size={24} />
          <OymoFont message='Flash' fontStyle={mc.flashText} />
        </TouchableOpacity>
      </View>

      <View style={mc.actionsView}>
        <View style={{ flex: 1 }} />
        <View style={mc.captureView}>
          <TouchableOpacity
            disabled={!isCameraReady}
            onPress={takePictire}
            onLongPress={recordVideo}
            onPressOut={stopVideo}
            style={mc.captureButton}
          />
        </View>

        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={pickFromGallery} style={mc.galleryButton}>
            {
              galleryItems[0] == undefined ?
                <View /> :
                <Image source={{ uri: galleryItems[0].uri }} style={mc.preview} />
            }
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default MessageCamera