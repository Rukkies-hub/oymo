import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from 'react-native'

import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { useNavigation } from '@react-navigation/native'


import Header from '../../../components/Header'
import { db } from '../../../hooks/firebase'

import color from '../../../style/color'
import { useSelector } from 'react-redux'
import { ps } from '../../../style/passion'
import OymoFont from '../../../components/OymoFont'

const passionList = [
  'karaoke',
  'cycling',
  'swimming',
  'cat lover',
  'dog lover',
  'environmentalism',
  'running',
  'outdoors',
  'trivia',
  'grap a drink',
  'museum',
  'gammer',
  'soccer',
  'netflix',
  'sports',
  'working out',
  'comedy',
  'spirituality',
  'board games',
  'cooking',
  'wine',
  'foodie',
  'hiking',
  'politics',
  'writer',
  'travel',
  'golf',
  'reading',
  'movies',
  'athlete',
  'baking',
  'plant-based',
  'vlogging',
  'gardening',
  'fishing',
  'art',
  'brunch',
  'climbing',
  'tea',
  'walking',
  'blogging',
  'volunteering',
  'astrology',
  'yoga',
  'instagram',
  'language exchange',
  'surfing',
  'craft beer',
  'shopping',
  'DIY',
  'dancing',
  'disney',
  'fashion',
  'music',
  'photography',
  'picnicking',
  'coffie'
]

const Passion = () => {
  const navigation = useNavigation()
  const { profile, user, theme } = useSelector(state => state.user)

  let id = user?.uid == undefined ? user?.user?.uid : user?.uid

  const [passionsLoading, setPassionLoading] = useState(false)
  const [passions, setPassions] = useState(profile?.passions == undefined ? [] : profile?.passions)

  const updateIntrests = async () => {
    if (passions?.length >= 3) {
      setPassionLoading(true)

      await updateDoc(doc(db, 'users', id), { passions })
      setPassionLoading(false)
      navigation.goBack()
    }
  }

  return (
    <SafeAreaView style={[ps.container, { backgroundColor: theme ? color.dark : color.white }]}>
      <Header showBack showTitle title='Select Hobbies' />

      <OymoFont
        message="Select hobbies that you'd like to share with the people you connect with. Choose a minimum of 3."
        fontStyle={{ ...ps.headText, color: theme ? color.white : color.dark }}
      />

      <View style={ps.infoView}>
        <OymoFont message='Edit Hobbies' fontStyle={{ ...ps.titleText, color: theme ? color.white : color.dark }} />
        {
          passions?.length > 0 &&
          <OymoFont message={`${passions?.length}/5`} fontStyle={{ ...ps.passionCount, color: theme ? color.white : color.dark }} />
        }
      </View>

      <View style={ps.scrollViewContainer}>
        <ScrollView style={ps.scrollView} showsVerticalScrollIndicator={false}>
          <View style={ps.passionsContainerView}>
            {
              passionList?.map((passion, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (passions?.includes(passion)) setPassions(passions?.filter(item => item !== passion))
                      else if (passions?.length <= 4) setPassions(oldArray => [...oldArray, passion])
                    }}
                    style={[ps.passionButton, { borderColor: passions?.includes(passion) ? color.red : (theme ? color.lightBorderColor : color.borderColor) }]}
                  >
                    <Text style={[ps.passion, { color: passions?.includes(passion) ? color.red : (theme ? color.white : color.lightText) }]}>
                      {passion}
                    </Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </ScrollView>

        <TouchableOpacity
          disabled={passions?.length < 3}
          onPress={updateIntrests}
          style={[ps.updateButton, { backgroundColor: passions?.length >= 3 ? color.red : color.lightText }]}
        >
          {
            passionsLoading ?
              <ActivityIndicator size='small' color={color.white} /> :
              <OymoFont message='Set hobbies' fontStyle={ps.updateButtonText} />
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Passion
// in use