import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useLayoutEffect } from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { setMatches, setMatchesFilter } from '../../../features/chatSlice'
import { db } from '../../../hooks/firebase'
import { chat } from '../../../style/chat'
import color from '../../../style/color'
import ChatRow from './chatRow/ChatRow'

const ChatList = () => {
  const { user, profile } = useSelector(state => state.user)
  const { matches, matchesFilter } = useSelector(state => state.chat)
  const dispatch = useDispatch()

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  useEffect(() => {
    return () => {
      fetchMatches()
    }
  }, [])

  useLayoutEffect(() =>
    fetchMatches()
    , [user, db])

  const fetchMatches = () => {
    const unsub = onSnapshot(query(collection(db, 'matches'),
      where('usersMatched', 'array-contains', id),
      orderBy('timestamp', 'desc')
    ),
      snapshot => {
        dispatch(setMatches(
          snapshot?.docs?.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))
        ))

        dispatch(setMatchesFilter(
          snapshot?.docs?.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))
        ))
      })
    return unsub
  }

  return (
    matches?.length > 0 ? (
      <FlatList
        data={matchesFilter}
        keyExtractor={item => item?.id}
        style={chat.chatListFlatList}
        renderItem={({ item }) => <ChatRow matchDetails={item} />}
      />
    ) : (
      <View style={chat.chatListFlatListLoadingContainer}>
        <ActivityIndicator color={color.black} size='large' />
      </View>
    )
  )
}

export default ChatList