export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  size: number
  license: {
    name: string
    spdx_id: string
  } | null
  updated_at: string
  created_at: string
  pushed_at: string
  default_branch: string
  open_issues_count: number
  private: boolean
  fork: boolean
  archived: boolean
  disabled: boolean
}

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  bio: string | null
  company: string | null
  location: string | null
  email: string | null
  blog?: string | null
  twitter_username?: string | null
  public_repos: number
  public_gists?: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export interface GitHubError {
  message: string
  documentation_url?: string
}

const GITHUB_API_BASE = 'https://api.github.com'

class GitHubAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'GitHubAPIError'
  }
}

export class GitHubService {
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'RepoShine-App',
    }
    
    // Add GitHub token if available (increases rate limit from 60 to 5000 requests/hour)
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN
    if (token) {
      headers['Authorization'] = `token ${token}`
    }
    
    return headers
  }

  private async fetchFromGitHub<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
        headers: this.getHeaders(),
        next: { revalidate: 300 }, // Cache for 5 minutes
      })

      if (!response.ok) {
        const errorData: GitHubError = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`
        }))
        
        // Handle rate limit specifically
        if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
          const resetTime = response.headers.get('X-RateLimit-Reset')
          const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null
          const resetMessage = resetDate ? 
            ` Rate limit resets at ${resetDate.toLocaleTimeString()}.` : ''
          
          throw new GitHubAPIError(
            `GitHub API rate limit exceeded.${resetMessage} Consider adding a GitHub token to increase the limit.`,
            response.status
          )
        }
        
        throw new GitHubAPIError(
          errorData.message || `Request failed with status ${response.status}`,
          response.status
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof GitHubAPIError) {
        throw error
      }
      throw new GitHubAPIError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      )
    }
  }

  async getUser(username: string): Promise<GitHubUser> {
    return this.fetchFromGitHub<GitHubUser>(`/users/${username}`)
  }

  async getUserRepositories(username: string): Promise<GitHubRepository[]> {
    // Fetch all repositories (GitHub API returns max 100 per page)
    const allRepos: GitHubRepository[] = []
    let page = 1
    const perPage = 100

    while (true) {
      const repos = await this.fetchFromGitHub<GitHubRepository[]>(
        `/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated&direction=desc`
      )

      if (repos.length === 0) break

      // Filter out private repos and forks (optional)
      const publicRepos = repos.filter(repo => !repo.private && !repo.fork)
      allRepos.push(...publicRepos)

      // If we got less than perPage, we've reached the end
      if (repos.length < perPage) break
      page++
    }

    // Sort by stars (descending) and updated date
    return allRepos.sort((a, b) => {
      // Primary sort: stars
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count
      }
      // Secondary sort: updated date
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })
  }

  async getRepositoryCommits(username: string, repoName: string): Promise<number> {
    try {
      // Get the default branch first
      const repo = await this.fetchFromGitHub<GitHubRepository>(`/repos/${username}/${repoName}`)
      
      // Get commits count from the default branch
      const commits = await this.fetchFromGitHub<any[]>(
        `/repos/${username}/${repoName}/commits?sha=${repo.default_branch}&per_page=1`
      )
      
      // GitHub doesn't directly provide total commit count, so we'll use a heuristic
      // This is a simplified approach - for exact count, you'd need to paginate through all commits
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${username}/${repoName}/commits?sha=${repo.default_branch}&per_page=1`,
        {
          headers: this.getHeaders(),
        }
      )
      
      const linkHeader = response.headers.get('Link')
      if (linkHeader) {
        const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/)
        if (lastPageMatch) {
          return parseInt(lastPageMatch[1], 10)
        }
      }
      
      // Fallback: estimate based on repository age and activity
      const daysSinceCreation = Math.floor(
        (Date.now() - new Date(repo.created_at).getTime()) / (1000 * 60 * 60 * 24)
      )
      return Math.max(1, Math.floor(daysSinceCreation / 7)) // Rough estimate
    } catch (error) {
      console.warn(`Could not fetch commit count for ${username}/${repoName}:`, error)
      return 0
    }
  }
}

export const githubService = new GitHubService() 