'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { ArrowRight, GitBranch, ExternalLink } from 'lucide-react'

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
      <section className="container mx-auto px-6 py-24 md:py-48 flex flex-col items-start">
        <motion.h1 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-7xl md:text-9xl font-black tracking-tighter italic mb-4"
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
          className="max-w-2xl text-xl md:text-2xl text-zinc-400 leading-tight mb-12"
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
      </section>

      {/* Projects Section */}
      <section id="projects" className="container mx-auto px-6 py-24 border-t-4 border-white">
        <h2 className="text-6xl font-black italic mb-16 tracking-tighter">SELECTED_PROJECTS</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {projects.map((project, idx) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="brutal-card group"
            >
              <h3 className="text-4xl font-black mb-4 group-hover:italic transition-all uppercase">{project.title}</h3>
              <p className="text-zinc-400 mb-6 text-lg">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags?.map((tag: string) => (
                  <span key={tag} className="border-2 border-white px-3 py-1 text-sm font-bold uppercase">{tag}</span>
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
                    CODE <GitBranch size={18} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="bg-white text-black py-24 border-y-4 border-white">
        <div className="container mx-auto px-6">
          <h2 className="text-6xl font-black italic mb-16 tracking-tighter">TECHNICAL_ARSENAL</h2>
          <div className="flex flex-wrap gap-6">
            {skills.map((skill, idx) => (
              <motion.div 
                key={skill.id}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', delay: idx * 0.05 }}
                className="text-4xl md:text-6xl font-black border-4 border-black px-8 py-4 hover:bg-black hover:text-white transition-colors cursor-default"
              >
                {skill.name.toUpperCase()}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="container mx-auto px-6 py-24 flex flex-col items-center">
        <h2 className="text-7xl md:text-9xl font-black italic tracking-tighter mb-12 text-center">LET'S_COLLAB</h2>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
          <a href="mailto:admin@example.com" className="brutal-btn flex-1 text-3xl py-8 text-center uppercase">EMAIL_ME</a>
          <a href="https://github.com" className="brutal-border flex-1 text-3xl py-8 text-center font-black hover:bg-white hover:text-black transition-all uppercase">GITHUB</a>
        </div>
        <p className="mt-24 font-bold text-zinc-500 uppercase tracking-widest">© 2026 VOID_PORTFOLIO / ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  )
}
