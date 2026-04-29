'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { Trash2, Upload, Loader2, Plus, ExternalLink } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const session = document.cookie.split('; ').find(row => row.startsWith('admin_session='))
    if (!session) {
      router.push('/admin/login')
      return
    }
    fetchData()
  }, [router])

  const fetchData = async () => {
    setLoading(true)
    const { data: proj } = await supabase.from('projects').select('*').order('order_index', { ascending: true })
    const { data: sk } = await supabase.from('skills').select('*').order('order_index', { ascending: true })
    const { data: cont } = await supabase.from('portfolio_content').select('*')
    
    if (proj) setProjects(proj)
    if (sk) setSkills(sk)
    if (cont) setContent(cont)
    setLoading(false)
  }

  const getContentValue = (key: string) => content.find(c => c.key === key)?.value || ''

  const handleUpdateContent = async (key: string, value: string) => {
    const { error } = await supabase
      .from('portfolio_content')
      .upsert({ key, value }, { onConflict: 'key' })
    if (!error) fetchData()
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, isProject = false, projectId?: string) => {
    try {
      setUploading(true)
      const file = event.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath)

      if (isProject && projectId) {
        await supabase.from('projects').update({ image_url: publicUrl }).eq('id', projectId)
      } else {
        await handleUpdateContent('hero_image', publicUrl)
      }
      
      fetchData()
    } catch (error) {
      alert('Error uploading image!')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newProject = {
      title: formData.get('title'),
      description: formData.get('description'),
      link: formData.get('link'),
      github_link: formData.get('github_link'),
      tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(t => t),
      order_index: projects.length
    }
    const { error } = await supabase.from('projects').insert([newProject])
    if (!error) {
      fetchData()
      e.currentTarget.reset()
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-black text-4xl italic">
      LOADING_DASHBOARD...
    </div>
  )

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-12">
        <h1 className="text-6xl font-black italic tracking-tighter">ADMIN_DASHBOARD</h1>
        <button 
          onClick={() => {
            document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
            router.push('/admin/login')
          }}
          className="brutal-btn py-1 px-4 text-sm"
        >
          LOGOUT
        </button>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-black border-2 border-white rounded-none p-0 mb-8 h-auto flex flex-wrap">
          <TabsTrigger value="general" className="rounded-none px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-black font-bold">GENERAL</TabsTrigger>
          <TabsTrigger value="hero" className="rounded-none px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-black font-bold">HERO</TabsTrigger>
          <TabsTrigger value="projects" className="rounded-none px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-black font-bold">PROJECTS</TabsTrigger>
          <TabsTrigger value="skills" className="rounded-none px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-black font-bold">SKILLS</TabsTrigger>
          <TabsTrigger value="footer" className="rounded-none px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-black font-bold">FOOTER</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="brutal-card">
            <CardHeader><CardTitle>IDENTITY</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="font-bold">YOUR NAME</label>
                <Input 
                  defaultValue={getContentValue('name')} 
                  onBlur={(e) => handleUpdateContent('name', e.target.value)}
                  className="bg-black border-2 border-white rounded-none h-12 text-lg"
                  placeholder="e.g. JOHN DOE"
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold">PROFESSIONAL TITLE</label>
                <Input 
                  defaultValue={getContentValue('title')} 
                  onBlur={(e) => handleUpdateContent('title', e.target.value)}
                  className="bg-black border-2 border-white rounded-none h-12 text-lg"
                  placeholder="e.g. FULLSTACK DEVELOPER"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero">
          <Card className="brutal-card">
            <CardHeader><CardTitle>HERO SECTION</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="font-bold">BIO / DESCRIPTION</label>
                <Textarea 
                  defaultValue={getContentValue('bio')} 
                  onBlur={(e) => handleUpdateContent('bio', e.target.value)}
                  className="bg-black border-2 border-white rounded-none min-h-[150px] text-lg"
                  placeholder="Tell your story..."
                />
              </div>
              <div className="space-y-4 pt-4 border-t-2 border-zinc-800">
                <label className="font-bold block uppercase">Hero Background Image</label>
                <div className="flex items-center gap-6">
                  {getContentValue('hero_image') && (
                    <img src={getContentValue('hero_image')} alt="Hero" className="w-32 h-32 object-cover border-2 border-white" />
                  )}
                  <div className="relative">
                    <input 
                      type="file" 
                      id="hero_upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e)}
                      disabled={uploading}
                    />
                    <label 
                      htmlFor="hero_upload" 
                      className="brutal-btn cursor-pointer flex items-center gap-2"
                    >
                      {uploading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                      UPLOAD IMAGE
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="brutal-card h-fit">
              <CardHeader><CardTitle>ADD NEW PROJECT</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleAddProject} className="space-y-4">
                  <Input name="title" placeholder="PROJECT TITLE" className="bg-black border-2 border-white rounded-none" required />
                  <Textarea name="description" placeholder="SHORT DESCRIPTION" className="bg-black border-2 border-white rounded-none" />
                  <Input name="link" placeholder="LIVE URL (https://...)" className="bg-black border-2 border-white rounded-none" />
                  <Input name="github_link" placeholder="GITHUB URL (https://...)" className="bg-black border-2 border-white rounded-none" />
                  <Input name="tags" placeholder="TAGS (comma separated: React, Node, etc.)" className="bg-black border-2 border-white rounded-none" />
                  <button type="submit" className="brutal-btn w-full mt-4 py-4 text-xl">
                    <Plus className="inline mr-2" /> CREATE PROJECT
                  </button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h3 className="text-3xl font-black italic uppercase">Manage Projects</h3>
              {projects.map((p) => (
                <div key={p.id} className="brutal-card border-l-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-2xl font-black uppercase">{p.title}</h4>
                      <p className="text-zinc-500 text-sm">{p.link || 'No live link'}</p>
                    </div>
                    <button 
                      onClick={async () => {
                        if(confirm('Delete project?')) {
                          await supabase.from('projects').delete().eq('id', p.id)
                          fetchData()
                        }
                      }}
                      className="text-red-500 hover:bg-red-500 hover:text-white p-2 border-2 border-transparent hover:border-white transition-all"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-20 h-20 object-cover border-2 border-white" />
                    ) : (
                      <div className="w-20 h-20 bg-zinc-900 border-2 border-dashed border-zinc-700 flex items-center justify-center text-xs text-center p-1">No Image</div>
                    )}
                    <input 
                      type="file" 
                      id={`proj_upload_${p.id}`} 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(e, true, p.id)}
                    />
                    <label htmlFor={`proj_upload_${p.id}`} className="brutal-border px-3 py-1 text-xs cursor-pointer hover:bg-white hover:text-black font-bold transition-all">
                      CHANGE IMAGE
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="skills">
           <Card className="brutal-card max-w-2xl">
              <CardHeader><CardTitle>TECHNICAL SKILLS</CardTitle></CardHeader>
              <CardContent>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const name = formData.get('name') as string
                    if (!name) return
                    await supabase.from('skills').insert([{ name, order_index: skills.length }])
                    fetchData()
                    e.currentTarget.reset()
                  }} 
                  className="flex gap-4"
                >
                  <Input name="name" placeholder="SKILL (e.g. TYPESCRIPT)" className="bg-black border-2 border-white rounded-none h-12" required />
                  <button type="submit" className="brutal-btn whitespace-nowrap h-12 px-8">ADD SKILL</button>
                </form>
                <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {skills.map(s => (
                    <div key={s.id} className="brutal-border px-4 py-3 flex justify-between items-center bg-zinc-900 group">
                      <span className="font-bold uppercase tracking-tight">{s.name}</span>
                      <button onClick={async () => {
                        await supabase.from('skills').delete().eq('id', s.id)
                        fetchData()
                      }} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="footer">
          <Card className="brutal-card">
            <CardHeader><CardTitle>CONTACT & LINKS</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="font-bold">CONTACT EMAIL</label>
                <Input 
                  defaultValue={getContentValue('email')} 
                  onBlur={(e) => handleUpdateContent('email', e.target.value)}
                  className="bg-black border-2 border-white rounded-none"
                  placeholder="admin@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold">GITHUB PROFILE URL</label>
                <Input 
                  defaultValue={getContentValue('github_url')} 
                  onBlur={(e) => handleUpdateContent('github_url', e.target.value)}
                  className="bg-black border-2 border-white rounded-none"
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold">TWITTER / X URL</label>
                <Input 
                  defaultValue={getContentValue('twitter_url')} 
                  onBlur={(e) => handleUpdateContent('twitter_url', e.target.value)}
                  className="bg-black border-2 border-white rounded-none"
                  placeholder="https://x.com/yourusername"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
