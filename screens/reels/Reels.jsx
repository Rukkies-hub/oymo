import React, { useState, useEffect, useRef } from 'react'
import { View, Text, SafeAreaView, FlatList, Dimensions, TouchableOpacity, Image, ImageBackground, RefreshControl } from 'react-native'

import { arrayRemove, arrayUnion, collection, doc, getDocs, limit, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { db } from '../../hooks/firebase'

import color from '../../style/color'
import ReelsSingle from './components/ReelsSingle'

const { width, height } = Dimensions.get('window')

import { AntDesign, FontAwesome } from '@expo/vector-icons'

import { useFonts } from 'expo-font'

import { LinearGradient } from 'expo-linear-gradient'

import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { reels } from '../../style/reels'

import LikeReels from '../../components/reelsComponents/LikeReels'
import UserInfo from './components/UserInfo'
import OymoFont from '../../components/OymoFont'
import UserAvatar from './components/UserAvatar'
import { setReelsProps } from '../../features/reelsSlice'

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

const Reels = () => {
  const { user, profile } = useSelector(state => state.user)
  const { reelsList } = useSelector(state => state.reels)
  const mediaRefs = useRef([])

  const dispatch = useDispatch()

  const [refreshing, setRefreshing] = useState(false)

  const navigation = useNavigation()
  const focus = useIsFocused()

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

  const onRefresh = React.useCallback(() => {
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

        <LinearGradient colors={['transparent', color.labelColor]} style={reels.gradientContainer}>
          {/* CAPTION */}
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

          {/* CONTROLS */}
          {
            profile &&
            <View style={reels.controlersContainer}>
              <UserAvatar _user={item?.user?.id} />

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
        </LinearGradient>
      </ImageBackground>
    )
  }

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <View style={reels.container}>
      <View style={reels.listContainer}>
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
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={() => {
        //       setReelsLimit(10)
        //       onRefresh()
        //     }}
        //   />
        // }
        // onEndReached={() => {
        //   if (reels?.length <= 10) return
        //   setReelsLimit(reelsLimit + 3)
        //   getReels()
        // }}
        />
      </View>
    </View>
  )
}

export default Reels