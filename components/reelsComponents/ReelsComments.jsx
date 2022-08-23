import React, { useEffect, useLayoutEffect, useState } from 'react'

import {
  View,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
  Dimensions,
  TouchableOpacity
} from 'react-native'

import { collection, onSnapshot } from 'firebase/firestore'

import { db } from '../../hooks/firebase'

import color from '../../style/color'
import { useFonts } from 'expo-font'

import { useNavigation, useRoute } from '@react-navigation/native'
import { Octicons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { _comments } from '../../style/reelsComment'
import UserAvatar from './components/UserAvatar'
import UserInfo from './components/UserInfo'
import OymoFont from '../OymoFont'
import LikeReelsComment from './LikeReelsComment'

const { width } = Dimensions.get('window')

const ReelsComments = ({ reel, background }) => {
  const { user } = useSelector(state => state.user)
  const route = useRoute()
  const navigation = useNavigation()

  const [comments, setComments] = useState([])

  useLayoutEffect(() => {
    const unsub = (() => {
      onSnapshot(collection(db, 'reels', reel?.id, 'comments'),
        snapshot =>
          setComments(
            snapshot?.docs?.map(doc => ({
              id: doc?.id,
              ...doc?.data()
            }))
          )
      )
    })()
    return unsub
  }, [user])

  const [loaded] = useFonts({
    text: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Medium.ttf'),
    boldText: require('../../assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf')
  })

  if (!loaded) return null

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <FlatList
        data={comments}
        keyExtractor={item => item?.id}
        showsVerticalScrollIndicator={false}
        style={_comments.flatList}
        renderItem={({ item: comment }) =>
          <View style={_comments.flatListRenderItem}>
            <UserAvatar _user={comment?.user?.id} />

            <View style={_comments.commentContainer}>
              <View style={_comments.commentShell}>
                <UserInfo _user={comment?.user?.id} />

                <OymoFont message={comment?.comment} fontStyle={_comments.comment} />
              </View>

              <View style={_comments.commentBottom}>
                <View style={_comments.commentActions}>
                  <LikeReelsComment comment={comment} reelId={reel?.id} />
                </View>
              </View>
            </View>
          </View>
        }
      />
    </TouchableWithoutFeedback>
  )
}

export default ReelsComments