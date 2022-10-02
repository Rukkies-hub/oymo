import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import React from 'react'
import { dob } from '../../../style/dob'
import { useNavigation } from '@react-navigation/native'
import OymoFont from '../../../components/OymoFont'
import { useState } from 'react'
import color from '../../../style/color'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../hooks/firebase'
import { useSelector } from 'react-redux'

const days = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']

const months = [
  { id: 1, name: 'January' },
  { id: 2, name: 'February' },
  { id: 3, name: 'March' },
  { id: 4, name: 'April' },
  { id: 5, name: 'May' },
  { id: 6, name: 'June' },
  { id: 7, name: 'July' },
  { id: 8, name: 'August' },
  { id: 9, name: 'September' },
  { id: 10, name: 'October' },
  { id: 11, name: 'November' },
  { id: 12, name: 'December' },
]

const years = [2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990, 1989, 1988, 1987, 1986, 1985, 1984, 1983, 1982, 1981, 1980, 1979, 1978, 1977, 1976, 1975, 1974, 1973, 1972, 1971, 1970, 1969, 1968, 1967, 1966, 1965, 1964, 1963, 1962, 1961, 1960, 1959, 1958, 1957, 1956, 1955, 1954]

const DOB = () => {
  const navigation = useNavigation()
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [loading, setLoading] = useState(false)

  const { user } = useSelector(state => state.user)
  
  const id = user?.uid == undefined ? user?.user?.uid : user?.uid

  const saveDOB = async () => {
    function getAge (dateString) {
      var today = new Date();
      var birthDate = new Date(dateString);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }

    setLoading(true)
    await updateDoc(doc(db, 'users', id), {
      dob: `${day}/${month}/${year}`,
      age: getAge(`${day}/${month}/${year}`)
    })
    setLoading(false)
    navigation.goBack()
  }

  return (
    <View style={dob.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={dob.goBackButton} />

      <View style={dob.sheet}>
        <OymoFont message='Warning!!!' fontFamily='montserrat_bold' fontStyle={dob.warning} />

        <OymoFont
          message='You only have one chance to set this information'
          fontFamily='montserrat_bold'
          fontStyle={dob.caption}
        />
        <OymoFont
          message={`${day || 'dd'}/${month || 'mm'}/${year || 'yyyy'}`}
          fontFamily='montserrat_bold'
          fontStyle={dob.mainDate}
        />

        <View style={dob.calender}>
          <FlatList
            data={days}
            keyExtractor={item => parseInt(item)}
            style={dob.tray}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity onPress={() => setDay(item)}>
                  <OymoFont message={item} fontStyle={dob.text} />
                </TouchableOpacity>
              )
            }}
          />
          <FlatList
            data={months}
            keyExtractor={item => item.id}
            style={dob.tray}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity onPress={() => setMonth(item.id)}>
                  <OymoFont message={item.name} fontStyle={dob.text} />
                </TouchableOpacity>
              )
            }}
          />
          <FlatList
            data={years}
            keyExtractor={item => item}
            style={dob.tray}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity onPress={() => setYear(item)}>
                  <OymoFont message={item} fontStyle={dob.text} />
                </TouchableOpacity>
              )
            }}
          />
        </View>
        <TouchableOpacity style={dob.upload} onPress={saveDOB}>
          {
            loading ?
              <ActivityIndicator size='small' color={color.white} /> :
              <OymoFont message='Save birth date' fontStyle={dob.uploadText} />
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default DOB