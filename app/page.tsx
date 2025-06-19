'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Github, 
  Star, 
  GitFork, 
  Eye, 
  Calendar, 
  Code, 
  Search,
  ExternalLink,
  Sparkles,
  Users,
  GitCommit,
  AlertCircle,
  User,
  Check,
  Plus,
  FileText,
  Download,
  Shield,
  Maximize,
  Minimize,
  Settings,
  Link,
  Clock,
  Archive,
  ArrowRight
} from 'lucide-react'
import QRCode from 'qrcode'
import { githubService, GitHubRepository, GitHubUser } from '../lib/github'

// Unified repository interface that works with both GitHub API and mock data
interface Repository extends Partial<GitHubRepository> {
  id: number
  name: string
  description: string | null
  language: string | null
  html_url?: string
  htmlUrl?: string
  stargazers_count?: number
  stars?: number
  forks_count?: number
  forks?: number
  watchers_count?: number
  commits?: number
  license?: any
  updated_at?: string
  lastUpdated?: string
}

// Mock repository data for demo (converted to GitHub API format)
const mockRepositories: Repository[] = [
  {
    id: 1,
    name: 'awesome-project',
    full_name: 'demo/awesome-project',
    description: 'A revolutionary web application built with Next.js and TypeScript that changes everything.',
    language: 'TypeScript',
    stargazers_count: 1247,
    forks_count: 89,
    commits: 156,
    license: { name: 'MIT', spdx_id: 'MIT' },
    updated_at: '2024-01-15T00:00:00Z',
    html_url: 'https://github.com/demo/awesome-project',
    private: false,
    fork: false,
    archived: false,
    disabled: false,
    size: 1024,
    created_at: '2023-01-01T00:00:00Z',
    pushed_at: '2024-01-15T00:00:00Z',
    default_branch: 'main',
    open_issues_count: 5
  },
  {
    id: 2,
    name: 'ml-algorithms',
    full_name: 'demo/ml-algorithms',
    description: 'Machine learning algorithms implemented from scratch in Python with detailed explanations.',
    language: 'Python',
    stargazers_count: 892,
    forks_count: 234,
    commits: 89,
    license: { name: 'Apache-2.0', spdx_id: 'Apache-2.0' },
    updated_at: '2024-01-10T00:00:00Z',
    html_url: 'https://github.com/demo/ml-algorithms',
    private: false,
    fork: false,
    archived: false,
    disabled: false,
    size: 2048,
    created_at: '2023-06-01T00:00:00Z',
    pushed_at: '2024-01-10T00:00:00Z',
    default_branch: 'main',
    open_issues_count: 12
  },
  {
    id: 3,
    name: 'react-components',
    full_name: 'demo/react-components',
    description: 'A collection of beautiful, reusable React components with TypeScript support.',
    language: 'JavaScript',
    stargazers_count: 567,
    forks_count: 45,
    commits: 78,
    license: { name: 'MIT', spdx_id: 'MIT' },
    updated_at: '2024-01-08T00:00:00Z',
    html_url: 'https://github.com/demo/react-components',
    private: false,
    fork: false,
    archived: false,
    disabled: false,
    size: 512,
    created_at: '2023-09-01T00:00:00Z',
    pushed_at: '2024-01-08T00:00:00Z',
    default_branch: 'main',
    open_issues_count: 8
  },
  {
    id: 4,
    name: 'api-gateway',
    full_name: 'demo/api-gateway',
    description: 'High-performance API gateway built with Go, featuring rate limiting and authentication.',
    language: 'Go',
    stargazers_count: 234,
    forks_count: 12,
    commits: 45,
    license: { name: 'BSD-3-Clause', spdx_id: 'BSD-3-Clause' },
    updated_at: '2024-01-05T00:00:00Z',
    html_url: 'https://github.com/demo/api-gateway',
    private: false,
    fork: false,
    archived: false,
    disabled: false,
    size: 256,
    created_at: '2023-11-01T00:00:00Z',
    pushed_at: '2024-01-05T00:00:00Z',
    default_branch: 'main',
    open_issues_count: 3
  }
]

const languageColors: { [key: string]: string } = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-500',
  Python: 'bg-green-500',
  Go: 'bg-cyan-500',
  Java: 'bg-orange-500',
  'C++': 'bg-pink-500',
  Rust: 'bg-orange-600',
  PHP: 'bg-purple-500'
}

// QR Code Component
const QRCodeIcon = ({ url, size = 48 }: { url: string; size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    if (canvasRef.current && url) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 1,
        color: {
          dark: '#10b981', // Supabase green
          light: '#ffffff00' // Transparent background
        }
      }, (error) => {
        if (error) console.error('QR Code generation error:', error)
      })
    }
  }, [url, size])
  
  return (
    <canvas 
      ref={canvasRef}
      className="rounded-lg"
      style={{ width: size, height: size }}
    />
  )
}

