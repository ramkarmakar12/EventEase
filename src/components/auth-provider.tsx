'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

type UserWithRole = User & {
  role?: 'ADMIN' | 'STAFF' | 'EVENT_OWNER'
}

interface AuthContextType {
  user: UserWithRole | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get additional user data from our API
          const response = await fetch(`/api/auth/user/${firebaseUser.uid}`)
          
          if (!response.ok) {
            console.error('Failed to fetch user data')
            setUser(firebaseUser)
          } else {
            const data = await response.json()
            setUser({ ...firebaseUser, role: data.role })
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth state change error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
