import React from 'react'
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import generateId from '../../lib/generateId'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import Avatar from './Avatar'
import Username from './Username'
import { useDispatch, useSelector } from 'react-redux'
import { likes } from '../../style/likes'
import OymoFont from '../../components/OymoFont'
import color from '../../style/color'
import { setPendingSwipes, setProfiles } from '../../features/matchSlice'

const Likes = () => {
  const { user, profile } = useSelector(state => state.user)
  const { pendingSwipes, profiles } = useSelector(state => state.match)
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const getPendingSwipes = async () => {
    dispatch(setPendingSwipes([]))
    const querySnapshot = await getDocs(collection(db, 'users', user?.uid, 'pendingSwipes'))

    if (querySnapshot?.docs?.length >= 1)
      dispatch(
        setPendingSwipes(querySnapshot?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        })))
      )
    else dispatch(setPendingSwipes([]))
  }

  const getAllProfiles = async () => {
    const passes = await getDocs(collection(db, 'users', user?.uid, 'passes'))
      .then(snapshot => snapshot?.docs?.map(doc => doc?.id))

    const passeedUserIds = (await passes).length > 0 ? passes : ['test']

    const swipes = await getDocs(collection(db, 'users', user?.uid, 'swipes'))
      .then(snapshot => snapshot?.docs?.map(doc => doc?.id))

    const swipededUserIds = (await swipes).length > 0 ? swipes : ['test']

    onSnapshot(query(collection(db, 'users'), where('id', 'not-in', [...passeedUserIds, ...swipededUserIds])),
      snapshot => {
        const array = snapshot?.docs?.filter(doc => doc?.data()?.photoURL != null)
          .filter(doc => doc?.data()?.username != null || doc?.data()?.username != '')
          .filter(doc => doc?.id !== user?.uid)
          .map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))

        if (array.length >= 1) dispatch(setProfiles(array))
        else dispatch(setProfiles([]))
      })
  }

  const swipeLeft = async like => {
    await setDoc(doc(db, 'users', user?.uid, 'passes', like.id), like)
    await deleteDoc(doc(db, 'users', user?.uid, 'pendingSwipes', like.id))

    getPendingSwipes()
    getAllProfiles()
  }

  const swipeRight = async like => {
    const needle = like.id
    const cardIndex = profiles.findIndex(item => item.id === needle)

    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    await getDoc(doc(db, 'users', user?.uid, 'pendingSwipes', userSwiped?.id))
      .then(documentSnapshot => {
        if (documentSnapshot.exists()) {
          setDoc(doc(db, 'users', user?.uid, 'swipes', userSwiped?.id), userSwiped)

          // CREAT A MATCH
          setDoc(doc(db, 'matches', generateId(user?.uid, userSwiped?.id)), {
            users: {
              [user?.uid]: profile,
              [userSwiped?.id]: userSwiped
            },
            usersMatched: [user?.uid, userSwiped?.id],
            timestamp: serverTimestamp()
          }).then(async () => await deleteDoc(doc(db, 'users', user?.uid, 'pendingSwipes', userSwiped?.id)))

          navigation.navigate('NewMatch', {
            loggedInProfile: profile,
            userSwiped
          })
          getAllProfiles()
        }
      })

    getPendingSwipes()
    // setDoc(doc(db, 'users', user?.uid, 'swipes', userSwiped?.id), userSwiped)
  }

  return (
    <View style={likes.likesContainer}>
      {
        pendingSwipes?.length > 0 ?
          <FlatList
            data={pendingSwipes}
            keyExtractor={item => item?.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: like }) => (
              <View style={likes.likesListContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: like })}>
                  <Avatar user={like?.id} />
                </TouchableOpacity>

                <View style={likes.rightView}>
                  <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: like })}>
                    <Username user={like?.id} />
                  </TouchableOpacity>

                  <View style={likes.infoContainer}>
                    <Feather name='home' size={12} color={color.dark} />

                    <View style={likes.infoView}>
                      <OymoFont message='Lives in' fontStyle={likes.infoText} />
                      <OymoFont message={like?.city} lines={1} fontStyle={likes.infoText} fontFamily='montserrat_bold' />
                    </View>
                  </View>

                  <View style={likes.controlesView}>
                    <TouchableOpacity onPress={() => swipeLeft(like)} style={likes.nopeButton}>
                      <OymoFont message='Nope' fontStyle={{ color: color.red }} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => swipeRight(like)} style={likes.matchButon}>
                      <OymoFont message='Match' fontStyle={{ color: color.white }} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          /> :
          <View style={likes.loading}>
            <ActivityIndicator size='large' color={color.red} />
          </View>
      }
    </View>
  )
}

export default Likes