import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import OymoFont from '../../../components/OymoFont'
import { notify } from '../../../style/notification'
import { useSelector } from 'react-redux'
import color from '../../../style/color'

const UserInfo = ({ user: _user }) => {
  const [userInfo, setUserInfo] = useState(null)
  const { theme } = useSelector(state => state.user)

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', _user))).data()
      setUserInfo(userI)
    })()
  }, [])

  return (
    <OymoFont message={userInfo?.username} fontStyle={{...notify.username, color: theme ? color.white : color.dark}} />
  )
}

export default UserInfo