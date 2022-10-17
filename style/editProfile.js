import { Dimensions, StyleSheet } from 'react-native'
import color from './color'

const { width } = Dimensions.get('window')

export const editProfile = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },

  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 20
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 100
  },

  placeholderAvatar: {
    width: 80,
    height: 80,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.offWhite
  },

  profileInfoContainer: {
    flex: 1,
    paddingLeft: 20,
    justifyContent: 'center'
  },

  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  username: {
    fontSize: 20,
    color: color.dark
  },

  pickImage: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.offWhite,
    borderRadius: 12,
    marginLeft: 10
  },

  inputContainer: {
    marginTop: 40,
    paddingHorizontal: 10
  },

  input: {
    backgroundColor: color.offWhite,
    paddingHorizontal: 10,
    borderRadius: 12,
    height: 45,
    marginBottom: 20,
    color: color.dark
  },

  aboutContainer: {
    minHeight: 45,
    marginTop: 20
  },

  aboutText: {
    color: color.red,
    marginBottom: 10
  },

  genderButton: {
    backgroundColor: color.red,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },

  genderText: { color: color.white },

  passionButton: {
    minHeight: 45,
    marginTop: 10
  },

  passionsText: { color: color.red },

  passionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: 12,
    height: 45,
    marginBottom: 20,
    marginTop: 10
  },

  passions: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: color.offWhite,
    borderRadius: 100,
    marginBottom: 10,
    marginRight: 10
  },

  passion: {
    color: color.lightText,
    fontSize: 12,
    textTransform: 'capitalize'
  },

  updateButton: {
    flex: 1,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    height: 50
  },

  updateButtonText: { color: color.white },

  logoutButton: {
    flex: 1,
    marginTop: 30,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.offWhite,
    borderRadius: 12,
    height: 50
  },

  logoutButtonText: {
    color: color.red,
    marginLeft: 10
  },

  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 50
  },

  logo: {
    width: 50,
    height: 50
  },

  version: {
    color: color.lightText,
    fontFamily: 'text',
    fontSize: 18,
    marginLeft: 10
  },

  saveAfatarContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: color.white
  },

  autoHeightImage: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12
  },

  controlersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
  },

  cancelButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderColor: color.borderColor,
    borderWidth: 1,
    borderRadius: 8,
    height: 45,
    marginRight: 5
  },

  cancelButtonText: { color: color.dark },

  savebutton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: color.red,
    borderRadius: 8,
    height: 45,
    marginLeft: 5
  },

  savebuttonText: {
    fontFamily: 'text',
    marginLeft: 10,
    color: color.white
  },

  goPro: {
    flex: 1,
    height: 50,
    backgroundColor: color.offWhite,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },

  star: {
    width: 30,
    height: 30
  },

  upgradeButtonText: {
    color: color.black,
    marginLeft: 10
  }
})

export const theme = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },

  button: {
    flex: 1,
    height: 70,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.offWhite,
    marginRight: 5,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },

  overlayView: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.red,
    marginRight: 10,
    borderRadius: 100,
    position: 'absolute',
    top: -30,
    left: -30,
    paddingTop: 20,
    paddingLeft: 20
  }
})

export const gender = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.faintBlack,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },

  goBackButton: {
    flex: 1,
    width: '100%'
  },

  sheet: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    backgroundColor: color.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },

  warning: {
    color: color.red,
    fontSize: 30
  },

  caption: {
    marginTop: 10,
    color: color.dark
  },

  maleButton: {
    height: 50,
    backgroundColor: color.red,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10
  },

  buttonText: {
    color: color.white,
    fontSize: 18,
    marginLeft: 10
  },

  femaleButton: {
    height: 50,
    backgroundColor: color.darkBlue,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10
  }
})