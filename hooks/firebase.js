import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from '@env'

const app = initializeApp({
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
})

const auth = getAuth()
const db = getFirestore()

export { auth, db, onAuthStateChanged }