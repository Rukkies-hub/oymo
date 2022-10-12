import React, { useEffect } from 'react'

import { Camera, CameraType, FlashMode, VideoQuality } from 'expo-camera'
import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { ar } from '../../style/addReels'
import Bar from '../../components/Bar'
import OymoFont from '../../components/OymoFont'
import color from '../../style/color'
import * as NavigationBar from 'expo-navigation-bar'
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons'
import * as VideoThumbnails from 'expo-video-thumbnails'
import * as ImagePicker from 'expo-image-picker'
import { Audio } from 'expo-av'

const AddReels = () => {
  const [type, setType] = useState(CameraType.back)
  const [cameraFlash, setCameraFlash] = useState(CameraType.back)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [cameraRef, setCameraRef] = useState(null)

  const [permission, requestPermission] = Camera.useCameraPermissions()
  const isFocused = useIsFocused()
  const navigation = useNavigation()

  if (isFocused) {
    NavigationBar.setVisibilityAsync('hidden')
    NavigationBar.setBehaviorAsync('overlay-swipe')
  }

  navigation.addListener('blur', () => {
    NavigationBar.setVisibilityAsync('visible')
  })

  useEffect(() => {
    (async () => {
      await Audio.requestPermissionsAsync()
    })()
  }, [])

  if (!permission) {
    // Camera permissions are still loading
    return <View />
  }

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))
  }

  const toggleCameraFlash = () => {
    setCameraFlash(current => (current === FlashMode.torch ? FlashMode.off : FlashMode.torch))
  }

  const recordVideo = async () => {
    if (cameraRef)
      try {
        const options = { maxDuration: 30, quality: VideoQuality['480'] }
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

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={[ar.containr, { justifyContent: 'center', alignItems: 'center' }]}>
        <OymoFont message='We need your permission to show the camera' fontStyle={{ color: color.white, marginBottom: 10 }} />
        <TouchableOpacity onPress={requestPermission} style={ar.permissionButton}>
          <OymoFont message='grant permission' fontStyle={{ color: color.white }} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={[ar.containr]}>
      <Bar color='light' />

      {
        isFocused &&
        <Camera
          type={type}
          ratio={'16:9'}
          style={ar.camera}
          flashMode={cameraFlash}
          ref={ref => setCameraRef(ref)}
          onCameraReady={() => setIsCameraReady(true)}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={ar.goBack}>
            <Entypo name='chevron-left' size={24} color={color.white} />
          </TouchableOpacity>
        </Camera>
      }
      
      <View style={ar.controlersView}>
        <TouchableOpacity onPress={toggleCameraType} style={ar.flip}>
          <MaterialIcons name='flip-camera-android' color={color.white} size={24} />
          <OymoFont message='Flip' fontStyle={ar.flipText} />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleCameraFlash} style={ar.flash}>
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
            <Ionicons name="images-outline" size={26} color={color.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default AddReels