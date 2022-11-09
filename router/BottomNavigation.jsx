import { View, Text, SafeAreaView, Animated, Image, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Pressable, ScrollView, ImageBackground } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Bar from '../components/Bar'
import BottomNavigationView from './BottomNavigationView'
import { header } from '../style/header'
import color from '../style/color'
import OymoFont from '../components/OymoFont'
import { useNavigation } from '@react-navigation/native'
import { AntDesign, Feather, FontAwesome, Ionicons, SimpleLineIcons } from '@expo/vector-icons'
import { nav } from '../style/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '../hooks/firebase'
import { logout, setActiveRoute, setProfile } from '../features/userSlice'
import { dw } from '../style/drawer'
const { width } = Dimensions.get('window')

const BottomNavigation = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { profile, theme, activeRoute } = useSelector(state => state.user)
  const [currentTab, setCurrentTab] = useState('Match')
  const [showMenu, setShowMenu] = useState(false)

  const offsetValue = useRef(new Animated.Value(0)).current
  const scaleValue = useRef(new Animated.Value(1)).current
  const closeButtonOffset = useRef(new Animated.Value(0)).current

  return (
    <ImageBackground source={require('../assets/app_bg.png')} blurRadius={10} style={[nav.drawerContainer, { backgroundColor: theme ? color.dark : color.white }]}>
      <Bar color={theme ? 'light' : 'dark'} />
      <View style={nav.drawerView}>
        <View style={nav.headDetails}>
          {
            !profile?.photoURL ?
              <View style={[nav.avatarPlaceholderView, { backgroundColor: theme ? color.dark : color.white }]}>
                <FontAwesome name='user-o' size={32} color={theme ? color.white : color.black} />
              </View> :
              <TouchableWithoutFeedback onPress={() => navigation.navigate('Profile')}>
                <Image source={{ uri: profile?.photoURL }} style={nav.mainAvatar} />
              </TouchableWithoutFeedback>
          }

          {
            profile?.username != undefined &&
            <>
              <Pressable onPress={() => navigation.navigate('Profile')} style={nav.usernameButton}>
                <OymoFont message={profile?.username} lines={1} fontFamily='montserrat_bold' fontStyle={{ ...nav.username, color: theme ? color.white : color.dark }} />
                {profile?.age != undefined && <OymoFont message={profile?.age} lines={1} fontStyle={{ ...nav.age, color: theme ? color.white : color.dark }} />}
              </Pressable>
              {
                profile?.coins != undefined &&
                <Pressable onPress={() => navigation.navigate('Profile')} style={nav.pointsButton}>
                  <Image source={require('../assets/points.png')} style={nav.pointsImage} />
                  <OymoFont message={`${profile?.coins} Points`} lines={1} fontStyle={{ ...nav.coin, color: theme ? color.white : color.dark }} />
                </Pressable>
              }
            </>
          }
        </View>

        <ScrollView style={{ flexGrow: 1, marginTop: 50 }} showsVerticalScrollIndicator={false}>
          {TabButton(profile, theme, dispatch, currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Nearby', 'Nearby')}
          {TabButton(profile, theme, dispatch, currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Match', 'Match')}
          {TabButton(profile, theme, dispatch, currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Reels', 'Reels')}
          {TabButton(profile, theme, dispatch, currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Likes', 'Likes')}
          {TabButton(profile, theme, dispatch, currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Chat', 'Chat')}

          <View style={[nav.divider, { backgroundColor: theme ? color.white : color.dark }]} />

          {TabButton(profile, theme, dispatch, currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Notifications', 'Notifications')}
          {TabButton(profile, theme, dispatch, currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Profile', 'Profile')}
          {TabButton(profile, theme, dispatch, currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Edit profile', 'EditProfile')}
          {TabButton(profile, theme, dispatch, currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Settings', 'Settings')}

          <View style={[nav.divider, { backgroundColor: theme ? color.white : color.dark }]} />

          {TabButton(profile, theme, dispatch, currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Events', 'Events')}
          {TabButton(profile, theme, dispatch, currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Rooms', 'Rooms')}
          {TabButton(profile, theme, dispatch, currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Buy Coins', 'Upgrade')}
        </ScrollView>

        <View>
          {TabButton(profile, theme, dispatch, currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, 'Log out')}
        </View>
      </View>

      {
        showMenu &&
        <Animated.View
          style={{
            flexGrow: 1,
            backgroundColor: color.transparent,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            borderRadius: showMenu ? 25 : 0,
            overflow: 'hidden',
            transform: [
              { scale: scaleValue },
              { translateX: offsetValue }
            ]
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: color.transparent }}
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
          />
        </Animated.View>
      }

      <Animated.View
        style={{
          flexGrow: 1,
          backgroundColor: theme ? color.dark : color.white,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: showMenu ? 25 : 0,
          transform: [
            { scale: scaleValue },
            { translateX: offsetValue }
          ],
          shadowColor: showMenu ? color.black : color.transparent,
          shadowOffset: {
            width: 0,
            height: showMenu ? 12 : 0,
          },
          shadowOpacity: showMenu ? 0.58 : 0,
          shadowRadius: showMenu ? 16.00 : 0,
          elevation: showMenu ? 24 : 0
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
                        setCurrentTab(activeRoute)

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
                        setCurrentTab(activeRoute)

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
    </ImageBackground>
  )
}

const TabButton = (profile, theme, dispatch, currentTab, setCurrentTab, setShowMenu, showMenu, scaleValue, offsetValue, closeButtonOffset, title, nav) => {
  const navigation = useNavigation()

  const logoutUser = () => {
    setShowMenu(!showMenu)
    signOut(auth)
    dispatch(logout())
    dispatch(setProfile(null))
  }

  return (
    <TouchableOpacity
      onPress={() => {
        if (title == 'Log out') {
          logoutUser()
        }
        else {
          if (nav == 'Nearby' || nav == 'Match' || nav == 'Reels' || nav == 'Likes' || nav == 'Chat') {
            dispatch(setActiveRoute(nav))
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
          } else {
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
        }
      }}>
      <View
        style={[title == 'Log out' ? {
          height: 45,
          shadowColor: color.black,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.20,
          shadowRadius: 1.41,
          elevation: 2,
          borderRadius: 8,
          backgroundColor: theme ? color.dark : color.white,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingLeft: 20
        } :
          currentTab == nav ? {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: currentTab == nav ? (theme ? color.dark : color.white) : color.transparent,
            borderRadius: 8,
            paddingLeft: 15,
            marginTop: 10,
            height: 45,
            borderRightWidth: currentTab == nav ? (theme ? 0 : 5) : 0,
            borderColor: currentTab == nav ? (theme ? color.transparent : color.red) : color.transparent,
            shadowColor: color.black,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            marginHorizontal: 5
          } : {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: currentTab == nav ? (theme ? color.dark : color.white) : color.transparent,
            borderRadius: 8,
            paddingLeft: 15,
            marginTop: 10,
            height: 45,
            borderRightWidth: currentTab == nav ? (theme ? 0 : 5) : 0,
            borderColor: currentTab == nav ? (theme ? color.transparent : color.red) : color.transparent
          }]}
      >
        {title == 'Log out' && <SimpleLineIcons name="logout" size={20} color={color.red} style={{ marginRight: 15 }} />}
        {nav == 'Nearby' && <FontAwesome name="map-marker" size={20} color={theme ? color.white : color.black} style={{ marginRight: 15 }} />}
        {nav == 'Match' && <AntDesign name='find' size={20} color={theme ? color.white : color.black} style={{ marginRight: 15 }} />}
        {nav == 'Reels' && <FontAwesome name='film' size={20} color={theme ? color.white : color.black} style={{ marginRight: 15 }} />}
        {nav == 'Likes' && <Ionicons name="heart-outline" size={22} color={theme ? color.white : color.black} style={{ marginRight: 15 }} />}
        {nav == 'Chat' && <Ionicons name='chatbubbles-outline' size={20} color={theme ? color.white : color.black} style={{ marginRight: 15 }} />}
        {/*  */}
        {nav == 'Notifications' && <SimpleLineIcons name='bell' size={20} color={theme ? color.white : color.dark} style={{ marginRight: 15 }} />}
        {nav == 'Profile' && <FontAwesome name='user-o' size={20} color={theme ? color.white : color.black} style={{ marginRight: 15 }} />}
        {nav == 'EditProfile' && <Feather name='edit' size={20} color={theme ? color.white : color.black} style={{ marginRight: 15 }} />}
        {nav == 'Settings' && <Ionicons name='cog-outline' size={20} color={theme ? color.white : color.black} style={{ marginRight: 15 }} />}
        {/*  */}
        {nav == 'Events' && <Image source={require('../assets/event.png')} style={[dw.star, { marginRight: 15 }]} />}
        {nav == 'Rooms' && <Image source={require('../assets/room.png')} style={[dw.star, { marginRight: 15 }]} />}
        {nav == 'Upgrade' && <Image source={require('../assets/room.png')} style={[dw.star, { marginRight: 15 }]} />}
        {/*  */}
        {/*  */}
        {/*  */}
        <OymoFont message={title} fontStyle={{ fontSize: 15, color: title == 'Log out' ? color.red : (currentTab == nav ? (theme ? color.white : color.dark) : (theme ? color.white : color.dark)) }} />
        {/*  */}
        <View style={{ flex: 1 }} />
        {
          (nav == 'Likes' && profile?.pendingSwipes >= 1) &&
          <View
            style={{
              height: 20,
              paddingHorizontal: profile?.pendingSwipes >= 10 ? 6 : 8,
              borderRadius: 6,
              backgroundColor: color.red,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 15
            }}
          >
            <OymoFont message={profile?.pendingSwipes >= 10 ? '9+' : profile?.pendingSwipes} fontStyle={{ color: color.white }} />
          </View>
        }
        {
          (nav == 'Notifications' && profile?.notificationCount >= 1) &&
          <View
            style={{
              height: 20,
              paddingHorizontal: profile?.notificationCount >= 10 ? 6 : 8,
              borderRadius: 6,
              backgroundColor: color.red,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 15
            }}
          >
            <OymoFont message={profile?.notificationCount >= 10 ? '9+' : profile?.notificationCount} fontStyle={{ color: color.white }} />
          </View>
        }
      </View>
    </TouchableOpacity>
  )
}

export default BottomNavigation