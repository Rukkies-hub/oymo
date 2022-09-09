import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

export const notify = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50
  },

  username: {
    color: color.dark,
    fontSize: 14
  },

  headerView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 10
  },

  markAllAsReadButton: {
    backgroundColor: color.offWhite,
    height: 35,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },

  clearAllButton: {
    backgroundColor: color.offWhite,
    height: 35,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  notification: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
  },

  avatarView: {
    position: 'relative',
    marginRight: 10
  },

  notificationTypeView: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    borderRadius: 50,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },

  activityTxt: {
    color: color.dark,
    marginLeft: 6,
    fontSize: 14
  },

  date: {
    color: color.red,
    marginTop: 3
  },

  hiddenContolersView: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
  },

  markAsReadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    bottom: 0,
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: color.offWhite,
    right: 80,
  },

  deleteNotification: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    bottom: 0,
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: color.offWhite,
    right: 20,
  }
})