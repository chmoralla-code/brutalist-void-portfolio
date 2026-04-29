'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    const session = document.cookie.split('; ').find(row => row.startsWith('admin_session='))
    if (session) {
      router.push('/admin/dashboard')
    } else {
      router.push('/admin/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-black text-2xl italic">
      REDIRECTING_TO_ADMIN...
    </div>
  )
}
