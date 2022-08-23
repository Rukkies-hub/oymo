import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native'

import Bar from '../components/Bar'

import color from '../style/color'
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native'

import { FontAwesome5, Entypo } from '@expo/vector-icons'

import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../hooks/firebase'

import { useFonts } from 'expo-font'

import { appToken } from '@env'
import axios from 'axios'

import { BlurView } from 'expo-blur'
import { useDispatch, useSelector } from 'react-redux'
import { setReelsCommentType } from '../features/reelsSlice'
import { rc } from '../style/reelsComment'
import OymoFont from '../components/OymoFont'
import ReelsComments from '../components/reelsComponents/ReelsComments'

const ReelsComment = () => {
  const { user, profile } = useSelector(state => state.user)
  const { reelsCommentType, replyCommentProps } = useSelector(state => state.reels)
  const dispatch = useDispatch()

  const navigation = useNavigation()
  const { item } = useRoute().params

  const [comment, setComment] = useState('')
  const [reply, setReply] = useState('')
  const [height, setHeight] = useState(40)

  Keyboard.addListener('keyboardDidHide', () => dispatch(setReelsCommentType('comment')))

  const sendComment = async () => {
    if (comment != '') {
      addDoc(collection(db, 'reels', item?.id, 'comments'), {
        comment,
        reel: item,
        commentsCount: 0,
        likesCount: 0,
        user: { id: user?.uid },
        timestamp: serverTimestamp()
      })

      await updateDoc(doc(db, 'reels', item?.id), {
        commentsCount: increment(1)
      })

      if (item?.user?.id != user?.uid) {
        await addDoc(collection(db, 'users', item?.user?.id, 'notifications'), {
          action: 'reel',
          activity: 'comments',
          text: 'commented on your post',
          notify: item?.user,
          id: item?.id,
          seen: false,
          reel: item,
          user: { id: user?.uid },
          timestamp: serverTimestamp()
        }).then(() => {
          axios.post(`https://app.nativenotify.com/api/indie/notification`, {
            subID: item?.user?.id,
            appId: 3167,
            appToken,
            title: 'Oymo',
            message: `@${profile?.username} commented on your video \n ${comment.slice(0, 100)}`
          })
        })
      }

      setComment('')
      setHeight(40)
    }
  }

  const sendCommentReply = async () => {
    let comment = replyCommentProps
    if (reply != '')
      await addDoc(collection(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'replies'), {
        reply,
        reel: comment?.reel,
        comment: comment?.id,
        reelComment: comment,
        likesCount: 0,
        repliesCount: 0,
        user: { id: user?.uid },
        timestamp: serverTimestamp()
      }).then(async () => {
        if (comment?.reel?.user?.id != user?.uid) {
          await addDoc(collection(db, 'users', comment?.reel?.user?.id, 'notifications'), {
            action: 'reel',
            activity: 'reply',
            text: 'replied to a post you commented on',
            notify: comment?.reel?.user,
            id: comment?.reel?.id,
            seen: false,
            reel: comment?.reel,
            user: { id: user?.uid },
            timestamp: serverTimestamp()
          }).then(() => {
            axios.post(`https://app.nativenotify.com/api/indie/notification`, {
              subID: item?.user?.id,
              appId: 3167,
              appToken,
              title: 'Oymo',
              message: `@${profile?.username} replied to your comment \n ${comment.slice(0, 100)}`
            })
          })
        }
      })

    setReply('')
    setHeight(40)

    await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id), {
      repliesCount: increment(1)
    })

    await updateDoc(doc(db, 'reels', item?.id), {
      commentsCount: increment(1)
    })

    if (comment?.user?.id != user?.uid)
      await addDoc(collection(db, 'users', comment?.user?.id, 'notifications'), {
        action: 'reel',
        activity: 'comment likes',
        text: 'likes your comment',
        notify: comment?.user,
        id: comment?.reel?.id,
        seen: false,
        reel: comment?.reel,
        user: { id: user?.uid },
        timestamp: serverTimestamp()
      }).then(() => {
        axios.post(`https://app.nativenotify.com/api/indie/notification`, {
          subID: item?.user?.id,
          appId: 3167,
          appToken,
          title: 'Oymo',
          message: `@${profile?.username} replied to your comment \n ${comment.slice(0, 100)}`
        })
      })

    dispatch(setReelsCommentType('comment'))
  }

  const sendCommentReplyReply = async () => {
    let comment = replyCommentProps

    if (reply != '')
      await addDoc(collection(db, 'reels', comment?.reel?.id, 'comments', comment?.comment, 'replies', comment?.id, 'reply'), {
        reply,
        reel: comment?.reel,
        comment: comment?.comment,
        reelReply: comment,
        likesCount: 0,
        repliesCount: 0,
        user: { id: user?.uid },
        timestamp: serverTimestamp()
      })

    setReply('')
    setHeight(40)

    dispatch(setReelsCommentType('comment'))

    await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.comment, 'replies', comment?.id), {
      repliesCount: increment(1)
    })

    await updateDoc(doc(db, 'reels', item?.id), {
      commentsCount: increment(1)
    })
  }

  const [loaded] = useFonts({
    text: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf')
  })

  if (!loaded) return null

  return (
    <KeyboardAvoidingView style={rc.container}>
      <Bar color='light' />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground source={{ uri: item?.thumbnail }} blurRadius={10} style={{ flex: 1 }}>
          <BlurView tint='dark' intensity={100} style={{ flex: 1 }}>
            <View style={rc.headerView}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={rc.goBackButton}>
                <Entypo name='chevron-left' size={24} color={color.white} />
              </TouchableOpacity>

              <View style={rc.headerInfoView}>
                <OymoFont message={item?.commentsCount || '0'} fontStyle={rc.headerCommentsCount} />
                <OymoFont message={item?.commentsCount == 1 ? 'Comment' : 'Comments'} fontStyle={rc.headerCommentsCountText} />
              </View>
            </View>

            <ReelsComments reel={item} background={item?.thumbnail} />
          </BlurView>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default ReelsComment