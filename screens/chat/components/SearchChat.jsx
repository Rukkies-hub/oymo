import React from 'react'
import { View, Text, TextInput } from 'react-native'

import { Entypo } from '@expo/vector-icons'
import getMatchedUserInfo from '../../../lib/getMatchedUserInfo'
import { useDispatch, useSelector } from 'react-redux'
import { setMatchesFilter, setSearch } from '../../../features/chatSlice'
import { chat } from '../../../style/chat'
import color from '../../../style/color'

const SearchChat = () => {
  const { user, profile } = useSelector(state => state.user)
  const { search, matches } = useSelector(state => state.chat)
  const dispatch = useDispatch()

  const searchFilter = text => {
    if (text) {
      const newData = matches.filter(item => {
        const itemData = getMatchedUserInfo(item?.users, user?.uid)?.username ?
          getMatchedUserInfo(item?.users, user?.uid)?.username?.toUpperCase() :
          ''.toUpperCase()

        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
      })
      dispatch(setMatchesFilter(newData))
      dispatch(setSearch(text))
    } else {
      dispatch(setMatchesFilter(matches))
      dispatch(setSearch(text))
    }
  }

  return (
    <View style={chat.searchView}>
      <Entypo name='magnifying-glass' size={24} color={color.lightText} />
      {/* <TextInput
        value={search}
        placeholder='Search'
        onChangeText={text => searchFilter(text)}
        placeholderTextColor={color.lightText}
        style={{
          flex: 1,
          marginLeft: 10,
          fontFamily: 'text',
          color: color.dark
        }}
      /> */}
    </View>
  )
}

export default SearchChat