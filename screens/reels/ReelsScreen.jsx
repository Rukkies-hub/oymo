import React, { useState, useRef, useCallback } from 'react'
import { View, FlatList, TouchableOpacity, ImageBackground, RefreshControl } from 'react-native'

import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

import color from '../../style/color'
import ReelsSingle from './components/ReelsSingle'

import { FontAwesome } from '@expo/vector-icons'

import { LinearGradient } from 'expo-linear-gradient'

import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { reels } from '../../style/reels'

import LikeReels from '../../components/reelsComponents/LikeReels'
import UserInfo from './components/UserInfo'
import OymoFont from '../../components/OymoFont'
import UserAvatar from './components/UserAvatar'
import { setReels, setReelsLimit, setReelsProps } from '../../features/reelsSlice'
import { useLayoutEffect } from 'react'

const wait = timeout =>
  new Promise(resolve => setTimeout(resolve, timeout))


const ReelsScreen = () => {
  const { user, profile, theme } = useSelector(state => state.user)
  const { reelsList, reelsLimit } = useSelector(state => state.reels)
  const mediaRefs = useRef([])

  const dispatch = useDispatch()

  const [refreshing, setRefreshing] = useState(false)

  const navigation = useNavigation()

  const onViewableItemsChanged = useRef(({ changed }) => {
    changed?.forEach(element => {
      const cell = mediaRefs?.current[element?.key]
      if (cell) {
        if (element?.isViewable) {
          cell?.play()
        } else {
          cell?.stop()
        }
      }
    })
  })

  const getReels = async () => {
    const queryReels = await getDocs(query(collection(db, 'reels'), limit(reelsLimit), orderBy('timestamp', 'desc')))

    dispatch(
      setReels(
        queryReels?.docs?.map(doc => ({
          id: doc?.id,
          ...doc?.data()
        }))
      )
    )
  }

  useLayoutEffect(() => {
    getReels()
  }, [user])



  const onRefresh = useCallback(() => {
    setRefreshing(true)
    wait(2000).then(() => {
      getReels()
      setRefreshing(false)
    })
  }, [])

  const disabled = () => navigation.navigate('SetupModal')

  const renderItem = ({ item, index }) => {
    return (
      <ImageBackground
        source={{ uri: item?.thumbnail }}
        resizeMode='cover'
        blurRadius={50}
        style={[
          reels.videoContainer,
          index % 2 ? reels.videoContainer :
            reels.videoContainer
        ]}
      >
        <ReelsSingle item={item} ref={ReelSingleRef => (mediaRefs.current[item?.id] = ReelSingleRef)} />

        {
          profile &&
          <View style={reels.controlersContainer}>
            <UserAvatar reel={item} _user={item?.user?.id} />

            <View style={reels.controleButtonContainer}>
              <LikeReels reel={item} />

              <TouchableOpacity
                onPress={() => {
                  profile ? dispatch(setReelsProps(item)) : null
                  profile ? navigation.navigate('ReelsComment', { item }) : disabled()
                }}
                style={reels.commentsButton}
              >
                <FontAwesome name='comment' size={24} color={color.white} />
                <OymoFont message={item?.commentsCount ? item?.commentsCount : '0'} fontStyle={reels.commentsCount} />
              </TouchableOpacity>
            </View>
          </View>
        }

        <LinearGradient colors={['transparent', color.lightText]} style={reels.gradientContainer}>
          <View style={reels.captionContainer}>
            <UserInfo _user={item?.user?.id} />

            {
              item?.description != '' &&
              <OymoFont
                message={item?.description}
                fontStyle={reels.videoDescription}
                fontFamily='montserrat_light'
              />
            }
          </View>
        </LinearGradient>
      </ImageBackground>
    )
  }

  return (
    <View style={[reels.container, {backgroundColor: theme ? color.dark : color.white}]}>
      <FlatList
        data={reelsList}
        windowSize={2}
        initialNumToRender={0}
        maxToRenderPerBatch={1}
        removeClippedSubviews
        viewabilityConfig={{ itemVisiblePercentThreshold: 95 }}
        renderItem={renderItem}
        pagingEnabled
        keyExtractor={item => item?.id}
        decelerationRate={'normal'}
        onViewableItemsChanged={onViewableItemsChanged?.current}
        showsVerticalScrollIndicator={false}
        vertical={true}
        scrollEnabled={true}
        style={{ flex: 1 }}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              dispatch(setReelsLimit(10))
              onRefresh()
            }}
          />
        }
        onEndReached={() => {
          if (reelsList?.length <= 10) return
          dispatch(setReelsLimit(reelsLimit + 3))
          getReels()
        }}
      />
    </View>
  )
}

export default ReelsScreen