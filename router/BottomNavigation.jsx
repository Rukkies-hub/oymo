import { View, Text, SafeAreaView, Animated, StyleSheet, Image, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Pressable, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useSelector } from 'react-redux'
import Bar from '../components/Bar'
import Header from '../components/Header'
import BottomNavigationView from './BottomNavigationView'
import { header } from '../style/header'
import color from '../style/color'
import OymoFont from '../components/OymoFont'
import { useNavigation } from '@react-navigation/native'
import { Entypo, FontAwesome, SimpleLineIcons } from '@expo/vector-icons'
import { nav } from '../style/navigation'
const { width, height } = Dimensions.get('window')
import * as NavigationBar from 'expo-navigation-bar'

const BottomNavigation = () => {
  const navigation = useNavigation()
  const { profile, theme } = useSelector(state => state.user)
  const [currentTab, setCurrentTab] = useState('Home')
  const [showMenu, setShowMenu] = useState(false)

  const offsetValue = useRef(new Animated.Value(0)).current
  const scaleValue = useRef(new Animated.Value(1)).current
  const closeButtonOffset = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (showMenu) {
      NavigationBar.setBackgroundColorAsync(color.red)
      NavigationBar.setButtonStyleAsync('light')
    } else {
      NavigationBar.setBackgroundColorAsync(theme ? color.dark : color.white)
      NavigationBar.setButtonStyleAsync(theme ? 'light' : 'dark')
    }
  }, [showMenu])

  return (
    <SafeAreaView style={nav.drawerContainer}>
      <Bar color={showMenu ? 'light' : theme ? 'light' : 'dark'} />
      <View style={nav.drawerView}>
        <View style={nav.headDetails}>
          {
            !profile?.photoURL ?
              <View style={nav.avatarPlaceholderView}>
                <FontAwesome name='user-o' size={32} color={color.black} />
              </View> :
              <TouchableWithoutFeedback onPress={() => navigation.navigate('Profile')}>
                <Image source={{ uri: profile?.photoURL }} style={nav.mainAvatar} />
              </TouchableWithoutFeedback>
          }

          {
            profile?.username != undefined &&
            <>
              <Pressable onPress={() => navigation.navigate('Profile')} style={nav.usernameButton}>
                <OymoFont message={profile?.username} lines={1} fontFamily='montserrat_bold' fontStyle={nav.username} />
                {profile?.age != undefined && <OymoFont message={profile?.age} lines={1} fontStyle={nav.age} />}
              </Pressable>
              {
                profile?.coins != undefined &&
                <Pressable onPress={() => navigation.navigate('Profile')} style={nav.pointsButton}>
                  <Image source={require('../assets/points.png')} style={nav.pointsImage} />
                  <OymoFont message={`${profile?.coins} Points`} lines={1} fontStyle={nav.coin} />
                </Pressable>
              }
            </>
          }
        </View>

        <ScrollView style={{ flexGrow: 1, marginTop: 50 }} showsVerticalScrollIndicator={false}>
          {TabButton(currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Nearby', 'Nearby')}
          {TabButton(currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Match', 'Match')}
          {TabButton(currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Reels', 'Reels')}
          {TabButton(currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Likes', 'Likes')}
          {TabButton(currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Chat', 'Chat')}

          <View style={nav.divider} />
          
          {TabButton(currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Notifications', 'Notifications')}
          {TabButton(currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Profile', 'Profile')}
          {TabButton(currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Edit profile', 'EditProfile')}
          {TabButton(currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Settings', 'Settings')}
          
          <View style={nav.divider} />

          {TabButton(currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Events', 'Events')}
          {TabButton(currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Rooms', 'Rooms')}
          {TabButton(currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Buy Coins', 'Upgrade')}
        </ScrollView>

        <View>
          {TabButton(currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Log out')}
        </View>
      </View>

      <Animated.View
        style={{
          flexGrow: 1,
          backgroundColor: 'white',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: showMenu ? 15 : 0,
          transform: [
            { scale: scaleValue },
            { translateX: offsetValue }
          ]
        }}
      >
        <Animated.View style={{
          flex: 1,
          transform: [{
            translateY: closeButtonOffset
          }]
        }}>
          <View>
            <View style={[header.container, { backgroundColor: color.transparent }]}>
              <View style={header.leftContainer}>
                <OymoFont fontStyle={{ ...header.logo, color: theme ? color.white : color.black }} fontFamily='pacifico' message='Oymo' />
              </View>

              <View style={header.rightContainer}>
                {
                  profile &&
                  <TouchableOpacity onPress={() => {
                    if (profile?.photoURL != undefined && profile?.username != undefined)
                      navigation.navigate('AddReels')
                    else
                      navigation.navigate('SetupModal')
                  }}
                    style={[header.notificationButton, { backgroundColor: theme ? color.dark : color.offWhite }]}>
                    <FontAwesome name='plus-square-o' color={theme ? color.white : color.black} size={22} />
                  </TouchableOpacity>
                }

                {
                  profile &&
                  <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={[header.notificationButton, { backgroundColor: theme ? color.dark : color.offWhite }]}>
                    <SimpleLineIcons name='bell' size={20} color={theme ? color.white : color.dark} />

                    {
                      profile?.notificationCount > 0 &&
                      <View style={header.notificationCountView}>
                        <OymoFont message={profile?.notificationCount} fontStyle={header.notificationCountText} />
                      </View>
                    }
                  </TouchableOpacity>
                }

                {
                  !profile ?
                    <TouchableOpacity
                      onPress={() => {
                        Animated.timing(scaleValue, {
                          toValue: showMenu ? 1 : 0.88,
                          duration: 100,
                          useNativeDriver: true
                        }).start()

                        Animated.timing(offsetValue, {
                          toValue: showMenu ? 0 : -(width / 1.5),
                          duration: 100,
                          useNativeDriver: true
                        }).start()

                        Animated.timing(closeButtonOffset, {
                          toValue: !showMenu ? -30 : 0,
                          duration: 100,
                          useNativeDriver: true
                        }).start()

                        setShowMenu(!showMenu)
                      }}
                    >
                      <FontAwesome name='user-o' size={22} color={theme ? color.white : color.dark} />
                    </TouchableOpacity> :
                    <TouchableOpacity
                      onPress={() => {
                        Animated.timing(scaleValue, {
                          toValue: showMenu ? 1 : 0.88,
                          duration: 100,
                          useNativeDriver: true
                        }).start()

                        Animated.timing(offsetValue, {
                          toValue: showMenu ? 0 : -(width / 1.5),
                          duration: 100,
                          useNativeDriver: true
                        }).start()

                        Animated.timing(closeButtonOffset, {
                          toValue: !showMenu ? -30 : 0,
                          duration: 100,
                          useNativeDriver: true
                        }).start()

                        setShowMenu(!showMenu)
                      }}
                    >
                      {
                        profile?.photoURL ?
                          <View style={{ position: 'relative' }}>
                            {
                              profile?.paid &&
                              <View style={nav.paidImageContainer}>
                                <Image source={require('../assets/vip.png')} style={nav.paidImage} />
                              </View>
                            }
                            <Image source={{ uri: profile?.photoURL }} style={header.profileImage} />
                          </View> :
                          <FontAwesome name='user-o' size={22} color={theme ? color.white : color.dark} />
                      }
                    </TouchableOpacity>
                }
              </View>
            </View>
          </View>
          <BottomNavigationView />
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  )
}

const TabButton = (currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, title, nav) => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={() => {
      if (title == 'Log out') { }
      else {
        navigation.navigate(nav)
        setCurrentTab(nav)
        Animated.timing(scaleValue, {
          toValue: showMenu ? 1 : 0.88,
          duration: 100,
          useNativeDriver: true
        }).start()

        Animated.timing(offsetValue, {
          toValue: showMenu ? 0 : -(width / 1.5),
          duration: 100,
          useNativeDriver: true
        }).start()

        Animated.timing(closeButtonOffset, {
          toValue: !showMenu ? -30 : 0,
          duration: 100,
          useNativeDriver: true
        }).start()
        setShowMenu(!showMenu)
      }
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: currentTab == nav ? 'white' : 'transparent',
        borderRadius: 8,
        paddingLeft: 20,
        paddingRight: 50,
        marginTop: 10
      }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold', color: currentTab == nav ? 'black' : 'white' }}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default BottomNavigation