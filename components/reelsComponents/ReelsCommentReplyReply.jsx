import { doc, getDoc } from 'firebase/firestore'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { setReelsCommentType, setReplyCommentProps } from '../../features/reelsSlice'
import { db } from '../../hooks/firebase'
import color from '../../style/color'
import OymoFont from '../OymoFont'

const ReelsCommentReplyReply = ({ comment }) => {
  const dispatch = useDispatch()

  const setProps = async () => {
    const user = await (await getDoc(doc(db, 'users', comment?.user?.id))).data()
    comment.user = user
    dispatch(setReelsCommentType('replyReply'))
    dispatch(setReplyCommentProps(comment))
  }

  return (
    <TouchableOpacity
      onPress={setProps}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 2
      }}
    >
      <OymoFont message='Reply' fontStyle={{ color: color.white }} />
    </TouchableOpacity>
  )
}

export default ReelsCommentReplyReply