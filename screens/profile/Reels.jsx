import React, { useState, useLayoutEffect } from 'react'
import { View, Text, Pressable, Image, FlatList, ActivityIndicator } from 'react-native'

import color from '../../style/color'

import { useNavigation } from '@react-navigation/native'
import { collection, getDocs, limit, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../hooks/firebase'
import OymoFont from '../../components/OymoFont'

import { pReels } from '../../style/profileReels'

const Reels = ({ profile, user }) => {
  const navigation = useNavigation()

  const [reels, setReels] = useState([])
  const [reelsLimit, setLimit] = useState(50)

  useLayoutEffect(() => {
    return onSnapshot(query(collection(db, 'reels'),
      where('user.id', '==', user?.uid), limit(reelsLimit)),
      snapshot => setReels(
        snapshot?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        }))
      )
    )
  }, [reelsLimit, db])

  const getReels = async () => {
    const queryReels = await getDocs(query(collection(db, 'reels'), where('user.id', '==', user?.uid), limit(reelsLimit)))

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
            <ActivityIndicator size='large' color={color.black} />
          </View> :
          <FlatList
            data={reels}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            style={pReels.container}
            onEndReached={() => {
              setLimit(reelsLimit + 4)
              getReels()
            }}
            ListFooterComponent={() => <View style={pReels.listFooterComponent} />}
            renderItem={({ item: reel }) => (
              <Pressable
                onPress={() => navigation.navigate('ViewReel', { reel })}
                onLongPress={() => navigation.navigate('ReelsOption', { reel })}
                delayLongPress={500}
                style={pReels.reelsList}
              >
                <Image source={{ uri: reel?.thumbnail }} style={pReels.reelsThumb} />

                <View style={{ flex: 1 }}>
                  <OymoFont message={reel?.description} lines={1} fontStyle={pReels.desctiption} />
                  <OymoFont message={`Video - ${profile?.username}`} lines={1} fontStyle={pReels.username} />

                  <View style={pReels.statsContainer}>
                    <View style={pReels.statsContainerRow}>
                      <OymoFont message={reel?.likesCount} lines={1} fontStyle={pReels.reelsCount} />
                      <Text style={pReels.reelsCountText}>
                        {reel?.likesCount == 1 ? 'Like' : 'Likes'}
                      </Text>
                    </View>
                    <View style={pReels.statsContainerRow}>
                      <OymoFont message={reel?.commentsCount} lines={1} fontStyle={pReels.reelsCount} />
                      <Text style={pReels.reelsCountText}>
                        {reel?.commentsCount == 1 ? 'Comment' : 'Comments'}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            )}
          />
      }
    </>
  )
}

export default Reels
// in use