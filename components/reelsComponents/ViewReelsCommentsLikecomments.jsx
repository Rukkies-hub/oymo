import { useFonts } from 'expo-font'
import { deleteDoc, doc, getDoc, increment, setDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { db } from '../../hooks/firebase'
import color from '../../style/color'

import { appToken, notificationUri } from '@env'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { vrc } from '../../style/reelsComment'
import OymoFont from '../OymoFont'

const ViewReelsCommentsLikecomments = ({ comment }) => {
  const { user, profile } = useSelector(state => state.user)

  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: comment?.likesCount })

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  useEffect(() => {
    (() => {
      getLikesById(comment?.id, id)
        .then(res => {
          setCurrentLikesState({
            ...currentLikesState,
            state: res
          })
        })
    })()
  }, [comment])

  const getLikesById = () => new Promise(async (resolve, reject) => {
    getDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'likes', id))
      .then(res => resolve(res?.exists()))
  })

  const updateLike = () => new Promise(async (resolve, reject) => {
    if (currentLikesState.state) {
      await deleteDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'likes', id))
      await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id), {
        likesCount: increment(-1)
      })
    } else {
      await setDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'likes', id), {
        id: id,
        photoURL: profile?.photoURL,
        username: profile?.username,
      })
      await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id), {
        likesCount: increment(1)
      })
    }

    if (comment?.user?.id != id) {
      await addDoc(collection(db, 'users', comment?.user?.id, 'notifications'), {
        action: 'reel',
        activity: 'comment likes',
        text: 'likes your comment',
        notify: comment?.user,
        id: comment?.reel?.id,
        seen: false,
        reel: comment?.reel,
        user: { id: id },
        timestamp: serverTimestamp()
      }).then(() => {
        axios.post(notificationUri, {
          subID: comment?.reel?.user?.id,
          appId: 3167,
          appToken,
          title: 'Oymo',
          message: `@${profile?.username} likes to your comment (${comment?.comment})`
        })
      })
    }
  })

  const handleUpdateLikes = () => {
    setCurrentLikesState({
      state: !currentLikesState.state,
      counter: currentLikesState.counter + (currentLikesState.state ? -1 : 1)
    })
    updateLike()
  }

  return (
    <View>
      <TouchableOpacity onPress={handleUpdateLikes} style={vrc.vrclcContainer}>
        {
          currentLikesState.counter > 0 &&
          <OymoFont
            message={currentLikesState.counter}
            fontStyle={{
              marginRight: 3,
              color: currentLikesState.state ? color.red : color.white,
            }}
          />
        }

        <OymoFont message={currentLikesState.counter <= 1 ? 'Like' : 'Likes'} fontStyle={{ color: currentLikesState.state ? color.red : color.white }} />
      </TouchableOpacity>
    </View>
  )
}

export default ViewReelsCommentsLikecomments