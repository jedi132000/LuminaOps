import React, { useState } from 'react';
import { 
  Card, 
  Upload, 
  Button, 
  Select, 
  Form, 
  InputNumber,
  message, 
  Typography,
  Table,
  Tag,
  Progress,
  Divider
} from 'antd';
import { UploadOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { aiAPI } from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

interface AutoMLModel {
  id: string;
  score: number;
  metrics: Record<string, number>;
  config: any;
  created_at: string;
}

const AutoMLTraining: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [trainingResult, setTrainingResult] = useState<any>(null);
  const [models, setModels] = useState<AutoMLModel[]>([]);
  const [form] = Form.useForm();

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    message.success(`${file.name} uploaded successfully`);
    return false; // Prevent auto upload
  };

  const handleTraining = async (values: any) => {
    if (!uploadedFile) {
      message.error('Please upload a dataset first');
      return;
    }

    setLoading(true);
    try {
      const result = await aiAPI.trainAutoML(uploadedFile, {
        targetColumn: values.targetColumn,
        problemType: values.problemType,
        modelType: values.modelType,
        timeBudget: values.timeBudget
      });

      setTrainingResult(result);
      message.success('AutoML training completed!');
      
      // Refresh models list
      await loadModels();
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Training failed');
      setTrainingResult({
        error: 'AutoML training failed. Please check your dataset and configuration.',
        dataset_info: { shape: [0, 0], columns: [] }
      });
    }
    setLoading(false);
  };

  const loadModels = async () => {
    try {
      const result = await aiAPI.listAutoMLModels();
      setModels(result.models || []);
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  };

  const uploadProps = {
    beforeUpload: handleFileUpload,
    accept: '.csv',
  };

  const modelColumns = [
    {
      title: 'Model ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => (
        <Tag color={score > 0.8 ? 'green' : score > 0.6 ? 'orange' : 'red'}>
          {(score * 100).toFixed(1)}%
        </Tag>
      ),
    },
    {
      title: 'Problem Type',
      dataIndex: ['config', 'problem_type'],
      key: 'problem_type',
    },
    {
      title: 'Model Type',
      dataIndex: ['config', 'model_type'],
      key: 'model_type',
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  React.useEffect(() => {
    loadModels();
  }, []);

  return (
    <div className="p-6">
      <Title level={2}>AutoML Training</Title>
      <Text type="secondary">
        Upload your dataset and let AI automatically find the best machine learning model
      </Text>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Training Configuration */}
        <Card title="Configure AutoML Training" className="h-fit">
          <Form form={form} onFinish={handleTraining} layout="vertical">
            <Form.Item label="Upload Dataset">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>
                  Select CSV File
                </Button>
              </Upload>
              {uploadedFile && (
                <Text type="success" className="mt-2 block">
                  ✓ {uploadedFile.name} ready for training
                </Text>
              )}
            </Form.Item>

            <Form.Item
              name="targetColumn"
              label="Target Column"
              rules={[{ required: true, message: 'Please specify target column' }]}
            >
              <Select placeholder="Select target column to predict">
                <Option value="target">target</Option>
                <Option value="label">label</Option>
                <Option value="y">y</Option>
                <Option value="class">class</Option>
                <Option value="outcome">outcome</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="problemType"
              label="Problem Type"
              rules={[{ required: true, message: 'Please select problem type' }]}
              initialValue="classification"
            >
              <Select>
                <Option value="classification">Classification</Option>
                <Option value="regression">Regression</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="modelType"
              label="AutoML Engine"
              initialValue="flaml"
            >
              <Select>
                <Option value="flaml">FLAML (Microsoft)</Option>
                <Option value="autosklearn">Auto-sklearn</Option>
                <Option value="tpot">TPOT</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="timeBudget"
              label="Time Budget (seconds)"
              initialValue={300}
            >
              <InputNumber min={60} max={3600} className="w-full" />
            </Form.Item>

            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              disabled={!uploadedFile}
              icon={<PlayCircleOutlined />}
              className="w-full"
            >
              Start AutoML Training
            </Button>
          </Form>
        </Card>

        {/* Training Results */}
        <Card title="Training Results">
          {loading && (
            <div className="text-center py-8">
              <Progress 
                type="circle" 
                percent={75} 
                status="active"
                format={() => 'Training...'}
              />
              <div className="mt-4">
                <Text>AI is finding the best model for your data...</Text>
              </div>
            </div>
          )}

          {trainingResult && !loading && (
            <div>
              {trainingResult.error ? (
                <Text type="danger">{trainingResult.error}</Text>
              ) : (
                <>
                  <div className="mb-4">
                    <Text strong>Model Performance:</Text>
                    <div className="mt-2">
                      <Tag color="green" className="text-lg">
                        Score: {(trainingResult.score * 100).toFixed(1)}%
                      </Tag>
                    </div>
                  </div>

                  <Divider />

                  <div className="mb-4">
                    <Text strong>Dataset Info:</Text>
                    <div className="mt-2">
                      <Text code>
                        Shape: {trainingResult.dataset_info?.shape?.join(' x ') || 'Unknown'}
                      </Text>
                      <br />
                      <Text code>
                        Features: {trainingResult.dataset_info?.columns?.length || 0}
                      </Text>
                    </div>
                  </div>

                  {trainingResult.metrics && (
                    <>
                      <Divider />
                      <div>
                        <Text strong>Detailed Metrics:</Text>
                        <div className="mt-2">
                          {Object.entries(trainingResult.metrics).map(([key, value]: [string, any]) => (
                            <div key={key} className="mb-1">
                              <Text code>{key}: {value?.toFixed?.(4) || value}</Text>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Models List */}
      <Card title="Trained Models" className="mt-6">
        <Table 
          dataSource={models}
          columns={modelColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default AutoMLTraining;