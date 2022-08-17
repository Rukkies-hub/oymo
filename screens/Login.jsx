import { View, Text } from 'react-native'
import React from 'react'

import color from '../color'

import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../features/userSlice'

const Login = () => {
  const count = useSelector(state => state.user.value)
  const name = useSelector(state => state.user.name)
  const dispatch = useDispatch()

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.white,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text>Login {name}</Text>
    </View>
  )
}

export default Login