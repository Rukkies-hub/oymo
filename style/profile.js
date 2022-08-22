import { StyleSheet } from "react-native"
import color from "./color"

export const profile = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },

  profileDetailes: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  username: {
    color: color.dark,
    fontSize: 20
  },

  displayName: {
    color: color.dark
  },

  editProfileButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    width: 40,
  },

  aboutContainer: {
    marginTop: 20,
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
    paddingHorizontal: 10
  },

  infoList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10
  },

  title: {
    fontSize: 16,
    color: color.dark,
    marginLeft: 5
  },

  info: {
    fontSize: 16,
    color: color.dark,
    marginLeft: 5
  }
})