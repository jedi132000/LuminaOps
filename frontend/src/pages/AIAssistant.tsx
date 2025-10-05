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
      const errorMessage = error.response?.data?.response || error.response?.data?.detail || 'AI service not available';
      message.error(`AI Error: ${errorMessage}`);
      setTextResult(`AI Response: ${errorMessage}\n\n⚠️ Note: This is a development environment. For full AI functionality, configure API keys in the backend settings.`);
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
          <Space direction="vertical" className="w-full">
            <div>
              <Text strong>Generate Python ML code:</Text>
            </div>
            <TextArea
              placeholder="e.g., Create a random forest classifier for customer churn prediction"
              rows={3}
            />
            <Button 
              type="primary" 
              onClick={() => message.info('Code generation requires API key configuration')}
            >
              Generate Code
            </Button>
            
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <Text strong>Sample Output:</Text>
              <pre className="mt-2 text-sm">
{`# Random Forest Classifier for Customer Churn
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# Load your dataset
# df = pd.read_csv('customer_data.csv')

# Prepare features and target
X = df.drop('churn', axis=1)
y = df['churn']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Make predictions
predictions = rf_model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Accuracy: {accuracy:.4f}")
print(classification_report(y_test, predictions))`}
              </pre>
              <div className="mt-2">
                <Text type="secondary">
                  ⚠️ This is a sample. Configure OpenAI/Anthropic API keys for custom code generation.
                </Text>
              </div>
            </div>
          </Space>
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