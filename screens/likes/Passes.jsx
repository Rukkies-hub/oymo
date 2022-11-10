import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { collection, deleteDoc, doc, increment, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import Avatar from './Avatar'
import Username from './Username'
import { useSelector } from 'react-redux'
import { likes } from '../../style/likes'
import OymoFont from '../../components/OymoFont'
import color from '../../style/color'

import { admin } from '@env'

const Passes = () => {
  const { user, profile, theme } = useSelector(state => state.user)
  const navigation = useNavigation()

  const [passes, setPasses] = useState([])

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  useEffect(() => {
    (() => {
      onSnapshot(query(collection(db, 'users', id, 'passes'), orderBy('timestamp', 'desc')),
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

  const undoPass = async pass => {
    await deleteDoc(doc(db, 'users', id, 'passes', pass?.id))
    await updateDoc(doc(db, 'admin', admin), { undos: increment(1) })
  }

  const disabled = () => navigation.navigate('SetupModal')

  return (
    <View style={[likes.likesContainer, { backgroundColor: theme ? color.dark : color.white }]}>
      {
        passes?.length >= 1 ?
          <FlatList
            data={passes}
            keyExtractor={item => item?.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: pass }) => (
              <View style={likes.likesListContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: pass, nearby: false, passed: true })}>
                  <Avatar user={pass?.id} />
                </TouchableOpacity>

                <View style={likes.rightView}>
                  <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { user: pass, nearby: false, passed: true })}>
                    <Username user={pass?.id} />
                  </TouchableOpacity>
                  {
                    pass?.address?.city != undefined &&
                    <View style={likes.infoContainer}>
                      <Feather name='home' size={12} color={theme ? color.white : color.dark} />

                      <View style={likes.infoView}>
                        <OymoFont message='Lives in' fontStyle={{ ...likes.infoText, color: theme ? color.white : color.dark }} />
                        <OymoFont message={pass?.address?.city} fontStyle={{ ...likes.infoText, color: theme ? color.white : color.dark }} fontFamily='montserrat_bold' />
                      </View>
                    </View>
                  }
                  <View style={likes.controlesView}>
                    <TouchableOpacity onPress={() => profile ? undoPass(pass) : disabled()} style={likes.matchButon}>
                      <OymoFont message='Undo pass' fontStyle={{ ...likes.infoText, marginLeft: 0, color: color.white }} fontFamily='montserrat_bold' />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          /> :
          <View style={likes.loading}>
            <ActivityIndicator size='large' color={theme ? color.white : color.white} />
          </View>
      }
    </View>
  )
}

export default Passes