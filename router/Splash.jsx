import { View, Text, Image, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import color from '../style/color'
import OymoFont from '../components/OymoFont'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setProfile, setUser } from '../features/userSlice'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../hooks/firebase'
import { doc, getDoc, onSnapshot, where } from 'firebase/firestore'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { setReels } from '../features/reelsSlice'
import { setPendingSwipes, setProfiles } from '../features/matchSlice'
import { useLayoutEffect } from 'react'

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
      getprofile(userAuth)
      getPendingSwipes(userAuth)
    })
  }, [])

  const getprofile = async user => {
    const profile = await (await getDoc(doc(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid))).data()
    if (profile)
      dispatch(setProfile(profile))
  }

  const getPendingSwipes = async user => {
    const querySnapshot = await getDocs(query(collection(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid, 'pendingSwipes'), where('photoURL', '!=', null)))

    if (querySnapshot?.docs?.length >= 1)
      dispatch(
        setPendingSwipes(querySnapshot?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        })))
      )
    else dispatch(setPendingSwipes([]))
  }

  useLayoutEffect(() => {
    if (user)
      onSnapshot(doc(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid),
        doc => {
          let profile = doc?.data()
          dispatch(setProfile(profile))
        }
      )
  }, [user])

  useEffect(() => {
    (() => {
      if (user)
        onSnapshot(query(collection(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid, 'pendingSwipes'), where('photoURL', '!=', null)),
          snapshot => {
            if (snapshot?.docs?.length >= 1)
              dispatch(
                setPendingSwipes(
                  snapshot?.docs?.map(doc => ({
                    id: doc?.id,
                    ...doc?.data()
                  }))
                )
              )
          }
        )
    })()
  }, [user])

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
  }, [user])

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
        <OymoFont message='Find the fun you forgot' />
      </View>
    </View>
  )
}

export default Splash