import React from 'react'
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import generateId from '../../lib/generateId'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import Avatar from './Avatar'
import Username from './Username'
import { useSelector } from 'react-redux'
import { likes } from '../../style/likes'
import OymoFont from '../../components/OymoFont'
import color from '../../style/color'

const Likes = () => {
  const { user, profile } = useSelector(state => state.user)
  const { pendingSwipes } = useSelector(state => state.match)
  const navigation = useNavigation()

  const swipeLeft = async like => {
    setDoc(doc(db, 'users', user?.uid, 'passes', like.id), like)
    await deleteDoc(doc(db, 'users', user?.uid, 'pendingSwipes', like.id))
  }

  const swipeRight = async like => {
    const needle = like.id
    const cardIndex = profiles.findIndex(item => item.id === needle)

    if (!profiles[cardIndex]) return

    const userSwiped = profiles[cardIndex]

    getDoc(doc(db, 'users', user?.uid, 'pendingSwipes', userSwiped.id))
      .then(documentSnapshot => {
        if (documentSnapshot.exists()) {
          setDoc(doc(db, 'users', user?.uid, 'swipes', userSwiped.id), userSwiped)

          // CREAT A MATCH
          setDoc(doc(db, 'matches', generateId(user?.uid, userSwiped.id)), {
            users: {
              [user?.uid]: profile,
              [userSwiped.id]: userSwiped
            },
            usersMatched: [user?.uid, userSwiped.id],
            timestamp: serverTimestamp()
          }).then(async () => await deleteDoc(doc(db, 'users', user?.uid, 'pendingSwipes', userSwiped.id)))

          navigation.navigate('NewMatch', {
            loggedInProfile: profile,
            userSwiped
          })
        }
      })

    setDoc(doc(db, 'users', user?.uid, 'swipes', userSwiped?.id), userSwiped)
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

                  {
                    like?.about && like?.about != '' &&
                    <View style={{ marginTop: 10 }}>
                      <OymoFont message={like?.about} lines={2} fontStyle={likes.aboutText} />
                    </View>
                  }
                  <View style={likes.infoContainer}>
                    <Feather name='home' size={12} color={color.dark} />

                    <View style={likes.infoView}>
                      <OymoFont message='Lives in' fontStyle={likes.infoText} />
                      <OymoFont message={like?.city} fontStyle={likes.infoText} fontFamily='montserrat_bold' />
                    </View>
                  </View>
                  {
                    like?.job != '' &&
                    <View style={likes.infoContainer}>
                      <Feather name='briefcase' size={12} color={color.dark} />

                      <View style={likes.infoView}>
                        <OymoFont message='Lives in' fontStyle={likes.infoText} />
                        <Text style={[likes.infoText, { fontFamily: 'text' }]}>
                          {like?.job} {like?.job ? 'at' : null} {like?.company}
                        </Text>
                      </View>
                    </View>
                  }
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