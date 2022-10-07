import {
  View,
  Keyboard,
  TextInput,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Image,
  ImageBackground,
  Dimensions
} from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { iv, msg } from '../../style/messag'
import MessageHeader from './components/MessageHeader'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import getMatchedUserInfo from '../../lib/getMatchedUserInfo'
import { BlurView } from 'expo-blur'
import { addDoc, collection, doc, getDocs, increment, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) UIManager.setLayoutAnimationEnabledExperimental(true)

import { Audio } from 'expo-av'

import uuid from 'uuid-random'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker'

import * as VideoThumbnails from 'expo-video-thumbnails'
import Slider from '@react-native-community/slider'
import { setMessageReply } from '../../features/messageSlice'
import Avatar from './components/Avatar'
import OymoFont from '../../components/OymoFont'

import SenderMessage from './components/SenderMessage'
import RecieverMessage from './components/recieverMessage/RecieverMessage'
import color from '../../style/color'
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'

import { admin } from '@env'
import * as NavigationBar from 'expo-navigation-bar'

const Message = () => {
  const { matchDetails } = useRoute().params
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const focused = useIsFocused()

  const { user, profile, theme } = useSelector(state => state.user)
  const { messageReply } = useSelector(state => state.message)

  const storage = getStorage()

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [height, setHeight] = useState(50)
  const [mediaVidiblity, setMediaVidiblity] = useState(true)
  const [showRecording, setShowRecording] = useState(false)
  const [showSend, setShowSend] = useState(false)
  const [recording, setRecording] = useState()
  const [recordings, setRecordings] = useState([])
  const [recordingLoading, setRecordingLoading] = useState(false)
  const [showMedia, setShowMedia] = useState(false)
  const [showRecord, setShowRecord] = useState(true)

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid


  if (focused) {
    NavigationBar.setBackgroundColorAsync(theme ? color.dark : color.white)
    NavigationBar.setButtonStyleAsync(theme ? 'light' : 'dark')
  }

  useLayoutEffect(() =>
    (() => {
      onSnapshot(query(collection(db, 'matches', matchDetails?.id, 'messages'), orderBy('timestamp', 'desc')),
        snapshot => setMessages(snapshot?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        })))
      )
    })()
    , [matchDetails, db])

  useEffect(() => {
    (() => {
      Keyboard.addListener('keyboardDidShow', () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setMediaVidiblity(false)
        setShowMedia(false)
      })
    })()
  }, [Keyboard])

  useEffect(() => {
    (() => {
      Keyboard.addListener('keyboardDidHide', () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setMediaVidiblity(true)
        setShowMedia(false)
      })
    })()
  }, [Keyboard])

  useEffect(() => {
    if (input.length >= 1) {
      setShowSend(true)
      setShowRecord(false)
    }
    else {
      setShowSend(false)
      setShowRecord(true)
    }
  }, [input])

  const updateSeen = async () => {
    const snapshot = await getDocs(query(collection(db, 'matches', matchDetails?.id, 'messages'),
      where('userId', '!=', id),
      where('seen', '==', false)
    ))
    snapshot.forEach(async allDoc => {
      await updateDoc(doc(db, 'matches', matchDetails?.id, 'messages', allDoc?.id), {
        seen: true
      })
    })
  }

  useEffect(() => {
    updateSeen()
  }, [input])

  const sendMessage = async () => {
    if (profile?.coins < 1) return

    if (input != '') {
      await addDoc(collection(db, 'matches', matchDetails?.id, 'messages'), {
        timestamp: serverTimestamp(),
        userId: id,
        username: profile?.username,
        photoURL: matchDetails?.users[id]?.photoURL,
        message: input,
        reply: messageReply ? messageReply : null,
        seen: false
      })
      setInput('')
      dispatch(setMessageReply(null))
      updateSeen()
      await updateDoc(doc(db, 'matches', matchDetails?.id), {
        timestamp: serverTimestamp()
      })
      await updateDoc(doc(db, 'users', id), { coins: increment(-1) })
      await updateDoc(doc(db, 'admin', admin), { messages: increment(1) })
    }
  }

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync()

      if (status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        })

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        )

        setRecording(recording)
      } else console.log('Please grant permission to app microphone')
    } catch (error) {
      console.log('Failed to start recording: ', error)
    }
  }

  const stopRecording = async () => {
    setRecording(undefined)
    await recording.stopAndUnloadAsync()

    let updateRecordings = [...recordings]
    const { sound, status } = await recording.createNewLoadedSoundAsync()
    updateRecordings = []
    updateRecordings.push({
      sound,
      duration: getDurationFormated(status?.durationMillis),
      file: recording.getURI()
    })

    setRecordings(updateRecordings)

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = () => resolve(xhr.response)

      xhr.responseType = 'blob'
      xhr.open('GET', recording.getURI(), true)
      xhr.send(null)
    })

    if (profile?.coins < 100) return

    const sourceRef = ref(storage, `messages/${id}/audio/${uuid()}`)

    setRecordingLoading(true)

    uploadBytes(sourceRef, blob)
      .then(snapshot => {
        getDownloadURL(snapshot?.ref)
          .then(async downloadURL => {
            await addDoc(collection(db, 'matches', matchDetails?.id, 'messages'), {
              userId: id,
              username: profile?.username,
              photoURL: matchDetails?.users[id]?.photoURL,
              voiceNote: downloadURL,
              mediaLink: snapshot?.ref?._location?.path,
              duration: getDurationFormated(status?.durationMillis),
              seen: false,
              timestamp: serverTimestamp(),
            })
            setRecordingLoading(false)
            await updateDoc(doc(db, 'users', id), { coins: increment(-100) })
            await updateDoc(doc(db, 'admin', admin), { messages: increment(1) })
          })
      })
  }

  const getDurationFormated = millis => {
    const minutes = millis / 1000 / 60
    const minutesDisplay = Math.floor(minutes)
    const seconds = Math.round((minutes - minutesDisplay) * 60)
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds
    return `${minutesDisplay}:${secondsDisplay}`
  }

  return (
    <View style={[msg.container, { backgroundColor: theme ? color.dark : color.white }]}>
      <MessageHeader matchDetails={matchDetails} user={getMatchedUserInfo(matchDetails?.users, id)} />

      <ImageBackground source={theme ? require('../../assets/chatBGDark.png') : require('../../assets/chatBG.png')} style={msg.messageBackground}>
        <BlurView intensity={110} tint={theme ? 'dark' : 'light'} style={msg.messageBackground}>
          <KeyboardAvoidingView style={{ flex: 1 }}>
            {
              !messages?.length ?
                <View style={msg.emptyMessageView}>
                  <View style={{ position: 'relative' }}>
                    <Avatar user={getMatchedUserInfo(matchDetails?.users, id)?.id} />
                    <View style={msg.emptyMessageViewAvatarMiniView}>
                      <Image source={{ uri: profile?.photoURL }} style={msg.emptyMessageViewAvatarMini} />
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <OymoFont message='You matched with' fontStyle={msg.emptyMessageViewText1} />
                    <OymoFont message={` ${getMatchedUserInfo(matchDetails?.users, id)?.username}`} fontFamily='montserrat_bold' fontStyle={msg.emptyMessageViewText1} />
                  </View>
                </View> :
                <FlatList
                  inverted={-1}
                  style={msg.messagesFlatlist}
                  data={messages}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => item?.id}
                  renderItem={({ item: message }) => (
                    message?.userId === id ?
                      <SenderMessage key={message?.id} messages={message} matchDetails={matchDetails} /> :
                      <RecieverMessage key={message?.id} messages={message} matchDetails={matchDetails} />
                  )}
                />
            }

            <View>
              {
                messageReply &&
                <TouchableOpacity activeOpacity={0.7} style={[msg.messageReply, { backgroundColor: theme ? color.dark : color.offWhite }]}>
                  <View style={[msg.messageReplyView, { backgroundColor: theme ? color.lightText : color.offWhite }]}>
                    {
                      messageReply?.mediaType == 'video' &&
                      <Image source={{ uri: messageReply?.thumbnail }} resizeMode='cover' style={msg.messageReplyImage} />
                    }
                    {
                      messageReply?.mediaType == 'image' &&
                      <Image source={{ uri: messageReply?.media }} resizeMode='cover' style={msg.messageReplyImage} />
                    }
                    {
                      messageReply?.voiceNote &&
                      <View style={msg.messageReplyVoicenote}>
                        <Slider
                          value={0}
                          minimumValue={0}
                          maximumValue={100}
                          style={{ flex: 1 }}
                          minimumTrackTintColor={color.blue}
                          maximumTrackTintColor={color.blue}
                          thumbTintColor={color.blue}
                        />
                        <TouchableOpacity activeOpacity={1} style={msg.messageReplyVoicenoteButton}>
                          <AntDesign name='caretright' size={20} color={color.blue} />
                        </TouchableOpacity>
                      </View>
                    }
                    {
                      messageReply?.caption != '' &&
                      <OymoFont
                        message={messageReply?.caption}
                        lines={3}
                        fontFamily='montserrat_light'
                        fontStyle={{
                          color: theme ? color.white : color.dark,
                          marginLeft: messageReply?.media ? 10 : 0
                        }}
                      />
                    }
                    {
                      messageReply?.message &&
                      <OymoFont
                        message={messageReply?.message}
                        lines={3}
                        fontFamily='montserrat_light'
                        fontStyle={{
                          color: theme ? color.white : color.dark,
                          marginLeft: messageReply?.media ? 10 : 0,
                          marginVertical: 10
                        }}
                      />
                    }
                  </View>
                  {
                    messageReply &&
                    <TouchableOpacity onPress={() => dispatch(setMessageReply(null))} style={msg.canselMessageReply}>
                      <AntDesign name='close' size={24} color={theme ? color.white : color.dark} />
                    </TouchableOpacity>
                  }
                </TouchableOpacity>
              }

              <View
                style={[
                  iv.inputView,
                  {
                    borderTopLeftRadius: messageReply ? 0 : 12,
                    borderTopRightRadius: messageReply ? 0 : 12,
                    backgroundColor: theme ? color.dark : color.offWhite
                  }]
                }
              >
                {
                  mediaVidiblity &&
                  <View style={iv.visibleMediaView}>
                    <TouchableOpacity
                      onPress={() => {
                        setMediaVidiblity(false)
                        setShowMedia(false)
                        Keyboard.dismiss
                        navigation.navigate('MessageCamera', { matchDetails })
                      }}
                      style={iv.mediaButton}
                    >
                      <MaterialCommunityIcons name='camera-outline' color={theme ? color.white : color.lightText} size={20} />
                    </TouchableOpacity>
                  </View>
                }

                {
                  showRecording ?
                    <View style={iv.recordingView}>
                      <OymoFont message='Recording...' fontStyle={{ ...iv.recordingText, color: theme ? color.white : color.dark }} />
                    </View> :
                    <TextInput
                      multiline
                      value={input}
                      onChangeText={setInput}
                      onSubmitEditing={sendMessage}
                      onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
                      placeholder='Aa..'
                      placeholderTextColor={theme ? color.white : color.lightText}
                      style={[iv.messageInput, { height, color: theme ? color.white : color.dark }]}
                    />
                }

                {
                  showSend &&
                  <TouchableOpacity onPress={sendMessage} style={iv.sendButton}>
                    <FontAwesome5 name='paper-plane' color={theme ? color.white : color.lightText} size={20} />
                  </TouchableOpacity>
                }

                {
                  showRecord &&
                  <TouchableOpacity
                    onLongPress={() => {
                      setShowRecording(true)
                      setShowSend(false)
                      startRecording()
                    }}
                    onPressOut={() => {
                      setShowRecording(false)
                      setShowSend(true)
                      stopRecording()
                    }}
                    style={iv.recordingButton}
                  >
                    {
                      recordingLoading ?
                        <ActivityIndicator size='small' color={theme ? color.white : color.lightText} /> :
                        <FontAwesome5 size={20} name='microphone-alt' color={theme ? color.white : color.lightText} />
                    }
                  </TouchableOpacity>
                }
              </View>
            </View>
          </KeyboardAvoidingView>
        </BlurView>
      </ImageBackground>
    </View>
  )
}

export default Message