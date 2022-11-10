import React, { useState } from 'react'
import { View, TouchableOpacity, ScrollView } from 'react-native'

import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { mo } from '../../../style/messageOptions'
import color from '../../../style/color'
import getMatchedUserInfo from '../../../lib/getMatchedUserInfo'
import UserAvatar from './UserAvatar'
import UserInfo from './UserInfo'
import OymoFont from '../../../components/OymoFont'
import SelectDropdown from 'react-native-select-dropdown'
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { admin } from '@env'
import * as NavigationBar from 'expo-navigation-bar'
import { FontAwesome5 } from '@expo/vector-icons'

const ChatOptions = () => {
  const { messages, matchDetails } = useRoute().params
  const { user, theme, profile } = useSelector(state => state.user)

  const [coin, setCoin] = useState(null)

  const navigation = useNavigation()
  const focused = useIsFocused()

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  if (focused) {
    NavigationBar.setBackgroundColorAsync(theme ? color.dark : color.white)
    NavigationBar.setButtonStyleAsync(theme ? 'light' : 'dark')
  }

  const sendCoin = async () => {
    if (profile?.coins < 5) return
    if (profile?.coins < coin) return

    await addDoc(collection(db, 'matches', matchDetails?.id, 'messages'), {
      timestamp: serverTimestamp(),
      userId: id,
      message: `You just shared ${coin} coins`,
      coin,
      seen: false
    })
    await updateDoc(doc(db, 'matches', matchDetails?.id), {
      timestamp: serverTimestamp()
    })
    await updateDoc(doc(db, 'users', id), { coins: increment(-(5 + coin)) })
    await updateDoc(doc(db, 'users', getMatchedUserInfo(matchDetails?.users, id)?.id), { coins: increment(coin) })
    await updateDoc(doc(db, 'admin', admin), { messages: increment(1) })
    setCoin(null)
    navigation.goBack()
  }

  return (
    <View style={mo.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={mo.goBack} />

      <ScrollView style={[mo.optionsView, { backgroundColor: theme ? color.dark : color.white }]}>
        <View style={mo.userDetails}>
          <UserAvatar _user={getMatchedUserInfo(matchDetails?.users, id)?.id} />
          <UserInfo _user={getMatchedUserInfo(matchDetails?.users, id)?.id} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <SelectDropdown
            data={[10, 20, 50, 100, 250, 500, 750, 1000, 1500, 2000]}
            onSelect={(selectedItem, index) => setCoin(selectedItem)}
            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
            rowTextForSelection={(item, index) => item}
            defaultButtonText='Share coins'
            buttonStyle={{
              flex: 1,
              height: 50,
              width: '100%',
              borderRadius: 12,
              backgroundColor: theme ? color.lightText : color.offWhite,
              padding: 0,
              flexDirection: 'row',
              justifyContent: 'flex-start'
            }}
            buttonTextStyle={{
              color: theme ? color.white : color.dark,
              fontFamily: 'text',
              fontSize: 12,
              textAlign: 'left',
              marginLeft: 8
            }}
            dropdownStyle={{
              overflow: 'hidden',
              borderRadius: 12
            }}
            dropdownOverlayColor={color.transparent}
            rowStyle={{ backgroundColor: color.white }}
            rowTextStyle={{
              textAlign: 'left',
              marginLeft: 10
            }}
            selectedRowStyle={{ backgroundColor: color.red }}
            selectedRowTextStyle={{ color: color.white }}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={sendCoin}
            style={[mo.replyButton, { marginLeft: 20, backgroundColor: color.red }]}
          >
            <FontAwesome5 name='paper-plane' color={color.white} size={20} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default ChatOptions