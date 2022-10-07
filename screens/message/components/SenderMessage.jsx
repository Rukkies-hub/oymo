import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Pressable, Image, TouchableOpacity, UIManager, LayoutAnimation, Platform, ImageBackground } from 'react-native'

import { AntDesign, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'

import Slider from '@react-native-community/slider'

import { Audio, Video } from 'expo-av'
import { useNavigation } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { useSelector } from 'react-redux'
import { sm } from '../../../style/messag'
import color from '../../../style/color'
import OymoFont from '../../../components/OymoFont'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) UIManager.setLayoutAnimationEnabledExperimental(true)

const SenderMessage = ({ messages, matchDetails }) => {
  const { user, profile, theme } = useSelector(state => state.user)

  const navigation = useNavigation()
  const video = useRef(null)

  const [sound, setSound] = useState()
  const [status, setStatus] = useState()
  const [Value, SetValue] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [numberOfLines, setNumberOfLines] = useState(10)

  const playVoicenote = async voiceNote => {
    const { sound, status } = await Audio?.Sound?.createAsync({ uri: voiceNote })
    setSound(sound)
    setStatus(status)
    setIsPlaying(true)
    sound?.setOnPlaybackStatusUpdate(UpdateStatus)
    await sound?.playAsync()
  }

  const pauseVoicenote = async voiceNote => {
    sound?.pauseAsync()
    setIsPlaying(false)
  }

  const UpdateStatus = async data => {
    try {
      if (data?.didJustFinish) {
        SetValue(0)
        setIsPlaying(false)
      } else if (data?.positionMillis) {
        if (data?.durationMillis)
          SetValue((data?.positionMillis / data?.durationMillis) * 100)
      }
    } catch (error) {
      console.log('Error')
    }
  }

  useEffect(() => {
    return sound ? () => sound?.unloadAsync() : undefined
  }, [sound])

  return (
    <Pressable
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
        setShowTime(!showTime)
        setNumberOfLines(numberOfLines == 10 ? 1000 : 10)
      }}
      delayLongPress={500}
      onLongPress={() => navigation.navigate('MessageOptions', { messages, matchDetails })}
      style={sm.container}
    >
      <Ionicons
        size={16}
        name={messages?.seen ? 'checkmark-done-circle' : 'checkmark-done-circle-outline'}
        color={!messages?.seen ? (theme ? color.white: color.lightText) : color.blue}
      />

      <View style={sm.messagView}>
        <Pressable
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            setShowTime(!showTime)
            setNumberOfLines(numberOfLines == 10 ? 1000 : 10)
          }}
          delayLongPress={500}
          onLongPress={() => navigation.navigate('MessageOptions', { messages, matchDetails })}
        >
          {
            messages?.message &&
            <View>
              {
                messages?.reply ?
                  <View
                    style={[sm.replyView, {
                      backgroundColor: messages?.message ? color.blue : color.transparent,
                      padding: messages?.reply ? 5 : 10
                    }]}
                  >
                    <TouchableOpacity
                      onPress={() => console.log('reply: ', messages?.reply)}
                      activeOpacity={0.7}
                      style={sm.messageReplyMediaTouchableOpacity}
                    >
                      {
                        messages?.reply?.mediaType == 'video' &&
                        <Video source={{ uri: messages?.reply?.media }} resizeMode='cover' style={sm.messageReplyMedia} />
                      }
                      {
                        messages?.reply?.mediaType == 'image' &&
                        <Image source={{ uri: messages?.reply?.media }} resizeMode='cover' style={sm.messageReplyMedia} />
                      }
                      {
                        messages?.reply?.voiceNote &&
                        <View style={sm.messageReplyVoicenoteView}>
                          <Slider
                            value={0}
                            disabled={true}
                            minimumValue={0}
                            maximumValue={100}
                            style={{ flex: 1 }}
                            minimumTrackTintColor={color.blue}
                            maximumTrackTintColor={color.blue}
                            thumbTintColor={color.blue}
                          />
                        </View>
                      }
                      {
                        messages?.reply?.caption != '' &&
                        <OymoFont
                          message={messages?.reply?.caption}
                          lines={3}
                          fontStyle={{
                            color: color.white,
                            marginLeft: messages?.reply?.media ? 10 : 0
                          }}
                        />
                      }
                      {
                        messages?.reply?.message &&
                        <OymoFont
                          message={messages?.reply?.message}
                          lines={3}
                          fontStyle={{
                            color: color.white,
                            marginLeft: messages?.reply?.media ? 10 : 0
                          }}
                        />
                      }
                    </TouchableOpacity>
                    <OymoFont
                      lines={numberOfLines}
                      message={messages?.message}
                      fontStyle={sm.replyMessageText}
                    />
                  </View> :
                  <View style={[sm.chatView, { backgroundColor: messages?.message ? color.blue : color.transparent }]}>
                    <OymoFont message={messages?.message} fontStyle={sm.messageText} />
                  </View>
              }

              {
                messages?.timestamp &&
                <>
                  {
                    showTime &&
                    <View style={sm.messageTimestampView}>
                      <OymoFont
                        message={new Date(messages?.timestamp?.seconds * 1000 + messages?.timestamp?.nanoseconds / 1000000).toDateString()}
                        fontStyle={sm.messageTimestamp}
                      />
                      {
                        messages?.seen ?
                          <OymoFont message='Seen' fontStyle={sm.messagSeenText} /> :
                          <OymoFont message='Sent' fontStyle={sm.messagSeenText} />
                      }
                    </View>
                  }
                </>
              }
            </View>
          }

          {
            messages?.mediaType == 'image' &&
            <View>
              <View style={sm.messageMediaView}>
                <Pressable
                  delayLongPress={500}
                  style={{ maxHeight: 250 }}
                  onPress={() => navigation.navigate('ViewAvatar', { avatar: messages?.media })}
                  onLongPress={() => navigation.navigate('MessageOptions', { messages, matchDetails })}
                >
                  <Image source={{ uri: messages?.media }} resizeMode='cover' style={sm.messageMediaImage} />
                </Pressable>

                {
                  messages?.caption != '' &&
                  <>
                    <View style={sm.messageMediaCaptionView}>
                      <OymoFont message={messages?.caption} fontStyle={sm.mediaCaption} fontFamily='montserrat_light' />
                    </View>
                  </>
                }
              </View>

              {
                messages?.timestamp &&
                <>
                  {
                    showTime &&
                    <View style={sm.messageTimestampView}>
                      <OymoFont
                        message={new Date(messages?.timestamp?.seconds * 1000 + messages?.timestamp?.nanoseconds / 1000000).toDateString()}
                        fontStyle={sm.messageTimestamp}
                      />
                      {
                        messages?.seen ?
                          <OymoFont message='Seen' fontStyle={sm.messagSeenText} /> :
                          <OymoFont message='Sent' fontStyle={sm.messagSeenText} />
                      }
                    </View>
                  }
                </>
              }
            </View>
          }

          {
            messages?.mediaType == 'video' &&
            <View>
              <View style={sm.messageMediaView}>
                <Pressable
                  style={{ flex: 1 }}
                  delayLongPress={500}
                  onPress={() => navigation.navigate('ViewVideo', {
                    video: messages?.media,
                    thumbnail: messages?.thumbnail
                  })}
                  onLongPress={() => navigation.navigate('MessageOptions', { messages, matchDetails })}
                >
                  {
                    messages?.thumbnail ?
                      <Image source={{ uri: messages?.thumbnail }} resizeMode='cover' style={sm.messageMediaImage} /> :
                      <ImageBackground
                        source={profile?.photoURL ? { uri: profile?.photoURL } : require('../../../assets/background2.jpg')}
                        style={sm.thumbnailPlaceholdr}
                        blurRadius={200}
                      >
                        <View style={sm.playView}>
                          <Feather name='video' size={24} color={color.white} />
                        </View>
                      </ImageBackground>
                  }
                </Pressable>
                {
                  messages?.caption != '' &&
                  <>
                    <View style={sm.messageMediaCaptionView}>
                      <OymoFont message={messages?.caption} fontStyle={sm.mediaCaption} fontFamily='montserrat_light' />
                    </View>
                  </>
                }
              </View>
              {
                messages?.timestamp &&
                <>
                  {
                    showTime &&
                    <View style={sm.messageTimestampView}>
                      <OymoFont
                        message={new Date(messages?.timestamp?.seconds * 1000 + messages?.timestamp?.nanoseconds / 1000000).toDateString()}
                        fontStyle={sm.messageTimestamp}
                      />
                      {
                        messages?.seen ?
                          <OymoFont message='Seen' fontStyle={sm.messagSeenText} /> :
                          <OymoFont message='Sent' fontStyle={sm.messagSeenText} />
                      }
                    </View>
                  }
                </>
              }
            </View>
          }

          {
            messages?.voiceNote &&
            <View>
              <View style={sm.messageMediaViewVoicenote}>
                <Slider
                  style={{ width: 150 }}
                  value={Value}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor={color.white}
                  maximumTrackTintColor={color.offWhite}
                  thumbTintColor={color.offWhite}
                />
                <TouchableOpacity
                  onPress={() => !isPlaying ? playVoicenote(messages?.voiceNote) : pauseVoicenote(messages?.voiceNote)}
                  style={sm.playMessagVoicenoteButton}
                >
                  {
                    !isPlaying ?
                      <AntDesign name='caretright' size={20} color={color.blue} /> :
                      <AntDesign name='pause' size={20} color={color.blue} />
                  }
                </TouchableOpacity>
              </View>

              {
                messages?.timestamp &&
                <>
                  {
                    showTime &&
                    <View style={sm.messageTimestampView}>
                      <OymoFont
                        message={new Date(messages?.timestamp?.seconds * 1000 + messages?.timestamp?.nanoseconds / 1000000).toDateString()}
                        fontStyle={sm.messageTimestamp}
                      />
                      {
                        messages?.seen ?
                          <OymoFont message='Seen' fontStyle={sm.messagSeenText} /> :
                          <OymoFont message='Sent' fontStyle={sm.messagSeenText} />
                      }
                    </View>
                  }
                </>
              }
            </View>
          }
        </Pressable>
      </View>
    </Pressable>
  )
}

export default SenderMessage