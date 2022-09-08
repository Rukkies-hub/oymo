import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import OymoFont from '../../components/OymoFont'
import { likes } from '../../style/likes'

const Username = ({ user }) => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', user))).data()
      setUserInfo(userI)
    })()
  }, [])

  return (
    <OymoFont message={userInfo?.username} fontStyle={likes.username} fontFamily='montserrat_bold' />
  )
}

export default Username