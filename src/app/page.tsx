'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Github, ExternalLink, Twitter, Mail } from 'lucide-react'

export default function Home() {
  const [projects, setProjects] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [content, setContent] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: proj } = await supabase.from('projects').select('*').order('order_index')
      const { data: sk } = await supabase.from('skills').select('*').order('order_index')
      const { data: cont } = await supabase.from('portfolio_content').select('*')
      
      const contentMap = cont?.reduce((acc: any, item: any) => {
        acc[item.key] = item.value
        return acc
      }, {}) || {}

      setProjects(proj || [])
      setSkills(sk || [])
      setContent(contentMap)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-black text-4xl italic">
      LOADING_VOID...
    </div>
  )

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 md:py-40 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 flex flex-col items-start">
          <motion.h1 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-7xl md:text-9xl font-black tracking-tighter italic mb-4 leading-none"
          >
            {content.name || 'YOUR_NAME'}
          </motion.h1>
          <motion.p 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-4xl font-bold bg-white text-black px-4 py-2 mb-8"
          >
            {content.title || 'FULLSTACK_DEVELOPER'}
          </motion.p>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl text-xl md:text-2xl text-zinc-400 leading-tight mb-12 font-medium"
          >
            {content.bio || 'Building raw, high-performance digital experiences in the void.'}
          </motion.p>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <a href="#projects" className="brutal-btn text-2xl py-4 px-12">VIEW_WORK</a>
          </motion.div>
        </div>
        
        {content.hero_image && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 hidden md:block"
          >
            <img 
              src={content.hero_image} 
              alt={content.name} 
              className="w-full aspect-square object-cover border-8 border-white brutal-shadow" 
            />
          </motion.div>
        )}
      </section>

      {/* Projects Section */}
      <section id="projects" className="container mx-auto px-6 py-24 border-t-4 border-white">
        <h2 className="text-6xl md:text-8xl font-black italic mb-16 tracking-tighter uppercase">Selected_Projects</h2>
        <div className="grid md:grid-cols-2 gap-16">
          {projects.map((project, idx) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="brutal-card group flex flex-col h-full"
            >
              {project.image_url && (
                <div className="mb-6 overflow-hidden border-2 border-white">
                   <img 
                    src={project.image_url} 
                    alt={project.title} 
                    className="w-full h-64 object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              )}
              <h3 className="text-4xl font-black mb-4 group-hover:italic transition-all uppercase">{project.title}</h3>
              <p className="text-zinc-400 mb-8 text-lg leading-snug flex-grow">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags?.map((tag: string) => (
                  <span key={tag} className="bg-zinc-900 border-2 border-white px-3 py-1 text-xs font-black uppercase tracking-widest">{tag}</span>
                ))}
              </div>
              <div className="flex gap-4">
                {project.link && (
                  <a href={project.link} target="_blank" className="brutal-btn flex items-center gap-2 py-2 px-6">
                    LIVE <ExternalLink size={18} />
                  </a>
                )}
                {project.github_link && (
                  <a href={project.github_link} target="_blank" className="brutal-border hover:bg-white hover:text-black transition-all p-2 px-4 flex items-center gap-2 font-bold">
                    CODE <Github size={18} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="bg-white text-black py-24 border-y-4 border-white overflow-hidden">
        <div className="container mx-auto px-6">
          <h2 className="text-6xl md:text-8xl font-black italic mb-16 tracking-tighter uppercase">Technical_Arsenal</h2>
          <div className="flex flex-wrap gap-4 md:gap-8">
            {skills.map((skill, idx) => (
              <motion.div 
                key={skill.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="text-4xl md:text-7xl font-black border-4 border-black px-6 md:px-10 py-2 md:py-6 hover:bg-black hover:text-white transition-colors cursor-default uppercase"
              >
                {skill.name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="container mx-auto px-6 py-32 flex flex-col items-center">
        <h2 className="text-7xl md:text-[12rem] font-black italic tracking-tighter mb-12 text-center leading-none uppercase">LET'S_COLLAB</h2>
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mt-12">
          {content.email && (
             <a href={`mailto:${content.email}`} className="brutal-btn text-2xl py-10 text-center uppercase flex flex-col items-center gap-4">
                <Mail size={40} /> EMAIL_ME
             </a>
          )}
          {content.github_url && (
            <a href={content.github_url} target="_blank" className="brutal-border text-2xl py-10 text-center font-black hover:bg-white hover:text-black transition-all uppercase flex flex-col items-center gap-4">
                <Github size={40} /> GITHUB
            </a>
          )}
          {content.twitter_url && (
            <a href={content.twitter_url} target="_blank" className="brutal-border text-2xl py-10 text-center font-black hover:bg-white hover:text-black transition-all uppercase flex flex-col items-center gap-4">
                <Twitter size={40} /> TWITTER_X
            </a>
          )}
        </div>
        <div className="mt-32 w-full border-t-2 border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-black text-zinc-500 uppercase tracking-widest text-sm">© 2026 {content.name || 'VOID_PORTFOLIO'} / ALL RIGHTS RESERVED</p>
          <div className="flex gap-8 font-black text-sm uppercase italic">
            <a href="#" className="hover:line-through">BACK_TO_TOP</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
