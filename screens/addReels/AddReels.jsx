import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, Text, TouchableOpacity, Image } from 'react-native'
import { Camera } from 'expo-camera'
import { Audio } from 'expo-av'
import { useIsFocused } from '@react-navigation/core'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import { MaterialIcons, Entypo } from '@expo/vector-icons'
import Bar from '../../components/Bar'
import * as VideoThumbnails from 'expo-video-thumbnails'
import { ar } from '../../style/addReels'
import color from '../../style/color'
import OymoFont from '../../components/OymoFont'

const AddReels = () => {
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
        const options = { maxDuration: 30, quality: Camera?.Constants?.VideoQuality['480'] }
        const videoRecordPromise = cameraRef?.recordAsync(options)

        if (videoRecordPromise) {
          const data = await videoRecordPromise
          const source = data?.uri
          let thumbnail = await generateThumbnail(source)
          if (thumbnail)
            navigation.navigate('SaveReels', { source, thumbnail, mediaType: 'video' })
        }
      } catch (error) {
        console.warn(error)
      }
  }

  const stopVideo = async () => {
    if (cameraRef) cameraRef?.stopRecording()
  }

  const pickFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
      videoMaxDuration: 30
    })

    if (!result?.cancelled) {
      let source = result?.uri
      let thumbnail = await generateThumbnail(source)
      if (thumbnail && result?.type === 'video')
        navigation.navigate('SaveReels', { source, thumbnail, mediaType: result?.type })
    }
  }

  const generateThumbnail = async (source) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(source, { time: 3000 })
      return uri
    } catch (e) {
      console.warn(e)
    }
  }

  if (!hasCameraPermission || !hasAudioPermission || !hasGalleryPermission) {
    return <View />
  }

  return (
    <View style={ar.containr}>
      <Bar color='light' />

      {
        isFocused &&
        <Camera
          ref={ref => setCameraRef(ref)}
          ratio={'16:9'}
          type={cameraType}
          flashMode={cameraFlash}
          onCameraReady={() => setIsCameraReady(true)}
          style={ar.camera}
        />
      }

      <TouchableOpacity onPress={() => navigation.goBack()} style={ar.goBack}>
        <Entypo name='chevron-left' size={24} color={color.white} />
      </TouchableOpacity>

      <View style={ar.controlersView}>
        <TouchableOpacity
          onPress={
            () => setCameraType(
              cameraType === Camera?.Constants?.Type?.back ?
                Camera?.Constants?.Type?.front : Camera?.Constants?.Type?.back
            )
          }
          style={ar.flip}
        >
          <MaterialIcons name='flip-camera-android' color={color.white} size={24} />
          <OymoFont message='Flip' fontStyle={ar.flipText} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={
            () => setCameraFlash(
              cameraFlash === Camera?.Constants?.FlashMode?.torch ?
                Camera?.Constants?.FlashMode?.off : Camera?.Constants?.FlashMode?.torch
            )
          }
          style={ar.flash}
        >
          <MaterialIcons name='bolt' color={color.white} size={24} />
          <OymoFont message='Flash' fontStyle={ar.flashText} />
        </TouchableOpacity>
      </View>

      <View style={ar.actionsView}>
        <View style={{ flex: 1 }} />
        <View style={ar.captureView}>
          <TouchableOpacity
            disabled={!isCameraReady}
            onLongPress={recordVideo}
            onPressOut={stopVideo}
            style={ar.captureButton}
          />
        </View>

        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={pickFromGallery} style={ar.galleryButton}>
            {
              galleryItems[0] == undefined ?
                <View /> :
                <Image source={{ uri: galleryItems[0].uri }} style={ar.preview} />
            }
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default AddReels