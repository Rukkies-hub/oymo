import React, { useState, useEffect } from 'react'
import { View, Text, Image, Pressable, TouchableOpacity, UIManager, LayoutAnimation, Platform } from 'react-native'
import { AntDesign, Feather } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import { Audio, Video } from 'expo-av'
import { useNavigation } from '@react-navigation/native'
import Avatar from './components/Avatar'
import { useSelector } from 'react-redux'
import { rm } from '../../../../style/messag'
import color from '../../../../style/color'
import OymoFont from '../../../../components/OymoFont'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) UIManager.setLayoutAnimationEnabledExperimental(true)

const RecieverMessage = ({ messages, matchDetails }) => {
  const { user, profile } = useSelector(state => state.user)

  const navigation = useNavigation()

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
        if (data?.durationMillis) {
          SetValue((data?.positionMillis / data?.durationMillis) * 100)
        }
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
      style={{
        flexDirection: 'row',
        marginBottom: 10
      }}
    >
      <Avatar user={messages?.userId} />
      <View style={rm.messagView}>
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
                    style={[rm.replyView, {
                      backgroundColor: messages?.message ? color.offWhite : color.transparent,
                      padding: messages?.reply ? 5 : 10,
                    }]}
                  >
                    <TouchableOpacity
                      onPress={() => console.log('reply: ', messages?.reply)}
                      activeOpacity={0.7}
                      style={[rm.messageReplyMediaTouchableOpacity, { backgroundColor: messages?.message ? color.white : color.transparent, }]}
                    >
                      {
                        messages?.reply?.mediaType == 'video' &&
                        <Video source={{ uri: messages?.reply?.media }} resizeMode='cover' style={rm.messageReplyMedia} />
                      }
                      {
                        messages?.reply?.mediaType == 'image' &&
                        <Image source={{ uri: messages?.reply?.media }} resizeMode='cover' style={rm.messageReplyMedia} />
                      }
                      {
                        messages?.reply?.voiceNote &&
                        <View style={{ flex: 1 }}>
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
                        <OymoFont message={messages?.reply?.caption} fontStyle={{ color: color.dark, marginLeft: messages?.reply?.media ? 10 : 0 }} />
                      }
                      {
                        messages?.reply?.message &&
                        <OymoFont message={messages?.reply?.message} fontStyle={{ color: color.dark, marginLeft: messages?.reply?.media ? 10 : 0 }} />
                      }
                    </TouchableOpacity>
                    <OymoFont message={messages?.message} fontStyle={rm.replyMessageText} />
                  </View> :
                  <View style={[rm.chatView, { backgroundColor: messages?.message ? color.offWhite : color.transparent }]}>
                    <OymoFont message={messages?.message} fontStyle={rm.replyMessageText} />
                  </View>
              }
              {
                messages?.timestamp &&
                <>
                  {
                    showTime &&
                    <OymoFont message={new Date(messages?.timestamp?.seconds * 1000 + messages?.timestamp?.nanoseconds / 1000000).toDateString()} fontStyle={rm.messageTimestamp} />
                  }
                </>
              }
            </View>
          }

          {
            messages?.mediaType == 'image' &&
            <View>
              <View style={rm.messageMediaView}>
                <Pressable
                  delayLongPress={500}
                  style={{ maxHeight: 250 }}
                  onLongPress={() => navigation.navigate('MessageOptions', { messages, matchDetails })}
                  onPress={() => messages?.mediaType == 'image' ? navigation.navigate('ViewAvatar', { avatar: messages?.media }) : null}
                >
                  <Image source={{ uri: messages?.media }} resizeMode='cover' style={rm.messageMediaImage} />
                </Pressable>
                {
                  messages?.caption != '' &&
                  <>
                    <View style={rm.messageMediaCaptionView}>
                        <OymoFont message={messages?.caption} lines={numberOfLines} fontStyle={rm.mediaCaption} fontFamily='montserrat_light' />
                    </View>
                  </>
                }
              </View>
              {
                messages?.timestamp &&
                <>
                  {
                    showTime &&
                    <OymoFont message={new Date(messages?.timestamp?.seconds * 1000 + messages?.timestamp?.nanoseconds / 1000000).toDateString()} fontStyle={rm.messageTimestamp} />
                  }
                </>
              }
            </View>
          }

          {
            messages?.mediaType == 'video' &&
            <View>
              <View style={rm.messageMediaView}>
                <Pressable
                  style={{ flex: 1 }}
                  delayLongPress={500}
                  onPress={() => messages?.mediaType == 'video' ? navigation.navigate('ViewVideo', { video: messages?.media }) : null}
                  onLongPress={() => navigation.navigate('MessageOptions', { messages, matchDetails })}
                >
                    {
                      messages?.thumbnail ?
                        <Image source={{ uri: messages?.thumbnail }} resizeMode='cover' style={rm.messageMediaImage} /> :
                        <ImageBackground
                          source={profile?.photoURL ? { uri: profile?.photoURL } : require('../../../../assets/background2.jpg')}
                          style={rm.thumbnailPlaceholdr}
                          blurRadius={200}
                        >
                          <View style={rm.playView}>
                            <Feather name='video' size={24} color={color.white} />
                          </View>
                        </ImageBackground>
                    }
                </Pressable>
                {
                  messages?.caption != '' &&
                  <>
                    <View style={rm.messageMediaCaptionView}>
                      <OymoFont message={messages?.caption} fontStyle={rm.mediaCaption} fontFamily='montserrat_light' />
                    </View>
                  </>
                }
              </View>
              {
                messages?.timestamp &&
                <>
                  {
                    showTime &&
                    <OymoFont message={new Date(messages?.timestamp?.seconds * 1000 + messages?.timestamp?.nanoseconds / 1000000).toDateString()} fontStyle={rm.messageTimestamp} />
                  }
                </>
              }
            </View>
          }

          {
            messages?.voiceNote &&
            <View>
              <View style={rm.messageMediaViewVoicenote}>
                <TouchableOpacity
                  onPress={() => !isPlaying ? playVoicenote(messages?.voiceNote) : pauseVoicenote(messages?.voiceNote)}
                  style={rm.playMessagVoicenoteButton}
                >
                  {
                    !isPlaying ?
                      <AntDesign name='caretright' size={20} color={color.white} /> :
                      <AntDesign name='pause' size={20} color={color.white} />
                  }
                </TouchableOpacity>
                <Slider
                  style={{ width: 150 }}
                  value={Value}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor={color.blue}
                  maximumTrackTintColor={color.blue}
                  thumbTintColor={color.blue}
                />
              </View>
              {
                messages?.timestamp &&
                <>
                  {
                    showTime &&
                    <OymoFont message={new Date(messages?.timestamp?.seconds * 1000 + messages?.timestamp?.nanoseconds / 1000000).toDateString()} fontStyle={rm.messageTimestamp} />
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

export default RecieverMessage