export default function HomePage() {
  const [username, setUsername] = useState('')
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRepos, setSelectedRepos] = useState<number[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [commitCounts, setCommitCounts] = useState<{ [key: number]: number }>({})
  const [showSlideshow, setShowSlideshow] = useState(false)
  const [slideshowSpeed, setSlideshowSpeed] = useState(7) // seconds per repository
  const [showRepoLinks, setShowRepoLinks] = useState(true) // toggle between button and link
  const [isFullscreen, setIsFullscreen] = useState(false)
  


  useEffect(() => {
    setIsMounted(true)
    // Load mock data initially
    setRepositories(mockRepositories)
    setSelectedRepos(mockRepositories.map(repo => repo.id))
  }, [])



  const handleSearch = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch user info and repositories in parallel
      const [userInfo, repos] = await Promise.all([
        githubService.getUser(username),
        githubService.getUserRepositories(username)
      ])
      
      setUser(userInfo)
      setRepositories(repos)
      setSelectedRepos(repos.map(repo => repo.id))
      
      // Fetch commit counts for top repositories (limit to first 10 for performance)
      const topRepos = repos.slice(0, 10)
      const commitPromises = topRepos.map(async (repo) => {
        try {
          const count = await githubService.getRepositoryCommits(username, repo.name)
          return { id: repo.id, count }
        } catch (error) {
          console.warn(`Could not fetch commits for ${repo.name}:`, error)
          return { id: repo.id, count: 0 }
        }
      })
      
      const commitResults = await Promise.all(commitPromises)
      const newCommitCounts: { [key: number]: number } = {}
      commitResults.forEach(({ id, count }) => {
        newCommitCounts[id] = count
      })
      setCommitCounts(newCommitCounts)
      
    } catch (error: any) {
      console.error('Error fetching GitHub data:', error)
      if (error.status === 404) {
        setError(`User "${username}" not found on GitHub`)
      } else if (error.status === 403) {
        setError('GitHub API rate limit exceeded. Please try again later.')
      } else {
        setError(error.message || 'Failed to fetch repositories. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const toggleRepo = (repoId: number) => {
    setSelectedRepos(prev => 
      prev.includes(repoId) 
        ? prev.filter(id => id !== repoId)
        : [...prev, repoId]
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const showSlideshowModal = () => {
    if (!user) {
      alert('Please search for a GitHub user first!')
      return
    }
    
    if (selectedRepos.length === 0) {
      alert('Please select at least one repository to include in the slideshow!')
      return
    }
    
    setShowSlideshow(true)
    // Prevent body scrolling during slideshow
    document.body.classList.add('no-scrollbar', 'overflow-hidden')
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

    if (!isMounted) {
    return <div className="min-h-screen bg-slate-950" />
  }

      // Show main landing page if no user data
  if (!user && !isLoading && !error) {
    return (
      <div className="h-screen bg-slate-950 text-slate-50 flex items-center justify-center overflow-hidden">
        {/* Scattered Glowing Bubbles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Large scattered orbital bubbles */}
          <motion.div
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              boxShadow: '0 0 40px 20px rgba(59, 130, 246, 0.3), 0 0 80px 40px rgba(59, 130, 246, 0.15), 0 0 120px 60px rgba(59, 130, 246, 0.08)',
              filter: 'blur(8px)',
              top: '5%',
              left: '3%'
            }}
            animate={{
              x: [0, 300, 600, 900, 600, 300, 0],
              y: [0, 150, 80, 220, 300, 120, 0],
              scale: [1, 1.5, 0.6, 1.8, 1, 0.7, 1]
            }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              boxShadow: '0 0 50px 25px rgba(139, 92, 246, 0.25), 0 0 100px 50px rgba(139, 92, 246, 0.12), 0 0 150px 75px rgba(139, 92, 246, 0.06)',
              filter: 'blur(10px)',
              top: '70%',
              right: '5%'
            }}
            animate={{
              x: [0, -200, -400, -600, -400, -200, 0],
              y: [0, -100, 60, 180, -80, 140, 0],
              scale: [1, 0.5, 1.6, 0.8, 2, 1, 1]
            }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              boxShadow: '0 0 35px 18px rgba(6, 182, 212, 0.28), 0 0 70px 35px rgba(6, 182, 212, 0.14), 0 0 105px 50px rgba(6, 182, 212, 0.07)',
              filter: 'blur(7px)',
              bottom: '15%',
              right: '60%'
            }}
            animate={{
              x: [0, 250, 500, 250, 0],
              y: [0, -180, -90, -270, 0],
              rotate: [0, 360, 720, 1080, 1440],
              scale: [1, 1.7, 0.4, 1.3, 1]
            }}
            transition={{
              duration: 38,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Medium scattered bubbles */}
          <motion.div
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              boxShadow: '0 0 30px 15px rgba(16, 185, 129, 0.25), 0 0 60px 30px rgba(16, 185, 129, 0.12), 0 0 90px 45px rgba(16, 185, 129, 0.06)',
              filter: 'blur(6px)',
              top: '20%',
              right: '25%'
            }}
            animate={{
              x: [0, -180, -360, -180, 0],
              y: [0, 120, 0, -120, 0],
              scale: [1, 1.4, 1, 0.6, 1]
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              boxShadow: '0 0 38px 19px rgba(251, 113, 133, 0.22), 0 0 76px 38px rgba(251, 113, 133, 0.11), 0 0 114px 57px rgba(251, 113, 133, 0.055)',
              filter: 'blur(7px)',
              bottom: '35%',
              left: '80%'
            }}
            animate={{
              x: [0, -150, -300, -150, 0],
              y: [0, -200, -100, -300, 0],
              scale: [1, 0.6, 1.8, 1, 1]
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <motion.div
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              boxShadow: '0 0 25px 12px rgba(250, 204, 21, 0.3), 0 0 50px 25px rgba(250, 204, 21, 0.15), 0 0 75px 38px rgba(250, 204, 21, 0.075)',
              filter: 'blur(5px)',
              top: '45%',
              left: '10%'
            }}
            animate={{
              x: [0, 140, 280, 420, 280, 140, 0],
              y: [0, 90, 0, -90, 0, 45, 0],
              scale: [1, 1.6, 1, 2.2, 1, 1.3, 1]
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              boxShadow: '0 0 28px 14px rgba(99, 102, 241, 0.26), 0 0 56px 28px rgba(99, 102, 241, 0.13), 0 0 84px 42px rgba(99, 102, 241, 0.065)',
              filter: 'blur(5px)',
              top: '80%',
              left: '40%'
            }}
            animate={{
              x: [0, 160, 320, 480, 320, 160, 0],
              y: [0, -60, 30, -120, 60, -30, 0],
              rotate: [0, 270, 540, 810, 1080, 1350, 1620]
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Small scattered sparkles */}
          <motion.div
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              boxShadow: '0 0 20px 10px rgba(244, 114, 182, 0.35), 0 0 40px 20px rgba(244, 114, 182, 0.18)',
              filter: 'blur(4px)',
              top: '60%',
              left: '70%'
            }}
            animate={{
              x: [0, -100, -200, -100, 0],
              y: [0, 80, 0, -80, 0],
              scale: [1, 1.8, 1, 1.4, 1]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Tiny floating sparkles - above content */}
          <motion.div
            className="absolute w-1 h-1 rounded-full z-10"
            style={{ 
              boxShadow: '0 0 15px 8px rgba(255, 255, 255, 0.4), 0 0 30px 15px rgba(255, 255, 255, 0.2)',
              filter: 'blur(3px)',
              top: '35%',
              left: '85%'
            }}
            animate={{
              opacity: [0.8, 1, 0.8, 1, 0.8],
              scale: [1, 2.5, 1, 3, 1],
              y: [0, -40, 0, -70, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute w-1 h-1 rounded-full z-10"
            style={{ 
              boxShadow: '0 0 12px 6px rgba(191, 219, 254, 0.45), 0 0 24px 12px rgba(191, 219, 254, 0.22)',
              filter: 'blur(3px)',
              top: '65%',
              right: '15%'
            }}
            animate={{
              opacity: [0.7, 1, 0.7, 1, 0.7],
              scale: [1, 2.2, 1, 1.8, 1],
              x: [0, 60, 0, -60, 0]
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />
          
          <motion.div
            className="absolute w-1 h-1 rounded-full z-10"
            style={{ 
              boxShadow: '0 0 18px 9px rgba(196, 181, 253, 0.4), 0 0 36px 18px rgba(196, 181, 253, 0.2)',
              filter: 'blur(3px)',
              top: '25%',
              left: '75%'
            }}
            animate={{
              opacity: [0.9, 1, 0.9, 1, 0.9],
              scale: [1, 2.8, 1, 2, 1],
              rotate: [0, 360, 720]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
          />

          {/* Additional scattered medium bubbles */}
          <motion.div
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              boxShadow: '0 0 32px 16px rgba(45, 212, 191, 0.24), 0 0 64px 32px rgba(45, 212, 191, 0.12)',
              filter: 'blur(6px)',
              top: '10%',
              right: '45%'
            }}
            animate={{
              x: [0, -120, -240, -120, 0],
              y: [0, 100, 200, 100, 0],
              scale: [1, 1.3, 0.7, 1.6, 1]
            }}
            transition={{
              duration: 36,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <motion.div
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              boxShadow: '0 0 24px 12px rgba(251, 146, 60, 0.28), 0 0 48px 24px rgba(251, 146, 60, 0.14)',
              filter: 'blur(5px)',
              bottom: '10%',
              left: '20%'
            }}
            animate={{
              x: [0, 200, 400, 200, 0],
              y: [0, -80, -160, -80, 0],
              scale: [1, 1.5, 1, 1.9, 1]
            }}
            transition={{
              duration: 26,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="floating absolute top-40 right-20 w-32 h-32 bg-violet-500/10 rounded-full blur-xl" style={{animationDelay: '2s'}}></div>
          <div className="floating absolute bottom-20 left-1/4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="container-modern">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="mb-8">
                                <motion.div 
                  className="inline-flex items-center gap-3 px-5 py-3 bg-slate-800/60 backdrop-blur-xl rounded-full border border-slate-700/60 mb-8 shadow-lg relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-primary rounded-md flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-200">RepoShine</span>
                    <span className="text-xs text-slate-400">By</span>
                    <a 
                      href="https://github.com/Navaneeth-Git" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-slate-300 transition-colors duration-200 underline decoration-slate-500 hover:decoration-slate-400"
                    >
                      Navaneeth
                    </a>
                  </div>
                  <div className="w-px h-4 bg-slate-600"></div>
                  <div className="flex items-center gap-2">
                    <div className="status-indicator status-online"></div>
                    <span className="text-sm text-slate-300">Powered by GitHub API</span>
                  </div>
                </motion.div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                Beautiful GitHub
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                  Repository Showcases
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                Transform your GitHub profile into a stunning, professional showcase. 
                Create beautiful presentations of your repositories with advanced analytics and modern design.
              </p>
            </motion.div>

            {/* Centered Search Interface */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
                                            <div className="max-w-xl mx-auto">
                 <div className="flex items-center gap-4">
                   <div className="relative flex-1">
                     <div className="bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl flex items-center px-6 py-4 focus-within:ring-2 focus-within:ring-green-500/40 focus-within:border-green-500/30 focus-within:bg-white/8 transition-all duration-300 hover:bg-white/7">
                       <div className="flex items-center gap-3 mr-4">
                         <div className="w-6 h-6 bg-slate-700/60 rounded-md flex items-center justify-center shadow-lg">
                           <Github className="w-4 h-4 text-slate-300" />
                         </div>
                         <span className="text-sm font-medium text-slate-200">GitHub</span>
                       </div>
                       <div className="w-px h-6 bg-white/20"></div>
                       <input
                         type="text"
                         placeholder="Enter username"
                         value={username}
                         onChange={(e) => setUsername(e.target.value)}
                         className="flex-1 ml-4 bg-transparent border-none outline-none text-slate-100 placeholder-slate-400 text-lg font-medium"
                         onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                         autoFocus
                       />
                     </div>
                   </div>
                   
                   <motion.button
                     onClick={handleSearch}
                     disabled={isLoading}
                     className="w-14 h-14 bg-gradient-to-r from-emerald-600/80 to-green-600/80 hover:from-emerald-500/90 hover:to-green-500/90 disabled:from-slate-600/50 disabled:to-slate-700/50 backdrop-blur-xl rounded-full border border-emerald-500/20 hover:border-emerald-400/30 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-150 flex items-center justify-center text-white disabled:text-slate-400"
                     whileHover={{ scale: isLoading ? 1 : 1.1 }}
                     whileTap={{ scale: isLoading ? 1 : 0.95 }}
                     transition={{ duration: 0.15 }}
                     title="Create Showcase"
                   >
                     {isLoading ? (
                       <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     ) : (
                       <motion.div
                         whileHover={{ x: 2 }}
                         transition={{ duration: 0.2 }}
                       >
                         <ArrowRight className="w-6 h-6" />
                       </motion.div>
                     )}
                   </motion.button>
                 </div>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Scattered Glowing Bubbles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large scattered bubbles */}
        <motion.div
          className="absolute w-1 h-1 rounded-full"
          style={{ 
            boxShadow: '0 0 38px 19px rgba(59, 130, 246, 0.26), 0 0 76px 38px rgba(59, 130, 246, 0.13), 0 0 114px 57px rgba(59, 130, 246, 0.065)',
            filter: 'blur(7px)',
            top: '8%',
            left: '4%'
          }}
          animate={{
            x: [0, 220, 440, 660, 440, 220, 0],
            y: [0, 100, 60, 160, 200, 80, 0],
            scale: [1, 1.4, 0.6, 1.7, 1, 0.8, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute w-1 h-1 rounded-full"
          style={{ 
            boxShadow: '0 0 45px 22px rgba(139, 92, 246, 0.22), 0 0 90px 45px rgba(139, 92, 246, 0.11), 0 0 135px 68px rgba(139, 92, 246, 0.055)',
            filter: 'blur(8px)',
            top: '70%',
            right: '6%'
          }}
          animate={{
            x: [0, -140, -280, -420, -280, -140, 0],
            y: [0, -90, 40, 130, -50, 100, 0],
            scale: [1, 0.5, 1.5, 0.7, 1.8, 1, 1]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Medium scattered bubbles */}
        <motion.div
          className="absolute w-1 h-1 rounded-full"
          style={{ 
            boxShadow: '0 0 28px 14px rgba(6, 182, 212, 0.28), 0 0 56px 28px rgba(6, 182, 212, 0.14), 0 0 84px 42px rgba(6, 182, 212, 0.07)',
            filter: 'blur(5px)',
            bottom: '20%',
            left: '65%'
          }}
          animate={{
            scale: [1, 1.8, 1, 0.5, 1],
            rotate: [0, 360, 720],
            y: [0, -100, -50, -150, 0],
            x: [0, 80, 160, 80, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute w-1 h-1 rounded-full"
          style={{ 
            boxShadow: '0 0 34px 17px rgba(16, 185, 129, 0.24), 0 0 68px 34px rgba(16, 185, 129, 0.12), 0 0 102px 51px rgba(16, 185, 129, 0.06)',
            filter: 'blur(6px)',
            top: '35%',
            left: '15%'
          }}
          animate={{
            x: [0, 180, 360, 180, 0],
            y: [0, 90, 0, -90, 0],
            scale: [1, 1.3, 1, 0.7, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Small scattered sparkles */}
        <motion.div
          className="absolute w-1 h-1 rounded-full"
          style={{ 
            boxShadow: '0 0 22px 11px rgba(250, 204, 21, 0.32), 0 0 44px 22px rgba(250, 204, 21, 0.16), 0 0 66px 33px rgba(250, 204, 21, 0.08)',
            filter: 'blur(4px)',
            top: '15%',
            right: '30%'
          }}
          animate={{
            x: [0, -80, -160, -240, -160, -80, 0],
            y: [0, 70, 0, -70, 0, 35, 0],
            scale: [1, 1.5, 1, 2, 1, 1.2, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div
          className="absolute w-1 h-1 rounded-full"
          style={{ 
            boxShadow: '0 0 26px 13px rgba(251, 113, 133, 0.29), 0 0 52px 26px rgba(251, 113, 133, 0.145)',
            filter: 'blur(4px)',
            bottom: '40%',
            right: '20%'
          }}
          animate={{
            x: [0, -120, -240, -120, 0],
            y: [0, -80, -160, -80, 0],
            scale: [1, 1.6, 1, 1.3, 1]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Tiny floating sparkles above content */}
        <motion.div
          className="absolute w-1 h-1 rounded-full z-10"
          style={{ 
            boxShadow: '0 0 18px 9px rgba(255, 255, 255, 0.45), 0 0 36px 18px rgba(255, 255, 255, 0.22)',
            filter: 'blur(3px)',
            top: '30%',
            left: '80%'
          }}
          animate={{
            opacity: [0.8, 1, 0.8, 1, 0.8],
            scale: [1, 2.5, 1, 2, 1],
            y: [0, -35, 0, -55, 0]
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.div
          className="absolute w-1 h-1 rounded-full z-10"
          style={{ 
            boxShadow: '0 0 16px 8px rgba(165, 243, 252, 0.5), 0 0 32px 16px rgba(165, 243, 252, 0.25)',
            filter: 'blur(3px)',
            top: '55%',
            right: '25%'
          }}
          animate={{
            opacity: [0.8, 1, 0.8, 1, 0.8],
            scale: [1, 2.3, 1, 1.7, 1],
            rotate: [0, 360, 720],
            x: [0, 50, 0, -50, 0]
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />

        {/* Additional scattered elements */}
        <motion.div
          className="absolute w-1 h-1 rounded-full"
          style={{ 
            boxShadow: '0 0 20px 10px rgba(99, 102, 241, 0.34), 0 0 40px 20px rgba(99, 102, 241, 0.17)',
            filter: 'blur(4px)',
            top: '50%',
            left: '85%'
          }}
          animate={{
            x: [0, -60, -120, -60, 0],
            y: [0, 60, 0, -60, 0],
            scale: [1, 1.7, 1, 1.4, 1]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Simple Header */}
      <section className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-30">
        <div className="container-modern py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => {
                setUser(null)
                setRepositories([])
                setSelectedRepos([])
                setUsername('')
                setError(null)
              }}
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">
                  RepoShine
                </span>
                <span className="text-sm text-slate-400">By</span>
                <a 
                  href="https://github.com/Navaneeth-Git" 
            target="_blank"
            rel="noopener noreferrer"
                  className="text-sm text-slate-400 hover:text-slate-300 transition-colors duration-200 underline decoration-slate-500 hover:decoration-slate-400"
                  onClick={(e) => e.stopPropagation()}
                >
                  Navaneeth
                </a>
              </div>
            </motion.button>

            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400">
                {selectedRepos.length} repositories in showcase
              </div>
              
              {/* Header Slideshow Button */}
              {user && selectedRepos.length > 0 && (
                <motion.button
                  onClick={showSlideshowModal}
                  className="group relative inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/80 hover:bg-emerald-500/90 backdrop-blur-xl rounded-lg border border-emerald-500/20 hover:border-emerald-400/30 shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 text-white text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="View Slideshow"
                >
                  <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Slideshow</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </section>

       {/* Error Message */}
       {error && (
         <section className="container-modern py-8">
           <motion.div 
             className="max-w-2xl mx-auto"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
           >
             <div className="modern-card border-red-500/20 bg-red-500/5 p-6">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                   <AlertCircle className="w-5 h-5 text-red-400" />
                 </div>
                 <div>
                   <h3 className="font-semibold text-red-400 mb-1">Error</h3>
                   <p className="text-slate-300">{error}</p>
                 </div>
               </div>
             </div>
           </motion.div>
         </section>
       )}

       {/* User Profile */}
       {user && (
         <section className="container-modern py-8">
           <motion.div 
             className="max-w-6xl mx-auto"
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
           >
             <div className="modern-card p-8">
               <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                 <div className="relative">
                   <img 
                     src={user.avatar_url} 
                     alt={user.name || user.login}
                     className="w-20 h-20 rounded-2xl shadow-lg"
                   />
                   <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                     <Github className="w-3 h-3 text-white" />
                   </div>
                 </div>
                 
                 {/* Username and Stats in Single Line */}
                 <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                   <div>
                     <h2 className="text-2xl font-bold text-white mb-1">
                       {user.name || user.login}
                     </h2>
                     <p className="text-slate-400">@{user.login}</p>
                   </div>
                   
                   {/* Stats in horizontal layout */}
                   <div className="flex items-center gap-8">
                     <div className="text-center">
                       <div className="text-2xl font-bold text-blue-400">{user.public_repos}</div>
                       <div className="text-sm text-slate-400">Repositories</div>
                     </div>
                     <div className="text-center">
                       <div className="text-2xl font-bold text-violet-400">{user.followers}</div>
                       <div className="text-sm text-slate-400">Followers</div>
                     </div>
                     <div className="text-center">
                       <div className="text-2xl font-bold text-emerald-400">{user.following}</div>
                       <div className="text-sm text-slate-400">Following</div>
                     </div>
                   </div>
                 </div>
               </div>
               
               {user.bio && (
                 <div className="border-t border-slate-700/50 pt-4">
                   <p className="text-slate-300">{user.bio}</p>
                 </div>
               )}
             </div>
           </motion.div>
         </section>
       )}

              {/* Repository Showcase */}
       <section className="container-modern pb-20" id="showcase">
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.6, delay: 0.4 }}
         >
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-slate-100 mb-4">
               Repository <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Showcase</span>
             </h2>
             <p className="text-slate-300 max-w-2xl mx-auto mb-8">
               Your GitHub Repository Showcase - Remove any repositories you don't want to display by clicking the × button.
             </p>
             
             {/* Slideshow Button */}
             <div className="flex items-center justify-center gap-4">
               <motion.button
                 onClick={showSlideshowModal}
                 disabled={selectedRepos.length === 0}
                 className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600/80 to-green-600/80 hover:from-emerald-500/90 hover:to-green-500/90 disabled:from-slate-600/50 disabled:to-slate-700/50 backdrop-blur-xl rounded-2xl border border-emerald-500/20 hover:border-emerald-400/30 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 text-white disabled:text-slate-400 disabled:cursor-not-allowed overflow-hidden"
                 whileHover={{ scale: selectedRepos.length === 0 ? 1 : 1.05 }}
                 whileTap={{ scale: selectedRepos.length === 0 ? 1 : 0.98 }}
                 title={selectedRepos.length === 0 ? "Select repositories to view slideshow" : "View Repository Slideshow"}
               >
                 {/* Background Effects */}
                 <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 <div className="absolute inset-0">
                   <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 </div>
               
                 {/* Content */}
                 <div className="relative flex items-center gap-3">
                   <motion.div
                     className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-300"
                     whileHover={{ rotate: 12 }}
                     transition={{ duration: 0.2 }}
                   >
                     <Sparkles className="w-5 h-5" />
                   </motion.div>
                   <div className="flex flex-col items-start">
                     <span className="font-bold text-lg">View Slideshow</span>
                     <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                       {selectedRepos.length > 0 ? `${selectedRepos.length} repositories selected` : 'Select repositories first'}
                     </span>
                   </div>
                 </div>
               
                 {/* Shine Effect */}
                 <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-700" />
               </motion.button>
             </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
             {repositories.filter(repo => selectedRepos.includes(repo.id)).map((repo, index) => (
               <motion.div
                 key={repo.id}
                 className="bg-slate-800/30 backdrop-blur-xl border border-slate-600/20 hover:border-slate-500/30 rounded-2xl p-6 relative overflow-hidden hover:bg-slate-800/40 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col min-h-[580px]"
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.4, delay: 0.1 * index }}
                 whileHover={{ y: -6 }}
               >
                 {/* Mac-style Remove Button - Top left corner */}
                 <div className="absolute top-3 left-3 z-20 opacity-40 hover:opacity-100 transition-opacity duration-300">
                   <motion.button
                     onClick={(e) => {
                       e.stopPropagation()
                       setSelectedRepos(prev => prev.filter(id => id !== repo.id))
                     }}
                     className="w-4 h-4 rounded-full border border-slate-500/40 hover:border-red-400 bg-slate-600/60 hover:bg-red-500 text-slate-400 hover:text-white transition-all duration-300 flex items-center justify-center backdrop-blur-sm group"
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.95 }}
                     title="Remove from showcase"
                   >
                     <Plus className="w-2.5 h-2.5 rotate-45 group-hover:rotate-180 transition-transform duration-300" />
                   </motion.button>
                 </div>

                 {/* Repository Header */}
                 <div className="mb-6">
                   <div className="flex items-start gap-4 mb-4">
                     <div className="w-16 h-16 bg-slate-800/60 rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-emerald-500/30 p-1">
                       <QRCodeIcon 
                         url={repo.html_url || `https://github.com/${repo.name}`} 
                         size={56}
                       />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-2">
                         <h3 className="text-xl font-bold text-slate-100 hover:text-blue-400 transition-colors">
                           {repo.name}
                         </h3>
                         {repo.private === false && (
                           <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-md border border-green-500/30">
                             Public
                           </span>
                         )}
                         {repo.fork && (
                           <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md border border-blue-500/30">
                             Fork
                           </span>
                         )}
                       </div>
                       <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                         {repo.description || 'No description available'}
                       </p>
                     </div>
                   </div>
                 </div>

                 {/* Clean Stats Grid */}
                 <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/20">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                         <Star className="w-5 h-5 text-yellow-400" />
                       </div>
                       <div>
                         <div className="text-lg font-bold text-slate-200">{(repo.stargazers_count || 0).toLocaleString()}</div>
                         <div className="text-xs text-slate-500">Stars</div>
                       </div>
                     </div>
                   </div>
                   
                   <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/20">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                         <GitFork className="w-5 h-5 text-blue-400" />
                       </div>
                       <div>
                         <div className="text-lg font-bold text-slate-200">{(repo.forks_count || 0).toLocaleString()}</div>
                         <div className="text-xs text-slate-500">Forks</div>
                       </div>
                     </div>
                   </div>
                   
                   <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/20">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                         <GitCommit className="w-5 h-5 text-green-400" />
                       </div>
                       <div>
                         <div className="text-lg font-bold text-slate-200">{(commitCounts[repo.id] || repo.commits || 0).toLocaleString()}</div>
                         <div className="text-xs text-slate-500">Commits</div>
                       </div>
                     </div>
                   </div>
                   
                   <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/20">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                         <Eye className="w-5 h-5 text-purple-400" />
                       </div>
                       <div>
                         <div className="text-lg font-bold text-slate-200">{(repo.watchers_count || 0).toLocaleString()}</div>
                         <div className="text-xs text-slate-500">Watchers</div>
                       </div>
                     </div>
                   </div>
                 </div>



                 {/* Enhanced Metadata */}
                 <div className="space-y-4 mb-6 flex-grow">
                   <div className="flex flex-wrap gap-2">
                     {repo.language && (
                       <div className="flex items-center gap-2 bg-slate-700/40 px-3 py-2 rounded-lg border border-slate-600/30">
                         <div className={`w-4 h-4 rounded-full ${languageColors[repo.language] || 'bg-slate-400'}`}></div>
                         <span className="text-sm font-semibold text-slate-200">{repo.language}</span>
                       </div>
                     )}
                     
                     {repo.license && (
                       <div className="flex items-center gap-2 bg-slate-700/40 px-3 py-2 rounded-lg border border-slate-600/30">
                         <Shield className="w-4 h-4 text-slate-400" />
                         <span className="text-sm font-semibold text-slate-200">
                           {typeof repo.license === 'object' && repo.license?.name ? repo.license.name : 
                            typeof repo.license === 'string' ? repo.license : 'No License'}
                         </span>
                       </div>
                     )}
                     
                     {repo.open_issues_count !== undefined && repo.open_issues_count > 0 && (
                       <div className="flex items-center gap-2 bg-slate-700/40 px-3 py-2 rounded-lg border border-slate-600/30">
                         <AlertCircle className="w-4 h-4 text-orange-400" />
                         <span className="text-sm font-semibold text-slate-200">{repo.open_issues_count} Issues</span>
                       </div>
                     )}
                   </div>
                   
                   <div className="grid grid-cols-1 gap-3 text-sm">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-slate-400">
                         <Clock className="w-4 h-4" />
                         <span>Last Updated</span>
                       </div>
                       <span className="text-slate-300 font-medium">
                         {formatDate(repo.updated_at || repo.lastUpdated || new Date().toISOString())}
                       </span>
                     </div>
                     
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-slate-400">
                         <Calendar className="w-4 h-4" />
                         <span>Created</span>
                       </div>
                       <span className="text-slate-300 font-medium">
                         {formatDate(repo.created_at || new Date().toISOString())}
                       </span>
                     </div>
                     
                     {repo.size && repo.size > 0 && (
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-slate-400">
                           <Archive className="w-4 h-4" />
                           <span>Repository Size</span>
                         </div>
                         <span className="text-slate-300 font-medium">
                           {(repo.size / 1024).toFixed(1)} MB
                         </span>
                       </div>
                     )}
                     
                     {repo.default_branch && (
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-slate-400">
                           <GitCommit className="w-4 h-4" />
                           <span>Default Branch</span>
                         </div>
                         <span className="text-slate-300 font-medium">
                           {repo.default_branch}
                         </span>
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Repository URL and Action Button */}
                 <div className="mt-auto pt-4 border-t border-slate-700/50 space-y-3">
                   {/* Repository URL Display */}
                   <div className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/20">
                     <div className="text-xs text-slate-500 mb-2">Repository URL:</div>
                     <a
                       href={repo.html_url || `https://github.com/${repo.name}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-emerald-400 hover:text-emerald-300 text-sm underline decoration-emerald-500/30 hover:decoration-emerald-400/60 transition-all duration-200 group block"
                       title={repo.html_url || `https://github.com/${repo.name}`}
                       onClick={(e) => e.stopPropagation()}
                     >
                       <div className="flex items-start gap-2">
                         <Github className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform mt-0.5" />
                         <div className="flex-1 min-w-0">
                           <div className="break-all leading-relaxed">
                             {repo.html_url || `https://github.com/${repo.name}`}
                           </div>
                         </div>
                         <ExternalLink className="w-3 h-3 flex-shrink-0 group-hover:translate-x-1 transition-transform mt-0.5" />
                       </div>
                     </a>
                   </div>

                   {/* Action Button */}
                   <motion.a
                     href={repo.html_url || `https://github.com/${repo.name}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="btn-secondary w-full justify-center group"
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={(e) => e.stopPropagation()}
                   >
                     <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                     <span>View Repository</span>
                     <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </motion.a>
                 </div>
               </motion.div>
             ))}
           </div>


        </motion.div>
      </section>

      {/* Modern Footer */}
      <footer className="border-t border-slate-800/50 mt-20">
        <div className="container-modern py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-100">RepoShine</span>
            </div>
            <p className="text-slate-400 mb-6">
              Transform your GitHub repositories into beautiful showcases
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
              <span>Built with Next.js</span>
              <span>•</span>
              <span>Powered by GitHub API</span>
              <span>•</span>
              <span>Made with ❤️</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Slideshow Modal */}
      {showSlideshow && (
        <motion.div
          className="fixed inset-0 z-50 bg-slate-950 overflow-hidden no-scrollbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Animated Background Bubbles */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {/* Large scattered bubbles */}
            <motion.div
              className="absolute w-1 h-1 rounded-full"
              style={{ 
                boxShadow: '0 0 38px 19px rgba(59, 130, 246, 0.26), 0 0 76px 38px rgba(59, 130, 246, 0.13), 0 0 114px 57px rgba(59, 130, 246, 0.065)',
                filter: 'blur(7px)',
                top: '8%',
                left: '4%'
              }}
              animate={{
                x: [0, 220, 440, 660, 440, 220, 0],
                y: [0, 100, 60, 160, 200, 80, 0],
                scale: [1, 1.4, 0.6, 1.7, 1, 0.8, 1]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              className="absolute w-1 h-1 rounded-full"
              style={{ 
                boxShadow: '0 0 45px 22px rgba(139, 92, 246, 0.22), 0 0 90px 45px rgba(139, 92, 246, 0.11), 0 0 135px 68px rgba(139, 92, 246, 0.055)',
                filter: 'blur(8px)',
                top: '70%',
                right: '6%'
              }}
              animate={{
                x: [0, -140, -280, -420, -280, -140, 0],
                y: [0, -90, 40, 130, -50, 100, 0],
                scale: [1, 0.5, 1.5, 0.7, 1.8, 1, 1]
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Medium scattered bubbles */}
            <motion.div
              className="absolute w-1 h-1 rounded-full"
              style={{ 
                boxShadow: '0 0 28px 14px rgba(6, 182, 212, 0.28), 0 0 56px 28px rgba(6, 182, 212, 0.14), 0 0 84px 42px rgba(6, 182, 212, 0.07)',
                filter: 'blur(5px)',
                bottom: '20%',
                left: '65%'
              }}
              animate={{
                scale: [1, 1.8, 1, 0.5, 1],
                rotate: [0, 360, 720],
                y: [0, -100, -50, -150, 0],
                x: [0, 80, 160, 80, 0]
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              className="absolute w-1 h-1 rounded-full"
              style={{ 
                boxShadow: '0 0 34px 17px rgba(16, 185, 129, 0.24), 0 0 68px 34px rgba(16, 185, 129, 0.12), 0 0 102px 51px rgba(16, 185, 129, 0.06)',
                filter: 'blur(6px)',
                top: '35%',
                left: '15%'
              }}
              animate={{
                x: [0, 180, 360, 180, 0],
                y: [0, 90, 0, -90, 0],
                scale: [1, 1.3, 1, 0.7, 1]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Small scattered sparkles */}
            <motion.div
              className="absolute w-1 h-1 rounded-full"
              style={{ 
                boxShadow: '0 0 22px 11px rgba(250, 204, 21, 0.32), 0 0 44px 22px rgba(250, 204, 21, 0.16), 0 0 66px 33px rgba(250, 204, 21, 0.08)',
                filter: 'blur(4px)',
                top: '15%',
                right: '30%'
              }}
              animate={{
                x: [0, -80, -160, -240, -160, -80, 0],
                y: [0, 70, 0, -70, 0, 35, 0],
                scale: [1, 1.5, 1, 2, 1, 1.2, 1]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            <motion.div
              className="absolute w-1 h-1 rounded-full"
              style={{ 
                boxShadow: '0 0 26px 13px rgba(251, 113, 133, 0.29), 0 0 52px 26px rgba(251, 113, 133, 0.145)',
                filter: 'blur(4px)',
                bottom: '40%',
                right: '20%'
              }}
              animate={{
                x: [0, -120, -240, -120, 0],
                y: [0, -80, -160, -80, 0],
                scale: [1, 1.6, 1, 1.3, 1]
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Tiny floating sparkles above content */}
            <motion.div
              className="absolute w-1 h-1 rounded-full z-10"
              style={{ 
                boxShadow: '0 0 18px 9px rgba(255, 255, 255, 0.45), 0 0 36px 18px rgba(255, 255, 255, 0.22)',
                filter: 'blur(3px)',
                top: '30%',
                left: '80%'
              }}
              animate={{
                opacity: [0.8, 1, 0.8, 1, 0.8],
                scale: [1, 2.5, 1, 2, 1],
                y: [0, -35, 0, -55, 0]
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
            
            <motion.div
              className="absolute w-1 h-1 rounded-full z-10"
              style={{ 
                boxShadow: '0 0 16px 8px rgba(165, 243, 252, 0.5), 0 0 32px 16px rgba(165, 243, 252, 0.25)',
                filter: 'blur(3px)',
                top: '55%',
                right: '25%'
              }}
              animate={{
                opacity: [0.8, 1, 0.8, 1, 0.8],
                scale: [1, 2.3, 1, 1.7, 1],
                rotate: [0, 360, 720],
                x: [0, 50, 0, -50, 0]
              }}
              transition={{
                duration: 11,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4
              }}
            />
          </div>
          {/* Control Buttons */}
          <div className="absolute top-6 right-6 z-60 flex items-center gap-3">
            {/* Speed Control */}
            <motion.div
              className="bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-600/50 shadow-lg px-4 py-2 flex items-center gap-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Speed:</span>
                <input
                  type="range"
                  min="0.5"
                  max="8"
                  step="0.5"
                  value={slideshowSpeed}
                  onChange={(e) => setSlideshowSpeed(Number(e.target.value))}
                  className="w-20 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-xs text-slate-300 w-8">{slideshowSpeed}s</span>
              </div>
            </motion.div>

            {/* Link Toggle */}
            <motion.button
              onClick={() => setShowRepoLinks(!showRepoLinks)}
              className="w-12 h-12 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-xl rounded-full border border-slate-600/50 hover:border-slate-500/70 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-slate-300 hover:text-white group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={showRepoLinks ? "Switch to button mode" : "Switch to URL mode"}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {showRepoLinks ? <Link className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
            </motion.button>

            {/* Fullscreen Toggle */}
            <motion.button
              onClick={toggleFullscreen}
              className="w-12 h-12 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-xl rounded-full border border-slate-600/50 hover:border-slate-500/70 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-slate-300 hover:text-white group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </motion.button>

            {/* Close Button */}
            <motion.button
              onClick={() => {
                setShowSlideshow(false)
                // Remove body scroll prevention when slideshow closes
                document.body.classList.remove('no-scrollbar', 'overflow-hidden')
              }}
              className="w-12 h-12 bg-slate-800/80 hover:bg-red-600/80 backdrop-blur-xl rounded-full border border-slate-600/50 hover:border-red-500/70 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-slate-300 hover:text-white group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Close Slideshow"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Plus className="w-6 h-6 rotate-45 group-hover:rotate-90 transition-transform duration-300" />
            </motion.button>
          </div>

          {/* User Profile Header */}
          {user && (
            <motion.div
              className="absolute top-0 left-0 right-0 z-40"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="container-modern py-8">
                <div className="flex items-center justify-start">
                  {/* Profile Section - Left */}
                  <div className="flex items-center gap-8">
                    <div className="relative">
                      <img 
                        src={user.avatar_url} 
                        alt={user.name || user.login}
                        className="w-20 h-20 rounded-2xl shadow-xl border-2 border-emerald-500/30"
                      />
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                        <Github className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {user.name || user.login}
                      </h2>
                      <p className="text-slate-400 text-base">@{user.login}</p>
                    </div>

                    {/* Stats Section - Right next to profile */}
                    <div className="flex items-center gap-6 ml-12">
                      <div className="flex flex-col items-center justify-center bg-slate-800/30 backdrop-blur-sm rounded-xl px-3 py-2 border border-slate-700/40 w-24 h-20">
                        <span className="text-xl font-bold text-blue-400 leading-tight">{user.public_repos}</span>
                        <span className="text-xs text-slate-400 font-medium mt-1">repos</span>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-slate-800/30 backdrop-blur-sm rounded-xl px-3 py-2 border border-slate-700/40 w-24 h-20">
                        <span className="text-xl font-bold text-violet-400 leading-tight">{user.followers}</span>
                        <span className="text-xs text-slate-400 font-medium mt-1">followers</span>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-slate-800/30 backdrop-blur-sm rounded-xl px-3 py-2 border border-slate-700/40 w-24 h-20">
                        <span className="text-xl font-bold text-emerald-400 leading-tight">{user.following}</span>
                        <span className="text-xs text-slate-400 font-medium mt-1">following</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Full Height Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-30 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-30 pointer-events-none" />

          {/* Scrolling Repository Cards */}
          <div className="absolute inset-0 flex items-center justify-center pt-24 pb-24">
            <div className="relative w-full h-full max-h-[700px] overflow-hidden">
              {/* Scrolling Container */}
                                            <motion.div
                 key={`slideshow-${slideshowSpeed}`} // Force re-render when speed changes
                 className="flex items-center gap-8 h-full"
                 animate={{
                   x: ['0%', '-33.333%']
                 }}
                 transition={{
                   duration: selectedRepos.length * slideshowSpeed, // Dynamic speed
                   repeat: Infinity,
                   ease: "linear"
                 }}
                 style={{
                   width: `${(repositories.filter(repo => selectedRepos.includes(repo.id)).length * 3 * 432)}px` // 400 + 32 gap
                 }}
               >
                 {[...Array(3)].flatMap(() => 
                   repositories.filter(repo => selectedRepos.includes(repo.id))
                 ).map((repo, index) => (
                                         <motion.div
                       key={`${repo.id}-${index}`}
                       className="bg-slate-800/50 backdrop-blur-xl border border-slate-600/40 rounded-xl p-5 min-w-[400px] h-[580px] flex flex-col shadow-2xl"
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: index * 0.1 }}
                     >
                       {/* Repository Header - Compact */}
                       <div className="mb-4">
                         <div className="flex items-start gap-3">
                           <div className="w-16 h-16 bg-slate-800/60 rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-emerald-500/30 p-1">
                             <QRCodeIcon 
                               url={repo.html_url || `https://github.com/${repo.name}`} 
                               size={56}
                             />
                           </div>
                           <div className="flex-1 min-w-0">
                             <div className="flex items-center gap-2 mb-2 flex-wrap">
                               <h3 className="text-lg font-bold text-slate-100 hover:text-blue-400 transition-colors">
                                 {repo.name}
                               </h3>
                               {repo.private === false && (
                                 <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-md border border-green-500/30">
                                   Public
                                 </span>
                               )}
                               {repo.fork && (
                                 <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md border border-blue-500/30">
                                   Fork
                                 </span>
                               )}
                             </div>
                             <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                               {repo.description || 'No description available'}
                             </p>
                           </div>
                         </div>
                       </div>

                       {/* Stats Grid - Compact */}
                       <div className="grid grid-cols-2 gap-3 mb-4">
                         <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/20">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                               <Star className="w-4 h-4 text-yellow-400" />
                             </div>
                             <div>
                               <div className="text-base font-bold text-slate-200">{(repo.stargazers_count || 0).toLocaleString()}</div>
                               <div className="text-xs text-slate-500">Stars</div>
                             </div>
                           </div>
                         </div>
                         
                         <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/20">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                               <GitFork className="w-4 h-4 text-blue-400" />
                             </div>
                             <div>
                               <div className="text-base font-bold text-slate-200">{(repo.forks_count || 0).toLocaleString()}</div>
                               <div className="text-xs text-slate-500">Forks</div>
                             </div>
                           </div>
                         </div>
                         
                         <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/20">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                               <GitCommit className="w-4 h-4 text-green-400" />
                             </div>
                             <div>
                               <div className="text-base font-bold text-slate-200">{(commitCounts[repo.id] || repo.commits || 0).toLocaleString()}</div>
                               <div className="text-xs text-slate-500">Commits</div>
                             </div>
                           </div>
                         </div>
                         
                         <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/20">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                               <Eye className="w-4 h-4 text-purple-400" />
                             </div>
                             <div>
                               <div className="text-base font-bold text-slate-200">{(repo.watchers_count || 0).toLocaleString()}</div>
                               <div className="text-xs text-slate-500">Watchers</div>
                             </div>
                           </div>
                         </div>
                       </div>

                       {/* Language & Metadata - Enhanced Visibility */}
                       <div className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/20 mb-4">
                         {/* Language and License Row */}
                         <div className="flex items-center justify-between mb-3">
                           {repo.language ? (
                             <div className="flex items-center gap-3">
                               <div 
                                 className={`w-4 h-4 rounded-full ${languageColors[repo.language] || 'bg-slate-400'}`}
                               ></div>
                               <span className="text-sm font-semibold text-slate-200">{repo.language}</span>
                             </div>
                           ) : (
                             <span className="text-sm text-slate-400">No language specified</span>
                           )}
                           
                           {repo.license && (
                             <span className="text-xs bg-slate-600/50 text-slate-300 px-3 py-1 rounded-full border border-slate-600/40 font-medium">
                               {repo.license.name || repo.license}
                             </span>
                           )}
                         </div>

                         {/* Repository Info Grid - Better Spacing */}
                         <div className="grid grid-cols-1 gap-2">
                           <div className="flex items-center justify-between text-sm">
                             <div className="flex items-center gap-2 text-slate-300">
                               <Calendar className="w-4 h-4 text-slate-400" />
                               <span>Created:</span>
                             </div>
                             <span className="text-slate-400 font-medium">
                               {new Date(repo.created_at || new Date()).toLocaleDateString('en-US', { 
                                 month: 'short', 
                                 day: 'numeric',
                                 year: 'numeric' 
                               })}
                             </span>
                           </div>
                           
                           <div className="flex items-center justify-between text-sm">
                             <div className="flex items-center gap-2 text-slate-300">
                               <Clock className="w-4 h-4 text-slate-400" />
                               <span>Updated:</span>
                             </div>
                             <span className="text-slate-400 font-medium">
                               {new Date(repo.updated_at || repo.lastUpdated || new Date()).toLocaleDateString('en-US', { 
                                 month: 'short', 
                                 day: 'numeric',
                                 year: 'numeric' 
                               })}
                             </span>
                           </div>
                           
                           <div className="flex items-center justify-between text-sm">
                             <div className="flex items-center gap-2 text-slate-300">
                               <FileText className="w-4 h-4 text-slate-400" />
                               <span>Size:</span>
                             </div>
                             <span className="text-slate-400 font-medium">
                               {((repo.size || 0) / 1024).toFixed(1)} MB
                             </span>
                           </div>
                         </div>
                       </div>

                       {/* Repository Link/Button - Compact */}
                       <div className="mt-auto">
                         {showRepoLinks ? (
                           // Show clickable URL - Enhanced visibility
                           <div className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/20">
                             <div className="text-xs text-slate-500 mb-2">Repository URL:</div>
                             <a
                               href={repo.html_url || `https://github.com/${repo.name}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-emerald-400 hover:text-emerald-300 text-sm underline decoration-emerald-500/30 hover:decoration-emerald-400/60 transition-all duration-200 group block"
                               title={repo.html_url || `https://github.com/${repo.name}`}
                             >
                               <div className="flex items-start gap-2">
                                 <Github className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform mt-0.5" />
                                 <div className="flex-1 min-w-0">
                                   <div className="break-all leading-relaxed">
                                     {repo.html_url || `https://github.com/${repo.name}`}
                                   </div>
                                 </div>
                                 <ExternalLink className="w-3 h-3 flex-shrink-0 group-hover:translate-x-1 transition-transform mt-0.5" />
                               </div>
                             </a>
                           </div>
                         ) : (
                           // Show button
                           <motion.a
                             href={repo.html_url || `https://github.com/${repo.name}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600/80 hover:bg-emerald-500/90 backdrop-blur-xl rounded-lg border border-emerald-500/20 hover:border-emerald-400/40 shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 text-white text-sm font-medium group"
                             whileHover={{ scale: 1.02 }}
                             whileTap={{ scale: 0.98 }}
                           >
                             <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                             <span>View Repository</span>
                             <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                           </motion.a>
                         )}
                       </div>
                    </motion.div>
                  ))}
              </motion.div>
            </div>
          </div>

          {/* Instructions */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-slate-800/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-slate-600/20 shadow-lg">
              <div className="flex items-center gap-3 text-slate-300">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span className="text-sm">
                  Showcasing {repositories.filter(repo => selectedRepos.includes(repo.id)).length} repositories
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-500">Press ESC or click × to close</span>
              </div>
            </div>
          </motion.div>

          {/* Keyboard Handler */}
          <div
            className="absolute inset-0"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowSlideshow(false)
                // Remove body scroll prevention when slideshow closes
                document.body.classList.remove('no-scrollbar', 'overflow-hidden')
              }
            }}
            tabIndex={0}
            style={{ outline: 'none' }}
          />
        </motion.div>
      )}
    </div>
  )
}
