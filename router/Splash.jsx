import { View, Text, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import color from '../style/color'
import OymoFont from '../components/OymoFont'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setProfile, setTheme, setUser } from '../features/userSlice'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../hooks/firebase'
import { doc, getDoc, onSnapshot, updateDoc, where } from 'firebase/firestore'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { setReels } from '../features/reelsSlice'
import { setPendingSwipes, setProfiles } from '../features/matchSlice'
import { useLayoutEffect } from 'react'
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Splash = () => {
  const { user } = useSelector(state => state.user)
  const { reelsLimit } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    onAuthStateChanged(auth, userAuth => {
      if (userAuth)
        dispatch(setUser(userAuth))
      else
        dispatch(logout())
      getprofile(userAuth)
      getPendingSwipes(userAuth)
      setMyLocation(userAuth)
      setAge(userAuth)
    })
  }, [])

  const getprofile = async user => {
    if (!user || user == undefined) return
    const profile = await (await getDoc(doc(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid))).data()
    if (profile)
      dispatch(setProfile(profile))
  }

  const getPendingSwipes = async user => {
    if (!user || user == undefined) return

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

  const setMyLocation = async user => {
    if (!user) return
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied')
      return
    }

    let { coords } = await Location.getCurrentPositionAsync({})
    const address = await Location.reverseGeocodeAsync(coords)

    const profile = await (await getDoc(doc(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid))).data()

    if (!profile) return

    await updateDoc(doc(db, 'users', profile?.id), {
      coords,
      address: address[0]
    })
  }

  const setAge = async user => {
    if (!user || user == undefined) return
    function getAge (dateString) {
      var today = new Date()
      var birthDate = new Date(dateString)
      var age = today.getFullYear() - birthDate.getFullYear()
      var m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    }

    const profile = await (await getDoc(doc(db, 'users', user?.uid == undefined ? user?.user?.uid : user?.uid))).data()

    if (profile) return
    await updateDoc(doc(db, 'users', profile?.id), {
      age: getAge(profile?.dob)
    })
  }

  useEffect(() => {
    const call = async () => {
      try {
        const value = await AsyncStorage.getItem('@oymo_theme')
        if (value !== null) {
          let _val = JSON.parse(value)
          dispatch(setTheme(_val))
        }
      } catch (e) { }
    }
    call()
  }, [])

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