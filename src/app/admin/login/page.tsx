'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === 'admin1234') {
      // Set a simple cookie (in a real app, use a secure token)
      document.cookie = "admin_session=true; path=/; max-age=86400"
      router.push('/admin/dashboard')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <Card className="w-full max-w-md brutal-card">
        <CardHeader>
          <CardTitle className="text-3xl font-black italic">ADMIN_LOGIN</CardTitle>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="font-bold">USERNAME</label>
              <Input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="brutal-border rounded-none bg-black"
                placeholder="admin"
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold">PASSWORD</label>
              <Input 
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="brutal-border rounded-none bg-black"
                placeholder="********"
              />
            </div>
            {error && <p className="text-red-500 font-bold">{error}</p>}
          </CardContent>
          <CardFooter>
            <button type="submit" className="brutal-btn w-full">LOGIN</button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
