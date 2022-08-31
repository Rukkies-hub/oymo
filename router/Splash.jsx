import { View, Text, Image, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import color from '../style/color'
import OymoFont from '../components/OymoFont'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setProfile, setUser } from '../features/userSlice'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../hooks/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { setReels } from '../features/reelsSlice'

const Splash = () => {
  const { user } = useSelector(state => state.user)
  const { reelsLimit } = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    onAuthStateChanged(auth, userAuth => {
      if (userAuth) 
        dispatch(setUser(userAuth))
      else
        dispatch(logout())
    })
  }, [])

  useEffect(() => {
    (() => {
      if (user)
        onSnapshot(doc(db, 'users', user?.uid),
          doc => {
            let profile = doc?.data()
            dispatch(setProfile(profile))
          })
    })()
  }, [user, db])

  useEffect(() => {
    (async () => {
      const queryReels = await getDocs(query(collection(db, 'reels'), limit(reelsLimit), orderBy('timestamp', 'desc')))

      dispatch(setReels(
        queryReels?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        }))
      ))
    })()
  }, [user, db])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Image
          source={require('../assets/icon.png')}
          style={{
            width: 100,
            height: 100,
            marginBottom: 30
          }}
        />
        <ActivityIndicator color={color.red} size='large' />
      </View>
      <View
        style={{
          alignItems: 'center'
        }}
      >
        <OymoFont message='Find a date on your own tems' />
      </View>
    </View>
  )
}

export default Splash