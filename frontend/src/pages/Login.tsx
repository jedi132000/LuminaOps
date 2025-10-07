import React, { useState } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuthStore } from '../store/authStore'
import type { LoginRequest } from '../types/api'

const Login: React.FC = () => {
  const login = useAuthStore((state) => state.login)
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: LoginRequest) => {
    console.log('🔐 Login attempt started with values:', values);
    setLoading(true);
    
    try {
      console.log('📡 Making API call to:', 'http://localhost:8002/api/v1/auth/login');
      
      const response = await fetch('http://localhost:8002/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login response data:', data);
        
        const mockUser = {
          id: 1,
          username: values.username,
          email: `${values.username}@example.com`,
          is_active: true,
          created_at: new Date().toISOString(),
          premium_credits: 1500,
        };
        
        console.log('👤 User object:', mockUser);
        console.log('🔑 JWT Token:', data.access_token);
        
        login(data.access_token, mockUser);
        console.log('🎉 Login successful, calling auth store');
        message.success('Login successful!');
      } else {
        const errorData = await response.text();
        console.error('❌ Login failed:', response.status, errorData);
        message.error(`Login failed: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('🚨 Login error:', error);
      message.error('Network error: Please check your connection.');
    } finally {
      setLoading(false);
      console.log('🏁 Login attempt completed');
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card
        title="LuminaOps Login"
        style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
      >
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16, color: '#666' }}>
          <p>Demo Credentials:</p>
          <p>Username: <strong>admin</strong></p>
          <p>Password: <strong>admin</strong></p>
        </div>
      </Card>
    </div>
  )
}

export default Login