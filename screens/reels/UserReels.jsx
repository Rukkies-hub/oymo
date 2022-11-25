import { View, Text, ActivityIndicator, FlatList, Pressable, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { collection, getDocs, limit, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import { useNavigation } from '@react-navigation/native'
import { pReels } from '../../style/profileReels'
import color from '../../style/color'
import OymoFont from '../../components/OymoFont'
import { useSelector } from 'react-redux'

const UserReels = () => {
  const { theme } = useSelector(state => state.user)
  const { activeReelUser } = useSelector(state => state.reels)
  const navigation = useNavigation()

  const activeUser = activeReelUser?.user?.id

  const [reels, setReels] = useState([])
  const [reelsLimit, setLimit] = useState(50)

  useEffect(() => {
    if (activeUser == undefined) return
    return onSnapshot(query(collection(db, 'reels'),
      where('user.id', '==', activeUser), limit(reelsLimit)),
      snapshot => setReels(
        snapshot?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        }))
      )
    )
  }, [reelsLimit, db, activeUser])

  const getReels = async () => {
    const queryReels = await getDocs(query(collection(db, 'reels'), where('user.id', '==', activeUser), limit(reelsLimit)))

    setReels(
      queryReels?.docs?.map(doc => ({
        id: doc?.id,
        ...doc?.data()
      }))
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme ? color.dark : color.white }}>
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
                    delayLongPress={500}
                    style={pReels.reelsList}
                    onPress={() => navigation.navigate('ViewReel', { reel })}
                  >
                    <Image source={{ uri: reel?.thumbnail }} style={pReels.reelsThumb} />

                    <View style={{ flex: 1 }}>
                      <OymoFont message={reel?.description} lines={1} fontStyle={{ ...pReels.desctiption, color: theme ? color.white : color.dark }} />

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
    </View>
  )
}

export default UserReels