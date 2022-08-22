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

  subContainer1: {
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
  }
})