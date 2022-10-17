import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import color from '../../style/color'

import { addDoc, collection, deleteDoc, doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { useSelector } from 'react-redux'
import { _comments } from '../../style/reelsComment'
import OymoFont from '../OymoFont'

const LikeReelsComment = ({ comment, reelId }) => {
  const { user, profile } = useSelector(state => state.user)

  const [currentLikesState, setCurrentLikesState] = useState({ state: false, counter: comment?.likesCount })
  const [disable, setDisable] = useState(false)

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
  }, [])

  const getLikesById = () => new Promise(async (resolve, reject) => {
    getDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'likes', id))
      .then(res => resolve(res?.exists()))
  })

  const updateLike = () => new Promise(async (resolve, reject) => {
    if (currentLikesState.state) {
      setDisable(true)
      await deleteDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'likes', id))
      await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id), {
        likesCount: increment(-1)
      })
      setDisable(false)
    } else {
      setDisable(true)
      await setDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id, 'likes', id), {
        id: profile?.id,
        photoURL: profile?.photoURL,
        username: profile?.username,
      })
      await updateDoc(doc(db, 'reels', comment?.reel?.id, 'comments', comment?.id), {
        likesCount: increment(1)
      })
    }

    setDisable(false)

    if (comment?.user?.id != id) {
      const reel = await (await getDoc(doc(db, 'reels', comment?.reel?.id))).data()

      await addDoc(collection(db, 'users', comment?.user?.id, 'notifications'), {
        action: 'reel',
        activity: 'comment likes',
        text: 'likes your comment',
        notify: comment?.user,
        id: reelId,
        seen: false,
        reel,
        user: { id: id },
        timestamp: serverTimestamp()
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
    <TouchableOpacity onPress={handleUpdateLikes} disabled={disable} style={_comments.likeComment}>
      {
        currentLikesState.counter > 0 &&
        <Text
          style={[_comments.likeCommentCounter, { color: currentLikesState?.state ? color.red : color.white }]}
        >
          {currentLikesState.counter}
        </Text>
      }
      <OymoFont
        message={currentLikesState.counter <= 1 ? 'Like' : 'Likes'}
        fontStyle={{ color: currentLikesState?.state ? color.red : color.white }}
      />
    </TouchableOpacity>
  )
}

export default LikeReelsComment