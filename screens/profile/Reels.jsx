import React, { useState, useLayoutEffect } from 'react'
import { View, Text, Pressable, Image, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native'

import color from '../../style/color'

import { useNavigation } from '@react-navigation/native'
import { collection, getDocs, limit, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import OymoFont from '../../components/OymoFont'

import { pReels } from '../../style/profileReels'
import { useSelector } from 'react-redux'
import { Entypo } from '@expo/vector-icons'

const Reels = () => {
  const navigation = useNavigation()
  const { user, profile, theme } = useSelector(state => state.user)

  const [reels, setReels] = useState([])
  const [reelsLimit, setLimit] = useState(50)

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  useLayoutEffect(() => {
    return onSnapshot(query(collection(db, 'reels'),
      where('user.id', '==', id), limit(reelsLimit)),
      snapshot => setReels(
        snapshot?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        }))
      )
    )
  }, [reelsLimit, db])

  return (
    <View style={{ flex: 1, backgroundColor: theme ? color.dark : color.white }}>
      <View style={pReels.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={pReels.goBack}>
          <Entypo name='chevron-left' size={24} color={theme ? color.white : color.dark} />
        </TouchableOpacity>
        <OymoFont message='Reels' fontStyle={{...pReels.goBackText, color: theme ? color.white : color.dark}} />
      </View>
      {
        reels?.length < 1 ?
          <View style={pReels.indicatorContainer}>
            <ActivityIndicator size='large' color={theme ? color.white : color.black} />
          </View> :
          <ScrollView>
            {
              reels?.map((reel, index) => {
                return (
                  <Pressable
                    key={index}
                    onPress={() => navigation.navigate('ViewReel', { reel })}
                    onLongPress={() => navigation.navigate('ReelsOption', { reel })}
                    delayLongPress={500}
                    style={pReels.reelsList}
                  >
                    <Image source={{ uri: reel?.thumbnail }} style={pReels.reelsThumb} />

                    <View style={{ flex: 1 }}>
                      <OymoFont message={reel?.description} lines={1} fontStyle={{ ...pReels.desctiption, color: theme ? color.white : color.dark }} />
                      <OymoFont message={`Video - ${profile?.username}`} lines={1} fontStyle={{ ...pReels.username, color: theme ? color.white : color.dark }} />

                      <View style={pReels.statsContainer}>
                        <View style={pReels.statsContainerRow}>
                          <OymoFont message={reel?.likesCount} lines={1} fontStyle={{ ...pReels.reelsCount, color: theme ? color.white : color.dark }} />
                          <Text style={[pReels.reelsCountText, { color: theme ? color.white : color.dark }]}>
                            {reel?.likesCount == 1 ? 'Like' : 'Likes'}
                          </Text>
                        </View>
                        <View style={pReels.statsContainerRow}>
                          <OymoFont message={reel?.commentsCount} lines={1} fontStyle={{ ...pReels.reelsCount, color: theme ? color.white : color.dark }} />
                          <Text style={[pReels.reelsCountText, { color: theme ? color.white : color.dark }]}>
                            {reel?.commentsCount == 1 ? 'Comment' : 'Comments'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                )
              })
            }
          </ScrollView>

      }
    </View>
  )
}

export default Reels
// in use