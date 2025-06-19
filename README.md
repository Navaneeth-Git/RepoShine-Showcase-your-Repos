# ✨ RepoShine

A modern, interactive web application that transforms GitHub repositories into stunning, shareable portfolio showcases. Built with Next.js 15 and TypeScript, RepoShine lets users create beautiful, animated presentations of their GitHub projects with glassmorphism design, interactive slideshows, and professional portfolio features.

![RepoShine Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-purple)

## 🎯 What is RepoShine?

RepoShine is a **GitHub Portfolio Showcase Generator** that allows developers, students, and professionals to:

- **Transform their GitHub profile** into a visually stunning, interactive portfolio
- **Create shareable links** to showcase selected repositories professionally
- **Generate presentation-ready slideshows** of their projects for interviews, conferences, or client meetings
- **Curate their best work** by selecting which repositories to highlight
- **Present projects in fullscreen mode** with smooth animations and beautiful design

Perfect for job interviews, portfolio presentations, client showcases, conference talks, or simply sharing your work in a more engaging way than a standard GitHub profile.

## 🌟 Complete Feature Set

### 🔍 GitHub Integration
- **Real-time GitHub API Integration** - Fetch live data from any public GitHub profile
- **Comprehensive Repository Data** - Name, description, language, stars, forks, commits, license, and more
- **User Profile Integration** - Display avatar, bio, follower/following counts, and repository statistics
- **Smart Repository Sorting** - Automatically sorted by star count and last updated date
- **Rate Limit Handling** - Graceful error handling with informative messages
- **Commit Count Estimation** - Advanced algorithm to estimate commit counts per repository

### 🎨 Modern UI/UX Design
- **Glassmorphism Design System** - Beautiful transparent, blurred glass effects throughout
- **Animated Landing Page** - Stunning orbital bubble animations with smooth transitions
- **Dark Mode Optimized** - Professional dark theme with gradient backgrounds
- **Framer Motion Animations** - Smooth page transitions, loading states, and interactive effects
- **Responsive Layout** - Perfect experience on mobile, tablet, and desktop
- **Interactive Hover Effects** - Engaging micro-interactions and state feedback

### 📊 Repository Showcase Features
- **Beautiful Repository Cards** - Each repo displayed in stunning glassmorphism cards
- **Rich Repository Metadata** - Display all key statistics and information
- **Programming Language Indicators** - Color-coded language badges with visual appeal
- **License Information Display** - Clear license type indication
- **Direct GitHub Links** - Easy access to original repositories
- **Last Updated Timestamps** - Human-readable date formatting
- **Repository Selection** - Toggle repositories on/off for custom curation

### 🎬 Interactive Slideshow Mode
- **Fullscreen Presentation Mode** - Professional slideshow for presentations
- **Variable Speed Control** - Adjustable slideshow timing (0.5s to 8s per slide)
- **Animated Backgrounds** - Dynamic floating elements and gradients
- **User Profile Header** - Integrated profile information in slideshow
- **QR Code Generation** - Live QR codes for each repository for easy sharing
- **Smooth Repository Transitions** - Infinite scrolling with seamless animations
- **Interactive Controls** - Play/pause, speed adjustment, and fullscreen toggle

### 🛠 Advanced Technical Features
- **QR Code Integration** - Dynamic QR code generation for repository links
- **Fullscreen API Support** - Native browser fullscreen functionality
- **Local State Management** - Efficient React state handling with hooks
- **Error Boundary Handling** - Comprehensive error states and user feedback
- **Performance Optimized** - Lazy loading and efficient API calls
- **TypeScript Strict Mode** - Full type safety throughout the application
- **Modern React Patterns** - Hooks, concurrent features, and best practices

### 🎯 User Experience Features
- **Demo Mode** - Pre-loaded mock data for immediate user experience
- **Loading States** - Beautiful loading animations and skeleton screens
- **Error Handling** - User-friendly error messages with actionable guidance
- **Form Validation** - Input validation with helpful error messaging
- **Keyboard Navigation** - Full keyboard accessibility support
- **URL State Management** - Shareable URLs for specific user showcases

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm, yarn, or pnpm package manager
- Optional: GitHub Personal Access Token (for higher API rate limits)

### Quick Start

1. **Clone and Install**
```bash
git clone https://github.com/your-username/reposhine.git
cd reposhine
npm install
```

2. **Environment Setup (Optional)**
```bash
# Create .env.local for higher GitHub API rate limits
echo "NEXT_PUBLIC_GITHUB_TOKEN=your_github_token_here" > .env.local
```

3. **Run Development Server**
```bash
npm run dev
```

