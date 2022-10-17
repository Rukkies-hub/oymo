import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { deleteDoc, doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import color from '../../style/color'
import { useSelector } from 'react-redux'
import { rcr } from '../../style/reelsComment'
import OymoFont from '../OymoFont'

const LikeReelsReply = ({ reply }) => {
  const { user, profile } = useSelector(state => state.user)
  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: reply?.likesCount })

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  useEffect(() => {
    (() => {
      getLikesById(reply.id, id)
        .then(res => {
          setCurrentLikesState({
            ...currentLikesState,
            state: res
          })
        })
    })()
  }, [])

  const getLikesById = () => new Promise(async (resolve, reject) => {
    getDoc(doc(db, 'reels', reply?.reel?.id, 'comments', reply?.comment, 'replies', reply?.id, 'likes', id))
      .then(res => resolve(res?.exists()))
  })

  const updateLike = () => new Promise(async (resolve, reject) => {
    if (currentLikesState.state) {
      await deleteDoc(doc(db, 'reels', reply?.reel?.id, 'comments', reply?.comment, 'replies', reply?.id, 'likes', id))
      await updateDoc(doc(db, 'reels', reply?.reel?.id, 'comments', reply?.comment, 'replies', reply?.id), {
        likesCount: increment(-1)
      })
    } else {
      await setDoc(doc(db, 'reels', reply?.reel?.id, 'comments', reply?.comment, 'replies', reply?.id, 'likes', id), {
        id: userProfile?.id,
        comment: reply?.comment,
        reply: reply?.id,
        photoURL: userProfile?.photoURL,
        username: userProfile?.username,
      })
      await updateDoc(doc(db, 'reels', reply?.reel?.id, 'comments', reply?.comment, 'replies', reply?.id), {
        likesCount: increment(1)
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
    <TouchableOpacity onPress={handleUpdateLikes} style={rcr.likeReelsReply}>
      {
        currentLikesState.counter > 0 &&
        <OymoFont
          message={currentLikesState.counter}
          fontStyle={{
            marginRight: 3,
            color: currentLikesState.state ? color.red : color.white
          }}
        />
      }
      <OymoFont
        message={currentLikesState.counter <= 1 ? 'Like' : 'Likes'}
        fontStyle={{ color: currentLikesState.state ? color.red : color.white }}
      />
    </TouchableOpacity>
  )
}

export default LikeReelsReply