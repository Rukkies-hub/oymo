import React, { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import Header from '../../../components/Header'

const MessageHeader = ({ user, matchDetails }) => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    (() => {
      onSnapshot(doc(db, 'users', user?.id),
        doc => setUserInfo(doc?.data())
      )
    })()
  }, [])

  return (
    <Header
      showBack
      showTitle
      showChatOptions
      showMatchAvatar
      title={userInfo?.username}
      matchDetails={matchDetails}
      matchAvatar={userInfo?.photoURL}
    />
  )
}

export default MessageHeader