4. **Open Application**
Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment
```bash
npm run build
npm start
```

## 🛠 Technology Stack

### Core Framework
- **Next.js 15** - React framework with App Router and server components
- **TypeScript 5** - Full type safety and modern JavaScript features
- **React 19** - Latest React with concurrent features

### Styling & Animation
- **Tailwind CSS 4** - Utility-first CSS framework with custom configurations
- **Framer Motion 12** - Production-ready motion library for React
- **Custom Glassmorphism** - Handcrafted glass effect utilities

### External Integrations
- **GitHub REST API** - Official GitHub API for repository data
- **QRCode Library** - Dynamic QR code generation for sharing
- **Lucide React** - Beautiful, customizable icon library

### Development Tools
- **TypeScript Strict Mode** - Enhanced type checking and safety
- **ESLint & Prettier** - Code quality and formatting
- **Turbopack** - Ultra-fast bundler for development

## 📁 Project Architecture

```
reposhine/
├── app/                     # Next.js App Router
│   ├── globals.css         # Global styles & glassmorphism utilities
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Main application component (1900+ lines)
├── lib/
│   └── github.ts           # GitHub API service layer
├── public/                 # Static assets and icons
├── package.json           # Dependencies & scripts
└── README.md             # Project documentation
```

### Key Components
- **HomePage Component** - Main application with all interactive features
- **GitHubService Class** - Robust API integration with error handling
- **QRCode Component** - Dynamic QR code generation with custom styling
- **Slideshow Mode** - Full-featured presentation system
- **Repository Cards** - Reusable, animated repository displays

## 🎨 Design System

### Glassmorphism Effects
```css
.glassmorphism           # Basic glass effect for headers
.glassmorphism-card      # Enhanced glass for repository cards
.gradient-text           # Beautiful gradient text styling
.glow-effect            # Subtle shadow and glow effects
```

### Animation Patterns
- **Orbital Animations** - Floating bubble effects on landing page
- **Stagger Animations** - Sequential card appearances
- **Hover Interactions** - Smooth scale and color transitions
- **Loading States** - Professional skeleton and spinner animations

### Color System
- **Primary Gradients** - Purple to pink, blue to cyan combinations
- **Language Colors** - Unique colors for each programming language
- **Status Colors** - Success, warning, and error state indicators
- **Glass Transparency** - Carefully tuned alpha values for depth

## 🔧 Configuration & Customization

### GitHub API Setup
1. Generate a Personal Access Token at [GitHub Settings](https://github.com/settings/tokens)
2. Add to `.env.local`: `NEXT_PUBLIC_GITHUB_TOKEN=your_token`
3. Increases rate limit from 60 to 5,000 requests/hour

### Slideshow Customization
- Speed range: 0.5 to 8 seconds per repository
- Fullscreen support with native browser APIs
- Customizable background animations and effects

### Styling Customization
- Tailwind configuration in `tailwind.config.ts`
- Custom CSS utilities in `globals.css`
- Framer Motion variants for consistent animations

## 🚀 Upcoming Features & Roadmap

### 🔮 Planned Enhancements
- [ ] **PDF Export** - Download showcase as presentation PDF
- [ ] **Custom Themes** - Multiple color schemes and design variants
- [ ] **Analytics Dashboard** - Track showcase views and engagement
- [ ] **Social Media Integration** - Direct sharing to Twitter, LinkedIn
- [ ] **Custom Bio Sections** - Rich text editor for personal descriptions
- [ ] **Repository Filtering** - Search and filter by language, stars, etc.
- [ ] **Team Showcases** - Multi-user organization presentations
- [ ] **Embed Widgets** - Embeddable repository cards for websites

### 🎯 Technical Improvements
- [ ] **Progressive Web App** - Offline support and installation
- [ ] **Performance Monitoring** - Real user metrics and optimization
- [ ] **Accessibility Audit** - WCAG 2.1 compliance improvements
- [ ] **API Caching** - Redis caching for improved performance

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript strict mode requirements
- Maintain Tailwind CSS utility patterns
- Add Framer Motion animations for new interactive elements
- Test with multiple GitHub profiles and edge cases

## 🙏 Acknowledgments

- **GitHub** - For providing the excellent REST API
- **Vercel** - For Next.js and deployment platform
- **Tailwind Labs** - For the utility-first CSS framework
- **Framer** - For the incredible Motion library
- **Lucide** - For beautiful, consistent icons
- **QRCode.js** - For reliable QR code generation

---

**Built with ❤️ and powered by ✨ modern web technologies**

*Transform your GitHub profile into a stunning portfolio showcase today!*
