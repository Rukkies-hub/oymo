import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import OymoFont from '../../components/OymoFont'
import { likes } from '../../style/likes'
import { useSelector } from 'react-redux'
import color from '../../style/color'

const Username = ({ user }) => {
  const [userInfo, setUserInfo] = useState(null)
  const { theme } = useSelector(state => state.user)

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', user))).data()
      setUserInfo(userI)
    })()
  }, [])

  return (
    <OymoFont message={userInfo?.username} fontStyle={{ ...likes.username, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
  )
}

export default Username