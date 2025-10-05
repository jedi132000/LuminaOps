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
  
  getSystemHealth: async (): Promise<SystemHealth> => {
    const response = await api.get('/monitoring/system-health')
    return response.data
  },

  // Enhanced monitoring endpoints
  getAlerts: async (status?: string) => {
    const response = await api.get('/monitoring/alerts', {
      params: status ? { status } : {}
    })
    return response.data
  },

  resolveAlert: async (alertId: string) => {
    const response = await api.post(`/monitoring/alerts/${alertId}/resolve`)
    return response.data
  },

  executeRemediation: async (alertId: string, action: string) => {
    const response = await api.post(`/monitoring/alerts/${alertId}/remediate`, {
      action
    })
    return response.data
  },

  getModelPerformance: async () => {
    const response = await api.get('/monitoring/model-performance')
    return response.data
  },

  getResourceUsage: async () => {
    const response = await api.get('/monitoring/resources')
    return response.data
  },

  getHistoricalMetrics: async (metric: string, timeRange: string) => {
    const response = await api.get('/monitoring/historical', {
      params: { metric, timeRange }
    })
    return response.data
  },

  exportMetrics: async (format: string = 'csv') => {
    const response = await api.get('/monitoring/export', {
      params: { format },
      responseType: 'blob'
    })
    return response.data
  },

  getSystemLogs: async (component: string, lines: number = 100) => {
    const response = await api.get('/monitoring/logs', {
      params: { component, lines }
    })
    return response.data
  },

  getTraces: async (traceId: string) => {
    const response = await api.get(`/monitoring/traces/${traceId}`)
    return response.data
  }
}

// AI Services API
export const aiAPI = {
  // LLM Services
  generateText: async (prompt: string, options?: {
    provider?: string
    model?: string
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
  }) => {
    const response = await api.post('/ai/llm/generate', {
      prompt,
      provider: options?.provider || 'openai',
      model_name: options?.model || 'gpt-4-turbo-preview',
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 1000,
      system_prompt: options?.systemPrompt
    })
    return response.data
  },

  generateCode: async (taskDescription: string, options?: {
    codeType?: string
    language?: string
  }) => {
    const response = await api.post('/ai/llm/generate-code', {
      task_description: taskDescription,
      code_type: options?.codeType || 'python_ml',
      language: options?.language || 'python'
    })
    return response.data
  },

  explainCode: async (code: string) => {
    const response = await api.post('/ai/llm/explain-code', { code })
    return response.data
  },

  // Data Analysis Services
  analyzeData: async (file: File, analysisType: string = 'summary') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('analysis_type', analysisType)
    
    const response = await api.post('/ai/assistant/analyze-data', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  recommendModel: async (datasetInfo: any, problemDescription: string) => {
    const response = await api.post('/ai/assistant/recommend-model', {
      dataset_info: datasetInfo,
      problem_description: problemDescription
    })
    return response.data
  },

  // AutoML Services
  trainAutoML: async (file: File, options: {
    targetColumn: string
    problemType: string
    modelType?: string
    timeBudget?: number
  }) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('target_column', options.targetColumn)
    formData.append('problem_type', options.problemType)
    formData.append('model_type', options.modelType || 'flaml')
    formData.append('time_budget', options.timeBudget?.toString() || '300')
    
    const response = await api.post('/ai/automl/upload-and-train', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  listAutoMLModels: async () => {
    const response = await api.get('/ai/automl/models')
    return response.data
  },

  predictAutoML: async (modelId: string, data: any[]) => {
    const response = await api.post(`/ai/automl/predict/${modelId}`, data)
    return response.data
  },

  // Vector Database Services
  addDocuments: async (documents: Array<{
    id: string
    content: string
    metadata?: Record<string, any>
  }>) => {
    const response = await api.post('/ai/vector-db/add-documents', documents)
    return response.data
  },

  searchDocuments: async (query: string, topK: number = 10) => {
    const response = await api.post('/ai/vector-db/search', {
      query,
      top_k: topK
    })
    return response.data
  }
}

export default api