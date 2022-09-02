import { Dimensions, StyleSheet } from "react-native"
import color from "./color"

const { width } = Dimensions.get('window')

export const chat = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },

  setupContainr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  setupTitle: {
    fontSize: 20,
    marginBottom: 20
  },

  setupTitleSub: {
    color: color.dark
  },

  setupButton: {
    width: '100%',
    height: 40,
    backgroundColor: color.red,
    marginTop: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },

  setupButtonText: {
    color: color.white
  },

  chatListFlatList: {
    flex: 1,
    height: 70,
    paddingHorizontal: 5
  },

  chatListFlatListLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  chatRow: {
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: color.white,
    borderRadius: 12,
    paddingHorizontal: 5
  },

  chatRowView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50
  },

  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.offWhite
  },

  unreadMessageView: {
    backgroundColor: color.red,
    paddingHorizontal: 5,
    borderRadius: 50,
    position: 'absolute',
    right: 0,
    bottom: 0
  },

  unreadMessageViewText: {
    color: color.white,
    fontSize: 12
  },

  chatInfoView: {
    marginLeft: 10,
    flex: 1
  },

  username: {
    fontSize: 16,
    color: color.dark
  },

  lastMessage: {
    fontSize: 12,
    color: color.dark,
    fontFamily: 'text'
  },

  searchView: {
    height: 40,
    backgroundColor: color.offWhite,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    paddingHorizontal: 10
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'text',
    color: color.dark
  }
})