import { StyleSheet } from 'react-native'
import color from './color'

export const wc = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20
  },

  image: {
    marginHorizontal: 20
  },

  headText: {
    fontSize: 30,
    textAlign: 'center'
  },

  mainText: {
    marginTop: 20,
    textAlign: 'center'
  },

  navigationView: {
    backgroundColor: color.faintRed,
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 80,
    width: '100%',
    height: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  navigationButton: {
    backgroundColor: color.white,
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  }
})

export const login = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 50
  },

  goBack: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center'
  },

  headText: {
    fontSize: 40,
    marginTop: 20
  },

  mainText: {
    marginTop: 10,
    fontSize: 30
  },

  inputView: {
    height: 55,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: color.borderColor,
    marginTop: 30
  },

  input: {
    flex: 1,
    fontFamily: 'text',
    color: color.dark
  },

  passwordView: {
    height: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: color.borderColor,
    marginTop: 20
  },

  navigationView: {
    width: '100%',
    marginBottom: 20,
    marginTop: 80,
    alignItems: 'center'
  },

  bottomText: {
    fontFamily: 'text',
    color: color.lightText
  },

  signInButton: {
    backgroundColor: color.red,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 55,
    marginTop: 20,
    shadowColor: color.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  signInButtonText: {
    color: color.white
  }
})

export const su = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 50
  },

  goBack: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center'
  },

  headText: {
    fontSize: 40,
    marginTop: 20
  },

  mainText: {
    marginTop: 10,
    fontSize: 30
  },

  inputView: {
    height: 55,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: color.borderColor,
    marginTop: 30
  },

  input: {
    flex: 1,
    fontFamily: 'text',
    color: color.dark
  },

  passwordView: {
    height: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: color.borderColor,
    marginTop: 20
  },

  navigationView: {
    width: '100%',
    marginBottom: 20,
    marginTop: 80,
    alignItems: 'center'
  },

  bottomText: {
    fontFamily: 'text',
    color: color.lightText
  },

  signInButton: {
    backgroundColor: color.white,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 55,
    marginTop: 20,
    shadowColor: color.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
})