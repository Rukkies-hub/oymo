import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native'

import { Video } from 'expo-av'

import { LinearGradient } from 'expo-linear-gradient'
import LikeReels from '../../components/reelsComponents/LikeReels'

const { width, height } = Dimensions.get('window')

import { FontAwesome, Entypo } from '@expo/vector-icons'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'

import Bar from '../../components/Bar'

import { reels } from '../../style/viewReels'
import color from '../../style/color'
import UserInfo from './components/UserInfo'
import OymoFont from '../../components/OymoFont'
import UserAvatar from './components/UserAvatar'
import { useDispatch, useSelector } from 'react-redux'
import { setReelsProps } from '../../features/reelsSlice'

const ViewReel = () => {
  const { profile } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const focus = useIsFocused()
  const { reel } = useRoute().params

  const ref = useRef(null)

  const [videoStatus, setVideoStatus] = useState({})

  useLayoutEffect(() => {
    ref?.current?.playAsync()
  }, [])

  useEffect(() =>
    navigation.addListener('blur', () => {
      ref?.current?.stopAsync()
      return () => unload()
    })
    , [navigation])

  const disabled = () => navigation.navigate('SetupModal')

  return (
    <ImageBackground
      source={{ uri: reel?.thumbnail }}
      resizeMode='cover'
      blurRadius={50}
      style={reels.container}
    >
      <Bar color={'light'} />

      <TouchableOpacity onPress={() => navigation.goBack()} style={reels.goBackButton}>
        <Entypo name='chevron-left' size={24} color={color.white} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => videoStatus?.isPlaying ? ref?.current?.pauseAsync() : ref?.current?.playAsync()}
        style={reels.videoContainer}
      >
        {
          focus &&
          <Video
            ref={ref}
            style={{ flex: 1, backgroundColor: color.transparent }}
            resizeMode='contain'
            isLooping
            usePoster
            posterSource={{ uri: reel?.thumbnail }}
            posterStyle={{ resizeMode: 'contain', height: '100%' }}
            shouldPlay={false}
            source={{ uri: reel?.media }}
            onPlaybackStatusUpdate={status => setVideoStatus(() => status)}
          />
        }
      </TouchableOpacity>

      <View style={reels.contolesView}>
        <UserAvatar user={reel?.user?.id} />

        <View style={reels.contoles}>
          <LikeReels reel={reel} />

          <TouchableOpacity
            onPress={() => {
              profile ? dispatch(setReelsProps(reel)) : null
              profile ? navigation.navigate('ReelsComment', { item: reel }) : disabled()
            }}
            style={reels.commentButton}
          >
            <FontAwesome name='comment' size={24} color={color.white} />
            <OymoFont message={reel?.commentsCount ? reel?.commentsCount : '0'} fontStyle={reels.commentButtonText} />
          </TouchableOpacity>
        </View>
      </View>

      <LinearGradient colors={['transparent', color.lightText]} style={reels.gradietContainer}>
        <View style={reels.userInfoView}>
          <UserInfo user={reel?.user?.id} />
          <OymoFont message={reel?.description} fontStyle={reels.reelsInfoText} fontFamily='montserrat_light' />
        </View>
      </LinearGradient>
    </ImageBackground>
  )
}

export default ViewReel