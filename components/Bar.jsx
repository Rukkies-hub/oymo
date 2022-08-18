import React from 'react'

import { StatusBar } from 'expo-status-bar'

const Bar = ({ color }) => {
  return (
    <StatusBar style={color} translucent={true} animated={true} />
  )
}

export default Bar
// in use