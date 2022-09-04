import React, { useRef, useState } from 'react'
import { Pressable, ImageBackground, TouchableOpacity } from 'react-native'
import { Video } from 'expo-av'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Entypo } from '@expo/vector-icons'
import color from '../../style/color'
import { vid } from '../../style/viewAssets'

const ViewVideo = () => {
  const { video, thumbnail } = useRoute().params
  const videoRef = useRef(null)
  const navigation = useNavigation()
  const [status, setStatus] = useState({})

  navigation.addListener('blur', () => videoRef?.current?.stopAsync())

  return (
    <ImageBackground
      source={{ uri: thumbnail }}
      blurRadius={50}
      style={vid.background}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={vid.goBackButton}>
        <Entypo name='chevron-left' size={24} color={color.white} />
      </TouchableOpacity>

      <Pressable
        style={{ flex: 1 }}
        onPress={() => status?.isPlaying ? videoRef?.current?.pauseAsync() : videoRef?.current?.playAsync()}
      >
        <Video
          ref={videoRef}
          source={{ uri: video }}
          resizeMode='contain'
          usePoster
          posterSource={{ uri: thumbnail }}
          posterStyle={vid.poster}
          style={vid.video}
          isPlaying={true}
          isLooping
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      </Pressable>
    </ImageBackground>
  )
}

export default ViewVideo