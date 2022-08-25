import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, ImageBackground } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { addDoc, collection, doc, getDoc, increment, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import color from '../../style/color'
import Bar from '../../components/Bar'

import { FontAwesome5, Entypo } from '@expo/vector-icons'

import { appToken, notificationUri } from '@env'
import axios from 'axios'
import { BlurView } from 'expo-blur'
import { useDispatch, useSelector } from 'react-redux'
import { setReelsCommentType, setReply, setShowExpand } from '../../features/reelsSlice'
import { ci, vrc } from '../../style/reelsComment'
import OymoFont from '../../components/OymoFont'
import UserAvatar from './components/UserAvatar'
import Reply from './components/Reply'
import ViewReelsCommentsLikecomments from '../../components/reelsComponents/ViewReelsCommentsLikecomments'
import PostCommentReply from '../../components/reelsComponents/PostCommentReply'
import ViewReelsCommentReplies from '../../components/reelsComponents/viewReelsCommentReplies/ViewReelsCommentReplies'
import Input from './components/Input'
import { Audio } from 'expo-av'

const ViewReelsComments = () => {
  const { user, profile } = useSelector(state => state.user)
  const { reelsCommentType, reply } = useSelector(state => state.reels)
  const dispatch = useDispatch()

  const navigation = useNavigation()
  const { comment, background } = useRoute().params

  const [_comment, _setComment] = useState('')
  const [commentsCount, setCommentsCount] = useState('')
  const [sound, setSound] = React.useState()

  navigation.addListener('blur', () => {
    dispatch(setShowExpand(true))
  })

  useLayoutEffect(() => {
    dispatch(setShowExpand(false))
  }, [])

  useLayoutEffect(() => {
    dispatch(setReelsCommentType('reply'))
  }, [])

  useLayoutEffect(() => {
    (() => {
      onSnapshot(doc(db, 'reels', comment?.reel?.id),
        doc => {
          setCommentsCount(doc?.data().commentsCount)
        })
    })()
  }, [user, db])

  const playSound = async () => {
    console.log('Loading Sound')
    const { sound } = await Audio.Sound.createAsync(require('../../assets/sent.mp3'))
    setSound(sound)
    console.log('Playing Sound')
    await sound.playAsync()
  }

  useEffect(() => {
    return sound
      ? () => {
        console.log('Unloading Sound')
        sound.unloadAsync()
      } : undefined
  }, [sound])

  const sendCommentReply = async () => {
    if (reply == '') return
    await addDoc(collection(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'replies'), {
      reply,
      reel: comment?.reel,
      comment: comment?.id,
      reelComment: comment,
      likesCount: 0,
      repliesCount: 0,
      user: { id: user?.uid },
      timestamp: serverTimestamp()
    })
    dispatch(setReply(''))
    dispatch(setReelsCommentType('reply'))
    playSound()

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
      })

      await axios.post(notificationUri, {
        subID: comment?.reel?.user?.id,
        appId: 3167,
        appToken,
        title: 'Oymo',
        message: `@${profile?.username} replied to your comment (${_comment.slice(0, 100)})`
      })
    }

    await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id), {
      repliesCount: increment(1)
    })

    await updateDoc(doc(db, 'reels', comment?.reel?.id), {
      commentsCount: increment(1)
    })
  }

  const sendCommentReplyReply = async () => {
    if (reply == '') return

    await addDoc(collection(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'replies'), {
      reply,
      reel: comment?.reel,
      comment: comment?.id,
      reelComment: comment,
      likesCount: 0,
      repliesCount: 0,
      user: { id: user?.uid },
      timestamp: serverTimestamp()
    })
    dispatch(setReply(''))
    dispatch(setReelsCommentType('reply'))
    playSound()

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
      })

      await axios.post(notificationUri, {
        subID: comment?.reel?.user?.id,
        appId: 3167,
        appToken,
        title: 'Oymo',
        message: `@${profile?.username} replied to your comment (${_comment.slice(0, 100)})`
      })
    }

    await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id), {
      repliesCount: increment(1)
    })

    await updateDoc(doc(db, 'reels', comment?.reel?.id), {
      commentsCount: increment(1)
    })
  }

  return (
    <ImageBackground source={{ uri: background }} blurRadius={10} style={{ flex: 1 }}>
      <BlurView tint='dark' intensity={100} style={{ flex: 1 }}>
        <Bar color='light' />

        <View style={vrc.headView}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={vrc.backButton}>
            <Entypo name='chevron-left' size={24} color={color.white} />
          </TouchableOpacity>

          <View style={vrc.commentsCountView}>
            <OymoFont message={commentsCount || '0'} fontStyle={vrc.commentsCount} />
            <OymoFont message={commentsCount == 1 ? 'Comment' : 'Comments'} fontStyle={vrc.commentsCountText} />
          </View>
        </View>

        <ScrollView style={{ flex: 1 }}>
          <View style={vrc.scrollViewMainView}>
            <UserAvatar _user={comment?.user?.id} />

            <View style={vrc.commentContainer}>
              <Reply _user={comment?.user?.id} comment={comment?.comment} />

              <View style={vrc.commentControlerView}>
                <View style={vrc.commentControlerContainer}>
                  <ViewReelsCommentsLikecomments comment={comment} />
                  <PostCommentReply comment={comment} />
                </View>

                <ViewReelsCommentReplies showAll={true} comment={comment} />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={ci.emojiView}>
          <TouchableOpacity onPress={() => reelsCommentType == 'reply' ? dispatch(setReply(reply + '🤣')) : dispatch(setReply(reply + '🤣'))}>
            <Text style={{ fontSize: 30 }}>🤣</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reelsCommentType == 'reply' ? dispatch(setReply(reply + '😭')) : dispatch(setReply(reply + '😭'))}>
            <Text style={{ fontSize: 30 }}>😭</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reelsCommentType == 'reply' ? dispatch(setReply(reply + '🥺')) : dispatch(setReply(reply + '🥺'))}>
            <Text style={{ fontSize: 30 }}>🥺</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reelsCommentType == 'reply' ? dispatch(setReply(reply + '😏')) : dispatch(setReply(reply + '😏'))}>
            <Text style={{ fontSize: 30 }}>😏</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reelsCommentType == 'reply' ? dispatch(setReply(reply + '🤨')) : dispatch(setReply(reply + '🤨'))}>
            <Text style={{ fontSize: 30 }}>🤨</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reelsCommentType == 'reply' ? dispatch(setReply(reply + '🙄')) : dispatch(setReply(reply + '🙄'))}>
            <Text style={{ fontSize: 30 }}>🙄</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reelsCommentType == 'reply' ? dispatch(setReply(reply + '😍')) : dispatch(setReply(reply + '😍'))}>
            <Text style={{ fontSize: 30 }}>😍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => reelsCommentType == 'reply' ? dispatch(setReply(reply + '❤️')) : dispatch(setReply(reply + '❤️'))}>
            <Text style={{ fontSize: 30 }}>❤️</Text>
          </TouchableOpacity>
        </View>

        <View style={ci.inputView}>
          <Input user={comment?.user?.id} />

          <TouchableOpacity
            onPress={() => reelsCommentType == 'reply' ? sendCommentReply() : sendCommentReplyReply()}
            style={ci.sendButton}
          >
            <FontAwesome5 name='paper-plane' color={color.lightText} size={20} />
          </TouchableOpacity>
        </View>
      </BlurView>
    </ImageBackground>
  )
}

export default ViewReelsComments