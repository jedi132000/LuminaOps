import React, { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Input, 
  Button, 
  message, 
  Typography,
  Space
} from 'antd';
import { 
  RobotOutlined, 
  CodeOutlined, 
  UploadOutlined, 
  ExperimentOutlined
} from '@ant-design/icons';
import { aiAPI } from '../services/api';

const { TextArea } = Input;
const { Title, Text } = Typography;

const AIAssistant: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [textPrompt, setTextPrompt] = useState('');
  const [textResult, setTextResult] = useState('');

  const handleTextGeneration = async () => {
    if (!textPrompt.trim()) return;
    
    setLoading(true);
    try {
      const result = await aiAPI.generateText(textPrompt, {
        provider: 'openai',
        temperature: 0.7,
        maxTokens: 500
      });
      setTextResult(result.response);
    } catch (error: any) {
      message.error('AI service not available. Please check API keys configuration.');
      setTextResult('Error: AI service not available. Please check API keys configuration.');
    }
    setLoading(false);
  };

  const tabItems = [
    {
      key: 'text',
      label: (
        <span>
          <RobotOutlined />
          Text Generation
        </span>
      ),
      children: (
        <Card>
          <Space direction="vertical" className="w-full">
            <div>
              <Text strong>Ask AI anything about ML, data science, or get explanations:</Text>
            </div>
            <TextArea
              placeholder="e.g., Explain gradient descent algorithm in simple terms..."
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              rows={3}
            />
            <Button 
              type="primary" 
              onClick={handleTextGeneration}
              loading={loading}
              disabled={!textPrompt.trim()}
            >
              Generate Response
            </Button>
            
            {textResult && (
              <Card className="bg-gray-50">
                <Text strong>AI Response:</Text>
                <div className="mt-2 whitespace-pre-wrap">
                  {textResult}
                </div>
              </Card>
            )}
          </Space>
        </Card>
      ),
    },
    {
      key: 'code',
      label: (
        <span>
          <CodeOutlined />
          Code Generation
        </span>
      ),
      children: (
        <Card>
          <Text>Code generation functionality - Coming Soon!</Text>
          <div className="mt-4">
            <Text type="secondary">
              This feature will generate Python ML code based on your descriptions.
            </Text>
          </div>
        </Card>
      ),
    },
    {
      key: 'analysis',
      label: (
        <span>
          <UploadOutlined />
          Data Analysis
        </span>
      ),
      children: (
        <Card>
          <Text>Data analysis functionality - Coming Soon!</Text>
          <div className="mt-4">
            <Text type="secondary">
              Upload CSV files for AI-powered data analysis and insights.
            </Text>
          </div>
        </Card>
      ),
    },
    {
      key: 'recommendation',
      label: (
        <span>
          <ExperimentOutlined />
          Model Recommendation
        </span>
      ),
      children: (
        <Card>
          <Text>Model recommendation functionality - Coming Soon!</Text>
          <div className="mt-4">
            <Text type="secondary">
              Get AI recommendations for the best ML models for your data.
            </Text>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <RobotOutlined className="text-3xl text-blue-500 mr-3" />
        <Title level={2} className="m-0">AI Assistant</Title>
      </div>
      
      <Tabs 
        defaultActiveKey="text" 
        size="large"
        items={tabItems}
      />
    </div>
  );
};

export default AIAssistant;