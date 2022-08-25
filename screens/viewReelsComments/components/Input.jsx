import { View, Text, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import color from '../../../style/color'
import { useFonts } from 'expo-font'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { useDispatch, useSelector } from 'react-redux'
import { ci } from '../../../style/reelsComment'
import { setReply } from '../../../features/reelsSlice'

const Input = ({ user }) => {
  const { reelsCommentType, reply } = useSelector(state => state.reels)
  const dispatch = useDispatch()

  const [userInfo, setUserInfo] = useState(null)
  const [height, setHeight] = useState(40)

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', user))).data()
      setUserInfo(userI)
    })()
  }, [])

  return (
    <TextInput
      multiline
      value={reelsCommentType == 'reply' ? reply : reply}
      onChangeText={value => reelsCommentType == 'reply' ? dispatch(setReply(value)) : dispatch(setReply(value))}
      placeholder={reelsCommentType == 'reply' ? `Reply @${userInfo?.username}` : `Reply @${userInfo?.username}'s comment`}
      placeholderTextColor={color.lightText}
      onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
      style={[ci.input, { height }]}
    />
  )
}

export default Input