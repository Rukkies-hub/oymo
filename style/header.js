import { StyleSheet } from "react-native"
import color from "./color"

export const header = StyleSheet.create({
  container: {
    height: 50,
    marginTop: 40,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },

  logo: {
    fontSize: 30,
    margin: 0,
    marginTop: -10,
    color: color.black
  },

  placeholderImage: {
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },

  profileImageButton: {
    minWidth: 35,
    minHeight: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  },

  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 50
  },

  showMatchAvatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10
  },

  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },

  showPhone: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },

  notificationButton: {
    width: 40,
    height: 40,
    backgroundColor: color.offWhite,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 10
  },

  notificationCountView: {
    borderRadius: 50,
    backgroundColor: color.red,
    paddingHorizontal: 5,
    position: 'absolute',
    top: 0,
    right: 0
  },

  notificationCountText: {
    color: color.white,
    fontSize: 10
  },

  showMessageOptions: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },

  showTitle: {
    fontSize: 18,
    textTransform: 'capitalize',
    color: color.dark
  }
})