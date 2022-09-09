import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import OymoFont from '../../../components/OymoFont'
import { notify } from '../../../style/notification'

const UserInfo = ({ user: _user }) => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    (async () => {
      const userI = await (await getDoc(doc(db, 'users', _user))).data()
      setUserInfo(userI)
    })()
  }, [])

  return (
    <OymoFont message={userInfo?.username} fontStyle={notify.username} />
  )
}

export default UserInfo