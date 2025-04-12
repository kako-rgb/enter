'use client'

import { useSession } from 'next-auth/react'

export default function useClientUser() {
    const { data: session, status } = useSession()
    const loading = status === 'loading'
    
    if (loading) return null
    
    return session?.user || null
}