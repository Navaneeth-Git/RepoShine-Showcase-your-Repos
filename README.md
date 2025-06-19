# ✨ RepoShine

A modern web application that allows users to showcase their GitHub repositories in a stylish, personalized, and shareable page with beautiful glassmorphism design and smooth animations.

![RepoShine Preview](https://img.shields.io/badge/Status-In%20Development-yellow)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animations-purple)

## 🌟 Features

### Core Features
- **GitHub Username Input** - Paste any GitHub username to fetch repositories
- **Public Repository Fetching** - Uses GitHub REST API to get all public repos
- **Smart Sorting** - Repositories sorted by star count (descending) by default
- **Beautiful Repo Cards** - Each repository displayed in stunning glassmorphism cards
- **User Curation** - Select/deselect repositories for your personal showcase
- **Shareable URLs** - Generate custom showcase links (e.g., reposhine.com/username)

### Repository Card Details
- Repository name and description
- Primary programming language with color coding
- Star count ⭐
- Fork count 🍴
- Commit count 📝
- License information
- Last updated timestamp
- Direct GitHub link

### Design & UX
- **Glassmorphism Design** - Transparent blurred cards with soft borders
- **Dark Mode Friendly** - Beautiful dark theme with gradient backgrounds
- **Framer Motion Animations** - Smooth interactions and loading states
- **Responsive Layout** - Perfect on mobile and desktop
- **Interactive Elements** - Hover effects, smooth transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd reposhine
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API**: GitHub REST API

## 📁 Project Structure

```
reposhine/
├── app/
│   ├── globals.css          # Global styles with glassmorphism utilities
│   ├── layout.tsx           # Root layout with dark mode support
│   └── page.tsx             # Main homepage component
├── public/                  # Static assets
├── package.json            # Dependencies and scripts
└── README.md              # Project documentation
```

## 🎨 Design System

### Glassmorphism Components
- `.glassmorphism` - Basic glass effect for headers/containers
- `.glassmorphism-card` - Enhanced glass effect for repository cards
- `.gradient-text` - Beautiful gradient text styling
- `.glow-effect` - Subtle shadow effects

### Color Palette
- **Primary**: Purple to Pink gradients
- **Secondary**: Blue accent colors
- **Background**: Dark slate with purple tints
- **Text**: White with gray variations
- **Language Colors**: Unique colors for each programming language

## 🔮 Upcoming Features

### Stretch Goals
- [ ] "Feature This Repo" badges and tags
- [ ] Analytics dashboard for showcase views
- [ ] Download showcase as PDF
- [ ] Custom user bio and profile pictures
- [ ] Repository status badges (WIP, Archived, Popular)
- [ ] GitHub API integration for real data
- [ ] Custom themes and color schemes
- [ ] Share on social media
- [ ] Repository search and filtering

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- GitHub REST API for repository data
- Next.js team for the amazing framework
- Tailwind CSS for utility-first styling
- Framer Motion for smooth animations
- Lucide React for beautiful icons

---

**Made with ❤️ and lots of ✨ glassmorphism**
