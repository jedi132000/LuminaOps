import axios from 'axios'
import type { 
  LoginRequest, 
  LoginResponse, 
  User, 
  Experiment, 
  Model, 
  Pipeline, 
  Metric, 
  SystemHealth 
} from '@/types/api'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002'

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage')
  if (token) {
    const authData = JSON.parse(token)
    if (authData?.state?.token) {
      config.headers.Authorization = `Bearer ${authData.state.token}`
    }
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data
  },
  
  refreshToken: async (): Promise<LoginResponse> => {
    const response = await api.post('/auth/refresh')
    return response.data
  },
}

// Experiments API
export const experimentsAPI = {
  list: async (): Promise<Experiment[]> => {
    const response = await api.get('/experiments')
    return response.data
  },
  
  create: async (experiment: Partial<Experiment>): Promise<Experiment> => {
    const response = await api.post('/experiments', experiment)
    return response.data
  },
  
  get: async (id: string): Promise<Experiment> => {
    const response = await api.get(`/experiments/${id}`)
    return response.data
  },
  
  createRun: async (experimentId: string, runData: any) => {
    const response = await api.post(`/experiments/${experimentId}/runs`, runData)
    return response.data
  },
}

// Models API
export const modelsAPI = {
  list: async (): Promise<Model[]> => {
    const response = await api.get('/models')
    return response.data
  },
  
  register: async (model: Partial<Model>): Promise<Model> => {
    const response = await api.post('/models', model)
    return response.data
  },
  
  get: async (id: string): Promise<Model> => {
    const response = await api.get(`/models/${id}`)
    return response.data
  },
  
  deploy: async (id: string) => {
    const response = await api.post(`/models/${id}/deploy`)
    return response.data
  },
}

// Pipelines API
export const pipelinesAPI = {
  list: async (): Promise<Pipeline[]> => {
    const response = await api.get('/pipelines')
    return response.data
  },
  
  create: async (pipeline: Partial<Pipeline>): Promise<Pipeline> => {
    const response = await api.post('/pipelines', pipeline)
    return response.data
  },
  
  get: async (id: string): Promise<Pipeline> => {
    const response = await api.get(`/pipelines/${id}`)
    return response.data
  },
  
  run: async (id: string) => {
    const response = await api.post(`/pipelines/${id}/run`)
    return response.data
  },
}

// Monitoring API
export const monitoringAPI = {
  getMetrics: async (): Promise<Metric[]> => {
    const response = await api.get('/monitoring/metrics')
    return response.data
  },
  
  getHealth: async (): Promise<SystemHealth> => {
    const response = await api.get('/monitoring/health')
    return response.data
  },
  
  getAlerts: async () => {
    const response = await api.get('/monitoring/alerts')
    return response.data
  },
  
  getDashboardData: async () => {
    const response = await api.get('/monitoring/dashboard')
    return response.data
  },
}

export default api