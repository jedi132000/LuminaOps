import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import Dashboard from './pages/Dashboard'
import Experiments from './pages/Experiments'
import Models from './pages/Models'
import Pipelines from './pages/Pipelines'
import Monitoring from './pages/Monitoring'
import AIAssistant from './pages/AIAssistant'
import AutoMLTraining from './pages/AutoMLTraining'
import Login from './pages/Login'
import { useAuthStore } from './store/authStore'

const { Content } = Layout

function App() {
  const { isAuthenticated, user, token } = useAuthStore()
  
  console.log('🏠 App: Authentication state:', { isAuthenticated, user: user?.username, hasToken: !!token });

  if (!isAuthenticated) {
    console.log('🔒 App: Not authenticated, showing Login component');
    return <Login />
  }

  console.log('✅ App: Authenticated, showing Dashboard');

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout>
          <Header />
          <Content style={{ margin: '16px', padding: '24px', background: '#fff' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/experiments" element={<Experiments />} />
              <Route path="/models" element={<Models />} />
              <Route path="/pipelines" element={<Pipelines />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/automl" element={<AutoMLTraining />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  )
}

export default App