import React from 'react';
import { Card, Row, Col, Statistic, Progress, Alert, Table } from 'antd';
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';

const Monitoring: React.FC = () => {
  const systemHealth = [
    {
      title: 'API Response Time',
      value: 145,
      suffix: 'ms',
      status: 'success',
    },
    {
      title: 'Model Accuracy',
      value: 94.2,
      suffix: '%',
      status: 'success',
    },
    {
      title: 'Error Rate',
      value: 0.03,
      suffix: '%',
      status: 'warning',
    },
    {
      title: 'Throughput',
      value: 1250,
      suffix: 'req/min',
      status: 'success',
    },
  ];

  const alerts = [
    {
      key: '1',
      severity: 'warning',
      message: 'High memory usage detected on ML Pipeline Worker 3',
      timestamp: '2024-01-15 14:30:22',
      status: 'active',
    },
    {
      key: '2',
      severity: 'error',
      message: 'Model deployment failed for ResNet-50 v1.3',
      timestamp: '2024-01-15 13:15:10',
      status: 'resolved',
    },
    {
      key: '3',
      severity: 'info',
      message: 'Scheduled maintenance window starting in 2 hours',
      timestamp: '2024-01-15 12:00:00',
      status: 'scheduled',
    },
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <ExclamationCircleOutlined className="text-red-500" />;
      case 'warning':
        return <ExclamationCircleOutlined className="text-yellow-500" />;
      case 'info':
        return <CheckCircleOutlined className="text-blue-500" />;
      default:
        return <ClockCircleOutlined className="text-gray-500" />;
    }
  };

  const alertColumns = [
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => (
        <span className="flex items-center">
          {getSeverityIcon(severity)}
          <span className="ml-2 capitalize">{severity}</span>
        </span>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`capitalize ${
          status === 'active' ? 'text-red-600' : 
          status === 'resolved' ? 'text-green-600' : 
          'text-blue-600'
        }`}>
          {status}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Monitoring & Observability</h1>
      
      <Row gutter={[16, 16]} className="mb-6">
        {systemHealth.map((metric, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={metric.title}
                value={metric.value}
                suffix={metric.suffix}
                valueStyle={{ 
                  color: metric.status === 'success' ? '#52c41a' : 
                         metric.status === 'warning' ? '#faad14' : '#f5222d' 
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={8}>
          <Card title="System Resources" className="h-full">
            <div className="space-y-4">
              <div>
                <p className="mb-1">CPU Usage</p>
                <Progress percent={75} status="active" />
              </div>
              <div>
                <p className="mb-1">Memory Usage</p>
                <Progress percent={62} />
              </div>
              <div>
                <p className="mb-1">GPU Usage</p>
                <Progress percent={89} status="active" />
              </div>
              <div>
                <p className="mb-1">Disk I/O</p>
                <Progress percent={45} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card title="Model Performance" className="h-full">
            <div className="space-y-4">
              <div>
                <p className="mb-1">ResNet-50 Accuracy</p>
                <Progress percent={94} strokeColor="#52c41a" />
              </div>
              <div>
                <p className="mb-1">BERT Sentiment F1-Score</p>
                <Progress percent={87} strokeColor="#52c41a" />
              </div>
              <div>
                <p className="mb-1">XGBoost Precision</p>
                <Progress percent={91} strokeColor="#52c41a" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="System Alerts" className="mb-6">
        <Alert
          message="3 active alerts requiring attention"
          type="warning"
          showIcon
          className="mb-4"
        />
        <Table
          dataSource={alerts}
          columns={alertColumns}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
};

export default Monitoring;