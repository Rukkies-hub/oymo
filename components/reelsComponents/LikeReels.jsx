import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import color from '../../style/color'

import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, increment, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import axios from 'axios'

import { appToken } from '@env'
import { useSelector } from 'react-redux'
import { reels } from '../../style/reels'
import OymoFont from '../OymoFont'

const LikeReels = ({ reel, navigation }) => {
  const { user, profile } = useSelector(state => state.user)

  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: reel?.likesCount })
  const [disable, setDisable] = useState(false)

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  useEffect(() =>
    (() => {
      getLikesById(reel?.id, id)
        .then(res => {
          setCurrentLikesState({
            ...currentLikesState,
            state: res
          })
        })
    })()
    , [])

  const updateLike = () => new Promise(async (resolve, reject) => {
    if (profile?.coins < 20) return

    if (currentLikesState.state) {
      setDisable(true)
      await deleteDoc(doc(db, 'reels', reel?.id, 'likes', id))
      await updateDoc(doc(db, 'reels', reel?.id), { likesCount: increment(-1) })
      await updateDoc(doc(db, 'users', reel?.user?.id), { likesCount: increment(-1) })
      await updateDoc(doc(db, 'users', id), { coins: increment(-20) })
      setDisable(false)
    } else {
      setDisable(true)
      await setDoc(doc(db, 'reels', reel?.id, 'likes', id), {
        id: id,
        photoURL: profile?.photoURL,
        displayName: profile?.displayName,
        username: profile?.username,
      })
      await updateDoc(doc(db, 'reels', reel?.id), {
        likesCount: increment(1)
      })
      await updateDoc(doc(db, 'users', reel?.user?.id), {
        likesCount: increment(1)
      })
      await updateDoc(doc(db, 'users', id), { coins: increment(-20) })
      setDisable(false)
      if (reel?.user?.id != id)
        await addDoc(collection(db, 'users', reel?.user?.id, 'notifications'), {
          action: 'reel',
          activity: 'likes',
          text: 'likes your post',
          notify: reel?.user,
          id: reel?.id,
          seen: false,
          reel,
          user: { id: id },
          timestamp: serverTimestamp()
        }).then(async () => {
          axios.post(`https://app.nativenotify.com/api/indie/notification`, {
            subID: reel?.user?.id,
            appId: 3167,
            appToken,
            title: 'Oymo',
            message: `@${profile?.username} likes to your comment (${reel?.description?.slice(0, 100)})`
          })
          await updateDoc(doc(db, 'users', reel?.user?.id), { notificationCount: increment(1) })
        })
    }
  })

  const getLikesById = () => new Promise(async (resolve, reject) => {
    getDoc(doc(db, 'reels', reel?.id, 'likes', id))
      .then(res => resolve(res?.exists()))
  })

  const handleUpdateLikes = async () => {
    setCurrentLikesState({
      state: !currentLikesState.state,
      counter: currentLikesState.counter + (currentLikesState.state ? -1 : 1)
    })
    updateLike()
  }

  const disabled = () => navigation.navigate('SetupModal')

  return (
    <TouchableOpacity
      onPress={() => profile ? handleUpdateLikes() : disabled()}
      disabled={disable}
      style={reels.likeButton}
    >
      <AntDesign name='heart' size={24} color={currentLikesState.state ? color.red : color.white} />
      <OymoFont message={currentLikesState.counter ? currentLikesState.counter : '0'} fontStyle={reels.likesCounter} />
    </TouchableOpacity>
  )
}

export default LikeReels