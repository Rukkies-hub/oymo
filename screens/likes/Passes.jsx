import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, SafeAreaView, FlatList, Text, ActivityIndicator } from 'react-native'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import Avatar from './Avatar'
import Username from './Username'
import { useSelector } from 'react-redux'
import { likes } from '../../style/likes'
import OymoFont from '../../components/OymoFont'
import color from '../../style/color'

const Passes = () => {
  const { user, profile } = useSelector(state => state.user)
  const navigation = useNavigation()

  const [passes, setPasses] = useState([])

  useEffect(() => {
    (() => {
      onSnapshot(query(collection(db, 'users', user?.uid, 'passes'), orderBy('timestamp', 'desc')),
        snapshot => {
          setPasses(
            snapshot?.docs?.map(doc => ({
              id: doc?.id,
              ...doc?.data()
            }))
          )
        })
    })()
  }, [])

  const undoPass = async pass =>
    await deleteDoc(doc(db, "users", user?.uid, 'passes', pass?.id))

  const disabled = () => navigation.navigate('SetupModal')

  return (
    <View style={likes.likesContainer}>
      {
        passes?.length >= 1 ?
          <FlatList
            data={passes}
            keyExtractor={item => item?.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: pass }) => (
              <View style={likes.likesListContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: pass })}>
                  <Avatar user={pass?.id} />
                </TouchableOpacity>

                <View style={likes.rightView}>
                  <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: pass })}>
                    <Username user={pass?.id} />
                  </TouchableOpacity>
                  {
                    pass?.about && pass?.about != '' &&
                    <View style={{ marginTop: 10 }}>
                      <OymoFont message={pass?.about} lines={2} fontStyle={likes.aboutText} />
                    </View>
                  }
                  <View style={likes.infoContainer}>
                    <Feather name='home' size={12} color={color.dark} />

                    <View style={likes.infoView}>
                      <OymoFont message='Lives in' fontStyle={likes.infoText} />
                      <OymoFont message={pass?.city} fontStyle={likes.infoText} fontFamily='montserrat_bold' />
                    </View>
                  </View>
                  {
                    pass?.job != '' &&
                    <View style={likes.infoContainer}>
                      <Feather name='briefcase' size={12} color={color.dark} />

                      <View style={likes.infoView}>
                        <OymoFont message='Lives in' fontStyle={likes.infoText} />
                        <Text style={[likes.infoText, { fontFamily: 'text' }]}>
                          {pass?.job} {pass?.job ? 'at' : null} {pass?.company}
                        </Text>
                      </View>
                    </View>
                  }
                  <View style={likes.controlesView}>
                    <TouchableOpacity onPress={() => swipeLeft(like)} style={likes.nopeButton}>
                      <OymoFont message='Nope' fontStyle={{ color: color.red }} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => profile ? undoPass(pass) : disabled()} style={likes.matchButon}>
                      <Feather name='trash-2' size={20} color={color.white} />
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

export default Passes