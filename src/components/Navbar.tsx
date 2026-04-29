import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b-2 border-white">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-black tracking-tighter hover:bg-white hover:text-black transition-colors px-2">
          VOID_PORTFOLIO
        </Link>
        <div className="flex gap-8 font-bold">
          <Link href="#projects" className="hover:line-through">PROJECTS</Link>
          <Link href="#skills" className="hover:line-through">SKILLS</Link>
          <Link href="#contact" className="hover:line-through">CONTACT</Link>
          <Link href="/admin" className="brutal-btn py-1 px-4 text-sm">ADMIN</Link>
        </div>
      </div>
    </nav>
  )
}
