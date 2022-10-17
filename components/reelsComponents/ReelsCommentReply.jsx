import { doc, getDoc } from 'firebase/firestore'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { setCommentAutoFocus, setReelsCommentType, setReplyCommentProps } from '../../features/reelsSlice'
import { db } from '../../hooks/firebase'

import color from '../../style/color'
import { _comments } from '../../style/reelsComment'
import OymoFont from '../OymoFont'

const ReelsCommentReply = ({ comment }) => {
  const dispatch = useDispatch()

  const setProps = async () => {
    const user = await (await getDoc(doc(db, 'users', comment?.user?.id))).data()
    comment.user = user

    dispatch(setReelsCommentType('reply'))
    dispatch(setReplyCommentProps(null))
    dispatch(setReplyCommentProps(comment))
    dispatch(setCommentAutoFocus(true))
  }

  return (
    <TouchableOpacity onPress={setProps} style={_comments.replyCommentButton}>
      <OymoFont message='Reply' fontStyle={{ color: color.white }} />
    </TouchableOpacity>
  )
}

export default ReelsCommentReply