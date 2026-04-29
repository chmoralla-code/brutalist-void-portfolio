'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Client-side auth check
    const session = document.cookie.split('; ').find(row => row.startsWith('admin_session='))
    if (!session) {
      router.push('/admin/login')
      return
    }
    fetchData()
  }, [router])

  const fetchData = async () => {
    setLoading(true)
    const { data: proj } = await supabase.from('projects').select('*').order('order_index')
    const { data: sk } = await supabase.from('skills').select('*').order('order_index')
    const { data: cont } = await supabase.from('portfolio_content').select('*')
    
    if (proj) setProjects(proj)
    if (sk) setSkills(sk)
    if (cont) setContent(cont)
    setLoading(false)
  }

  const handleUpdateContent = async (key: string, value: string) => {
    const { error } = await supabase
      .from('portfolio_content')
      .upsert({ key, value }, { onConflict: 'key' })
    if (!error) fetchData()
  }

  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newProject = {
      title: formData.get('title'),
      description: formData.get('description'),
      link: formData.get('link'),
      github_link: formData.get('github_link'),
      tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()),
    }
    const { error } = await supabase.from('projects').insert([newProject])
    if (!error) {
      fetchData()
      e.currentTarget.reset()
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-5xl font-black mb-8 italic tracking-tighter">DASHBOARD</h1>
      
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="bg-black border-2 border-white rounded-none p-0 mb-8 h-auto flex flex-wrap">
          <TabsTrigger value="content" className="rounded-none px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-black font-bold">CONTENT</TabsTrigger>
          <TabsTrigger value="projects" className="rounded-none px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-black font-bold">PROJECTS</TabsTrigger>
          <TabsTrigger value="skills" className="rounded-none px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-black font-bold">SKILLS</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card className="brutal-card">
            <CardHeader><CardTitle>GENERAL INFO</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="font-bold">NAME</label>
                <Input 
                  defaultValue={content.find(c => c.key === 'name')?.value || ''} 
                  onBlur={(e) => handleUpdateContent('name', e.target.value)}
                  className="bg-black border-2 border-white rounded-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold">TITLE</label>
                <Input 
                  defaultValue={content.find(c => c.key === 'title')?.value || ''} 
                  onBlur={(e) => handleUpdateContent('title', e.target.value)}
                  className="bg-black border-2 border-white rounded-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold">BIO</label>
                <Textarea 
                  defaultValue={content.find(c => c.key === 'bio')?.value || ''} 
                  onBlur={(e) => handleUpdateContent('bio', e.target.value)}
                  className="bg-black border-2 border-white rounded-none min-h-[150px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="brutal-card">
              <CardHeader><CardTitle>ADD NEW PROJECT</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleAddProject} className="space-y-4">
                  <Input name="title" placeholder="TITLE" className="bg-black border-2 border-white rounded-none" required />
                  <Textarea name="description" placeholder="DESCRIPTION" className="bg-black border-2 border-white rounded-none" />
                  <Input name="link" placeholder="LIVE LINK" className="bg-black border-2 border-white rounded-none" />
                  <Input name="github_link" placeholder="GITHUB LINK" className="bg-black border-2 border-white rounded-none" />
                  <Input name="tags" placeholder="TAGS (comma separated)" className="bg-black border-2 border-white rounded-none" />
                  <button type="submit" className="brutal-btn w-full">ADD PROJECT</button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-2xl font-black italic">CURRENT_PROJECTS</h3>
              {projects.map((p) => (
                <div key={p.id} className="brutal-card flex justify-between items-center">
                  <span className="font-bold uppercase">{p.title}</span>
                  <button 
                    onClick={async () => {
                      await supabase.from('projects').delete().eq('id', p.id)
                      fetchData()
                    }}
                    className="text-red-500 font-bold hover:underline"
                  >
                    DELETE
                  </button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="skills">
           <Card className="brutal-card max-w-xl">
              <CardHeader><CardTitle>ADD SKILL</CardTitle></CardHeader>
              <CardContent>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    await supabase.from('skills').insert([{ name: formData.get('name') }])
                    fetchData()
                    e.currentTarget.reset()
                  }} 
                  className="flex gap-4"
                >
                  <Input name="name" placeholder="SKILL NAME" className="bg-black border-2 border-white rounded-none" required />
                  <button type="submit" className="brutal-btn whitespace-nowrap">ADD</button>
                </form>
                <div className="mt-8 flex flex-wrap gap-4">
                  {skills.map(s => (
                    <div key={s.id} className="brutal-border px-4 py-2 flex items-center gap-4">
                      <span className="font-bold">{s.name}</span>
                      <button onClick={async () => {
                        await supabase.from('skills').delete().eq('id', s.id)
                        fetchData()
                      }} className="text-red-500">×</button>
                    </div>
                  ))}
                </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
