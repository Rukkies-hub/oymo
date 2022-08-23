import React, { forwardRef, useRef, useImperativeHandle, useEffect, useState } from 'react'

import { TouchableOpacity, Dimensions } from 'react-native'

import { Video } from 'expo-av'
import { useNavigation } from '@react-navigation/native'
import color from '../../../style/color'

const { width } = Dimensions.get('window')

export const ReelsSingle = forwardRef(({ item }, parentRef) => {
  const ref = useRef(null)

  const navigation = useNavigation()

  const [videoStatus, setVideoStatus] = useState({})

  useImperativeHandle(parentRef, () => ({
    play,
    unload,
    stop
  }))

  useEffect(() =>
    navigation.addListener('blur', () => {
      ref?.current?.stopAsync()
      return () => unload()
    })
    , [navigation])

  useEffect(() => {
    return () => unload()
  }, [])

  const play = async () => {
    if (ref?.current == null) return

    const status = await ref?.current?.getStatusAsync()
    if (status?.isPlaying) return

    try {
      await ref?.current?.playAsync()
    } catch (e) {}
  }
  
  const stop = async () => {
    if (ref?.current == null) return

    const status = await ref?.current?.getStatusAsync()
    if (!status?.isPlaying) return

    try {
      await ref?.current?.stopAsync()
    } catch (e) { }
  }

  const unload = async () => {
    if (ref?.current == null) return

    try {
      await ref?.current?.unloadAsync()
    } catch (e) { }
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => videoStatus?.isPlaying ? ref?.current?.pauseAsync() : ref?.current?.playAsync()}
      style={{
        flex: 1,
        width,
        backgroundColor: color.transparent
      }}
    >
      <Video
        ref={ref}
        style={{ flex: 1, backgroundColor: color.transparent }}
        resizeMode='contain'
        isLooping
        usePoster
        posterSource={{ uri: item?.thumbnail }}
        posterStyle={{
          resizeMode: 'contain',
          height: '100%',
          overflow: 'hidden'
        }}
        shouldPlay={false}
        source={{ uri: item?.media }}
        onPlaybackStatusUpdate={status => setVideoStatus(() => status)}
      />
    </TouchableOpacity>
  )
})

export default ReelsSingle
// for reels