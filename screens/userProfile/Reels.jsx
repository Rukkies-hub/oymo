import React, { useState, useLayoutEffect } from 'react'
import { View, Text, Pressable, Image, FlatList, ActivityIndicator } from 'react-native'

import color from '../../style/color'

import { useNavigation, useRoute } from '@react-navigation/native'
import { collection, getDocs, limit, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import OymoFont from '../../components/OymoFont'

import { pReels } from '../../style/profileReels'
import { useSelector } from 'react-redux'

const Reels = ({ profile, user }) => {
  const { theme } = useSelector(state => state.user)
  const navigation = useNavigation()
  const { passed } = useRoute().params

  const [reels, setReels] = useState([])
  const [reelsLimit, setLimit] = useState(50)

  useLayoutEffect(() => {
    return onSnapshot(query(collection(db, 'reels'),
      where('user.id', '==', user?.id), limit(reelsLimit)),
      snapshot => setReels(
        snapshot?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        }))
      )
    )
  }, [reelsLimit, db])

  const getReels = async () => {
    const queryReels = await getDocs(query(collection(db, 'reels'), where('user.id', '==', user?.id), limit(reelsLimit)))

    setReels(
      queryReels?.docs?.map(doc => ({
        id: doc?.id,
        ...doc?.data()
      }))
    )
  }

  return (
    <>
      {
        reels?.length < 1 ?
          <View style={pReels.indicatorContainer}>
            <ActivityIndicator size='large' color={theme ? color.white : color.black} />
          </View> :
          <>
            {
              reels?.map((reel, index) => {
                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      if (passed)
                        navigation.navigate('Alert', {
                          theme,
                          showBody: true,
                          body: 'Sorry you passed on this user. Please undo the pass to match again🙂',
                          showOk: true
                        })
                      else
                        navigation.navigate('ViewReel', { reel })
                    }}
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
          </>
      }
    </>
  )
}

export default Reels
// in use