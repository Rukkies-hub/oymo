import React, { forwardRef, useRef, useImperativeHandle, useEffect, useState } from 'react'

import { TouchableOpacity, Dimensions } from 'react-native'

import { Video } from 'expo-av'
import { useNavigation } from '@react-navigation/native'
import color from '../../../style/color'
import { useDispatch } from 'react-redux'
import { setActiveReelUser } from '../../../features/reelsSlice'

const { width } = Dimensions.get('window')

export const ReelsSingle = forwardRef(({ item }, parentRef) => {
  const ref = useRef(null)

  const navigation = useNavigation()
  const dispatch = useDispatch()

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
    } catch (e) { }
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
      onPressIn={() => {
        dispatch(setActiveReelUser(item))
        // videoStatus?.isPlaying ? ref?.current?.pauseAsync() : ref?.current?.playAsync()
      }}
      style={{
        flex: 1,
        width,
        backgroundColor: color.black
      }}
    >
      <Video
        ref={ref}
        style={{ flex: 1, backgroundColor: color.black }}
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
        onPlaybackStatusUpdate={status => {
          setVideoStatus(() => status)
        }}
      />
    </TouchableOpacity>
  )
})

export default ReelsSingle
// for reels