import { StyleSheet } from 'react-native'
import color from './color'

export const profile = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },

  profileDetailes: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10
  },

  navigationView: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  navigationViewButtons: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 100
  },

  blurView: {
    width: 80,
    height: 80,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.offWhite
  },

  userInfoContainer: {
    flex: 1,
    paddingLeft: 20,
    justifyContent: 'center'
  },

  userInfo: {
    justifyContent: 'center',
    alignItems: 'flex-start'
  },

  userInfoStatsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },

  userInfoStats: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginRight: 20
  },

  controlesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 10,
    marginTop: 10
  },

  username: {
    color: color.dark,
    fontSize: 25
  },

  editProfileButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 10
  },

  matchButton: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },

  aboutContainer: {
    marginTop: 10,
    paddingHorizontal: 10
  },

  about: {
    fontSize: 16,
    color: color.dark
  },

  passionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
    paddingHorizontal: 10
  },

  passions: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: color.faintWhite,
    borderRadius: 100,
    marginBottom: 10,
    marginRight: 5
  },

  passion: {
    color: color.dark,
    fontSize: 12,
    textTransform: 'capitalize'
  },

  infoListContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 12
  },

  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden'
  },

  infoList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10
  },

  title: {
    fontSize: 14,
    color: color.dark,
    marginLeft: 5
  },

  info: {
    fontSize: 14,
    color: color.dark,
    marginLeft: 5
  },

  title: {
    fontSize: 14,
    color: color.dark
  },

  info: {
    fontSize: 14,
    color: color.dark,
    marginLeft: 5
  }
})