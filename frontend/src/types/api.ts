export interface User {
  id: number
  username: string
  email: string
  is_active: boolean
  created_at: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface Experiment {
  id: string
  name: string
  description?: string
  status: string
  parameters: Record<string, any>
  metrics: Record<string, number>
  tags: string[]
  created_at: string
  updated_at: string
  created_by: string
}

export interface Model {
  id: string
  name: string
  version: string
  description?: string
  framework: string
  status: string
  metrics: Record<string, number>
  tags: string[]
  created_at: string
  updated_at: string
  created_by: string
}

export interface Pipeline {
  id: string
  name: string
  description?: string
  status: string
  steps: Array<Record<string, any>>
  schedule?: string
  tags: string[]
  created_at: string
  updated_at: string
  created_by: string
  last_run?: string
}

export interface Metric {
  name: string
  value: number
  timestamp: string
  labels: Record<string, string>
}

export interface SystemHealth {
  status: string
  services: Record<string, string>
  uptime: string
  last_check: string
}