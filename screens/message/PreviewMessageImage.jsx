import React, { useEffect, useRef, useState } from 'react'

import {
  View,
  SafeAreaView,
  Pressable,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native'

import Header from '../../components/Header'

const { width } = Dimensions.get('window')

import AutoHeightImage from 'react-native-auto-height-image'

import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

import { Video } from 'expo-av'

import uuid from 'uuid-random'

import Bar from '../../components/Bar'
import { useSelector } from 'react-redux'
import { pm } from '../../style/previewMessageImage'
import color from '../../style/color'

const PreviewMessageImage = () => {
  const { profile, user } = useSelector(state => state.user)
  const { matchDetails, media } = useRoute().params
  const navigation = useNavigation()
  const video = useRef(null)

  const storage = getStorage()

  const [input, setInput] = useState('')
  const [height, setHeight] = useState(50)
  const [sendLoading, setSendLoading] = useState(false)
  const [status, setStatus] = useState({})
  const [disableButton, setDisableButton] = useState(false)

  useEffect(() => {
    (() => {
      Keyboard.addListener('keyboardDidHide', () => Keyboard.dismiss)
    })()
  }, [])

  const sendMessage = async () => {
    if (media?.type == 'image') {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', media?.uri, true)
        xhr.send(null)
      })

      setDisableButton(true)
      setSendLoading(true)

      const mediaRef = ref(storage, `messages/${matchDetails?.id}/image/${uuid()}`)

      uploadBytes(mediaRef, blob)
        .then(snapshot => {
          getDownloadURL(snapshot?.ref)
            .then(downloadURL => {
              addDoc(collection(db, 'matches', matchDetails?.id, 'messages'), {
                userId: user?.uid,
                username: profile?.username,
                photoURL: matchDetails?.users[user?.uid].photoURL,
                mediaLink: snapshot?.ref?._location?.path,
                mediaType: media?.type,
                media: downloadURL,
                caption: input,
                seen: false,
                timestamp: serverTimestamp(),
              }).then(async () => {
                await updateDoc(doc(db, 'matches', matchDetails?.id), {
                  timestamp: serverTimestamp()
                })
              }).finally(() => {
                setSendLoading(false)
                setDisableButton(false)
                setInput('')
                navigation.navigate('Message', { matchDetails })
              })
            })
        })
    }


    if (media?.type == 'video' && media?.thumbnail) {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', media?.uri, true)
        xhr.send(null)
      })

      const thumbnailBlob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', media?.thumbnail, true)
        xhr.send(null)
      })

      setDisableButton(true)
      setSendLoading(true)

      const mediaRef = ref(storage, `messages/${matchDetails?.id}/'video'/${uuid()}`)
      const thumbnailRef = ref(storage, `messages/${matchDetails?.id}/${'thumbnail'}/${uuid()}`)

      uploadBytes(mediaRef, blob)
        .then(snapshot => {
          getDownloadURL(snapshot?.ref)
            .then(downloadURL => {
              uploadBytes(thumbnailRef, thumbnailBlob)
                .then(thumbnailSnapshot => {
                  getDownloadURL(thumbnailSnapshot?.ref)
                    .then(thumbnailDownloadURL => {
                      addDoc(collection(db, 'matches', matchDetails?.id, 'messages'), {
                        userId: user?.uid,
                        username: profile?.username,
                        photoURL: matchDetails?.users[user?.uid].photoURL,
                        mediaLink: snapshot?.ref?._location?.path,
                        mediaType: media?.type,
                        media: downloadURL,
                        thumbnail: thumbnailDownloadURL,
                        caption: input,
                        duration: media?.duration,
                        mediaSize: {
                          width: media?.width,
                          height: media?.height
                        },
                        seen: false,
                        timestamp: serverTimestamp(),
                      }).then(async () => {
                        await updateDoc(doc(db, 'matches', matchDetails?.id), {
                          timestamp: serverTimestamp()
                        })
                      }).finally(() => {
                        setSendLoading(false)
                        setDisableButton(false)
                        setInput('')
                        navigation.navigate('Message', { matchDetails })
                      })
                    })
                })
            })
        })
    } else if (media?.type == 'video' && !media?.thumbnail) {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', media?.uri, true)
        xhr.send(null)
      })

      setDisableButton(true)
      setSendLoading(true)

      const mediaRef = ref(storage, `messages/${matchDetails?.id}/'video'/${uuid()}`)

      uploadBytes(mediaRef, blob)
        .then(snapshot => { 
          getDownloadURL(snapshot?.ref)
            .then(downloadURL => {
              addDoc(collection(db, 'matches', matchDetails?.id, 'messages'), {
                userId: user?.uid,
                username: profile?.username,
                photoURL: matchDetails?.users[user?.uid].photoURL,
                mediaLink: snapshot?.ref?._location?.path,
                mediaType: media?.type,
                media: downloadURL,
                thumbnail: null,
                caption: input,
                duration: media?.duration,
                mediaSize: {
                  width: media?.width,
                  height: media?.height
                },
                seen: false,
                timestamp: serverTimestamp(),
              }).then(async () => {
                await updateDoc(doc(db, 'matches', matchDetails?.id), {
                  timestamp: serverTimestamp()
                })
              }).finally(() => {
                setSendLoading(false)
                setDisableButton(false)
                setInput('')
                navigation.navigate('Message', { matchDetails })
              })
            })
        })
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <SafeAreaView style={pm.safeView}>
        <Bar color='dark' />
        <Header showBack showTitle title={`Preview ${media?.type}`} />

        {
          media?.type == 'image' &&
          <AutoHeightImage
            source={{ uri: media?.uri }}
            width={width}
            style={{ flex: 1 }}
            resizeMode='contain'
          />
        }

        {
          media?.type == 'video' &&
          <Pressable
            onPress={() => status?.isPlaying ? video?.current?.pauseAsync() : video?.current?.playAsync()}
            style={{ flex: 1 }}
          >
            <Video
              ref={video}
              source={{ uri: media?.uri }}
              style={{ flex: 1 }}
                resizeMode='contain'
              isLooping={true}
              onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
          </Pressable>
        }

        <View style={pm.inputView}>
          <TextInput
            multiline
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
            placeholder='Aa..'
            placeholderTextColor={color.lightText}
            style={[pm.input, { height }]}
          />

          <TouchableOpacity onPress={sendMessage} disabled={disableButton} style={pm.sendButton}>
            {
              sendLoading ?
                <ActivityIndicator color={color.lightText} size='small' /> :
                <FontAwesome5 name='paper-plane' color={color.lightText} size={20} />
            }
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default PreviewMessageImage