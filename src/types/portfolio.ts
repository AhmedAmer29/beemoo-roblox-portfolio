export type Project = {
  title: string
  visits: string
  status: 'Released' | 'In development'
  contribution: string
  collaboration: string
  image?: string
  imageAlt?: string
  url?: string
  featured?: boolean
}

export type Framework = {
  id: string
  name: string
  category: string
  summary: string
  serverSummary: string
  clientSummary: string
  capabilities: string[]
  serverCode: string
  clientCode: string
  language: string
}
