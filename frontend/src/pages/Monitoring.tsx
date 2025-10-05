import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Alert, 
  Table, 
  Button, 
  Modal,
  Tabs,
  Timeline,
  Tag,
  Select,
  Switch,
  Dropdown,
  Menu,
  Tooltip,
  Space,
  Typography
} from 'antd';
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  BugOutlined,
  RollbackOutlined,
  ReloadOutlined,
  SettingOutlined,
  LineChartOutlined,
  DatabaseOutlined,
  ApiOutlined,
  CloudServerOutlined,
  HistoryOutlined,
  UserOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { monitoringAPI } from '../services/api';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Monitoring: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dashboardLayout, setDashboardLayout] = useState('default');
  const [refreshInterval, setRefreshInterval] = useState(30);

  const systemHealth = [
    {
      title: 'API Response Time',
      value: 145,
      suffix: 'ms',
      status: 'success',
      trend: '+2.3%',
      historical: [140, 142, 145, 148, 145],
    },
    {
      title: 'Model Accuracy',
      value: 94.2,
      suffix: '%',
      status: 'success',
      trend: '+0.8%',
      historical: [93.1, 93.5, 94.0, 94.2, 94.2],
    },
    {
      title: 'Error Rate',
      value: 0.03,
      suffix: '%',
      status: 'warning',
      trend: '+0.01%',
      historical: [0.02, 0.025, 0.028, 0.03, 0.03],
    },
    {
      title: 'Throughput',
      value: 1250,
      suffix: 'req/min',
      status: 'success',
      trend: '+5.2%',
      historical: [1180, 1200, 1220, 1240, 1250],
    },
  ];

  const alerts = [
    {
      key: '1',
      severity: 'warning',
      message: 'High memory usage detected on ML Pipeline Worker 3',
      timestamp: '2024-01-15 14:30:22',
      status: 'active',
      details: {
        component: 'ML Pipeline Worker 3',
        memoryUsage: '87%',
        threshold: '85%',
        duration: '15 minutes',
        affectedModels: ['ResNet-50', 'BERT-base'],
        suggestedActions: ['Scale up worker memory', 'Restart worker process', 'Check for memory leaks'],
        logs: 'worker-3.log',
        traces: 'trace-abc123'
      }
    },
    {
      key: '2',
      severity: 'error',
      message: 'Model deployment failed for ResNet-50 v1.3',
      timestamp: '2024-01-15 13:15:10',
      status: 'resolved',
      details: {
        component: 'Deployment Service',
        errorCode: 'DEP_001',
        rootCause: 'Insufficient disk space on deployment node',
        resolution: 'Cleaned up old model artifacts, deployment successful',
        rollbackAvailable: true,
        logs: 'deployment.log',
        traces: 'trace-def456'
      }
    },
    {
      key: '3',
      severity: 'info',
      message: 'Scheduled maintenance window starting in 2 hours',
      timestamp: '2024-01-15 12:00:00',
      status: 'scheduled',
      details: {
        component: 'Entire Platform',
        duration: '30 minutes',
        expectedImpact: 'Model inference API will be unavailable',
        preparation: 'Traffic will be rerouted to backup cluster',
        logs: 'maintenance.log'
      }
    },
  ];

  const modelPerformance = [
    {
      name: 'ResNet-50 v1.2',
      accuracy: 94.2,
      latency: 45,
      throughput: 850,
      status: 'healthy',
      drift: 'low',
      lastUpdated: '2024-01-15 14:00:00'
    },
    {
      name: 'BERT Sentiment',
      accuracy: 87.8,
      latency: 120,
      throughput: 420,
      status: 'degraded',
      drift: 'medium',
      lastUpdated: '2024-01-15 13:45:00'
    },
    {
      name: 'XGBoost Classifier',
      accuracy: 91.5,
      latency: 12,
      throughput: 2100,
      status: 'healthy',
      drift: 'low',
      lastUpdated: '2024-01-15 14:15:00'
    }
  ];

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh data logic would go here
      console.log('Refreshing monitoring data...');
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

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

  const handleAlertClick = (alert: any) => {
    setSelectedAlert(alert);
    setIsModalVisible(true);
  };

  const handleAutoRemediation = (action: string, alertKey: string) => {
    console.log(`Executing ${action} for alert ${alertKey}`);
    // Auto-remediation logic would go here
  };

  const getDriftColor = (drift: string) => {
    switch (drift) {
      case 'low': return 'green';
      case 'medium': return 'orange';
      case 'high': return 'red';
      default: return 'gray';
    }
  };

  const alertColumns = [
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => (
        <Space>
          {getSeverityIcon(severity)}
          <Tag color={severity === 'error' ? 'red' : severity === 'warning' ? 'orange' : 'blue'}>
            {severity.toUpperCase()}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (text: string, record: any) => (
        <Tooltip title="Click for detailed analysis and remediation options">
          <Button 
            type="link" 
            onClick={() => handleAlertClick(record)}
            className="text-left p-0"
          >
            {text}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: 'Component',
      key: 'component',
      render: (record: any) => (
        <Tag icon={<CloudServerOutlined />}>
          {record.details?.component || 'System'}
        </Tag>
      ),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (record: any) => (
        <Text type="secondary">
          {record.details?.duration || 'N/A'}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'red' : status === 'resolved' ? 'green' : 'blue'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button 
            size="small" 
            icon={<BugOutlined />} 
            onClick={() => handleAlertClick(record)}
          >
            RCA
          </Button>
          {record.status === 'active' && (
            <Dropdown
              overlay={
                <Menu onClick={({ key }) => handleAutoRemediation(key, record.key)}>
                  <Menu.Item key="restart" icon={<ReloadOutlined />}>
                    Restart Service
                  </Menu.Item>
                  <Menu.Item key="scale" icon={<CloudServerOutlined />}>
                    Auto Scale
                  </Menu.Item>
                  <Menu.Item key="rollback" icon={<RollbackOutlined />}>
                    Rollback Model
                  </Menu.Item>
                </Menu>
              }
            >
              <Button size="small" icon={<SettingOutlined />}>
                Auto Fix
              </Button>
            </Dropdown>
          )}
        </Space>
      ),
    },
  ];

  const modelColumns = [
    {
      title: 'Model',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Updated: {record.lastUpdated}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Accuracy',
      dataIndex: 'accuracy',
      key: 'accuracy',
      render: (accuracy: number) => (
        <Statistic
          value={accuracy}
          suffix="%"
          precision={1}
          valueStyle={{ fontSize: '14px', color: accuracy > 90 ? '#52c41a' : '#faad14' }}
        />
      ),
    },
    {
      title: 'Latency',
      dataIndex: 'latency',
      key: 'latency',
      render: (latency: number) => (
        <Statistic
          value={latency}
          suffix="ms"
          valueStyle={{ fontSize: '14px', color: latency < 100 ? '#52c41a' : '#faad14' }}
        />
      ),
    },
    {
      title: 'Throughput',
      dataIndex: 'throughput',
      key: 'throughput',
      render: (throughput: number) => `${throughput} req/min`,
    },
    {
      title: 'Data Drift',
      dataIndex: 'drift',
      key: 'drift',
      render: (drift: string) => (
        <Tag color={getDriftColor(drift)}>
          {drift.toUpperCase()} DRIFT
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'healthy' ? 'green' : status === 'degraded' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Tooltip title="View detailed metrics and trends">
            <Button size="small" icon={<LineChartOutlined />} />
          </Tooltip>
          <Tooltip title="Access model logs and traces">
            <Button size="small" icon={<HistoryOutlined />} />
          </Tooltip>
          <Tooltip title="Retrain or update model">
            <Button size="small" icon={<ReloadOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0">
          <CloudServerOutlined className="mr-2" />
          Monitoring & Observability
        </Title>
        <Space>
          <Tooltip title="Current user and role">
            <Tag icon={<UserOutlined />} color="blue">
              admin@example.com (MLOps Engineer)
            </Tag>
          </Tooltip>
          <Select
            value={refreshInterval}
            onChange={setRefreshInterval}
            style={{ width: 120 }}
            size="small"
          >
            <Select.Option value={10}>10s</Select.Option>
            <Select.Option value={30}>30s</Select.Option>
            <Select.Option value={60}>1min</Select.Option>
            <Select.Option value={300}>5min</Select.Option>
          </Select>
          <Switch 
            checkedChildren="Auto Refresh" 
            unCheckedChildren="Manual"
            defaultChecked 
            size="small"
          />
        </Space>
      </div>

      <Tabs 
        defaultActiveKey="dashboard" 
        type="card"
        tabBarExtraContent={{
          right: (
            <Space>
              <Button 
                size="small" 
                icon={<DownloadOutlined />}
                onClick={() => console.log('Export metrics')}
              >
                Export
              </Button>
              <Button 
                size="small" 
                icon={<SettingOutlined />}
                onClick={() => setDashboardLayout(dashboardLayout === 'default' ? 'compact' : 'default')}
              >
                Layout
              </Button>
            </Space>
          )
        }}
      >
        <TabPane tab="Dashboard" key="dashboard">
          {/* Enhanced System Health Metrics */}
          <Row gutter={[16, 16]} className="mb-6">
            {systemHealth.map((metric, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card hoverable>
                  <Statistic
                    title={
                      <Space>
                        {metric.title}
                        <Tooltip title="Click for historical trends">
                          <Button 
                            type="text" 
                            size="small" 
                            icon={<LineChartOutlined />} 
                          />
                        </Tooltip>
                      </Space>
                    }
                    value={metric.value}
                    suffix={metric.suffix}
                    valueStyle={{ 
                      color: metric.status === 'success' ? '#52c41a' : 
                             metric.status === 'warning' ? '#faad14' : '#f5222d' 
                    }}
                  />
                  <div className="mt-2">
                    <Text 
                      type={metric.trend.startsWith('+') ? 'success' : 'danger'}
                      style={{ fontSize: '12px' }}
                    >
                      {metric.trend} from last hour
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Enhanced System Resources and Model Performance */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} lg={8}>
              <Card 
                title={
                  <Space>
                    <DatabaseOutlined />
                    System Resources
                    <Tooltip title="Real-time resource monitoring with auto-scaling recommendations">
                      <Button type="text" size="small" icon={<SettingOutlined />} />
                    </Tooltip>
                  </Space>
                } 
                className="h-full"
              >
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>CPU Usage</span>
                      <Text type="secondary">8 cores</Text>
                    </div>
                    <Progress percent={75} status="active" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Memory Usage</span>
                      <Text type="danger">87% (Alert)</Text>
                    </div>
                    <Progress percent={87} status="exception" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>GPU Usage</span>
                      <Text type="secondary">NVIDIA A100</Text>
                    </div>
                    <Progress percent={89} status="active" strokeColor="#722ed1" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Disk I/O</span>
                      <Text type="secondary">SSD</Text>
                    </div>
                    <Progress percent={45} />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={16}>
              <Card 
                title={
                  <Space>
                    <ApiOutlined />
                    Model Performance Overview
                  </Space>
                } 
                className="h-full"
                extra={
                  <Button size="small" type="primary" ghost>
                    View All Models
                  </Button>
                }
              >
                <Table
                  dataSource={modelPerformance}
                  columns={modelColumns}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Alerts & Incidents" key="alerts">
          <Card title="System Alerts & Automated Remediation" className="mb-6">
            <Alert
              message={
                <Space>
                  <span>{alerts.filter(a => a.status === 'active').length} active alerts requiring attention</span>
                  <Button size="small" type="link" icon={<HistoryOutlined />}>
                    View Alert History
                  </Button>
                </Space>
              }
              type="warning"
              showIcon
              className="mb-4"
            />
            <Table
              dataSource={alerts}
              columns={alertColumns}
              pagination={false}
              size="middle"
              rowClassName={(record) => 
                record.status === 'active' ? 'bg-red-50' : 
                record.status === 'resolved' ? 'bg-green-50' : ''
              }
            />
          </Card>
        </TabPane>

        <TabPane tab="Model Lifecycle" key="models">
          <Card title="ML Model Performance & Drift Detection">
            <Table
              dataSource={modelPerformance}
              columns={modelColumns}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="System Health" key="health">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="System Component Status">
                <Timeline>
                  <Timeline.Item color="green">
                    <Text strong>API Gateway</Text> - Healthy (Response time: 45ms)
                  </Timeline.Item>
                  <Timeline.Item color="green">
                    <Text strong>ML Pipeline Workers</Text> - 4/4 Active
                  </Timeline.Item>
                  <Timeline.Item color="orange">
                    <Text strong>Worker 3</Text> - High memory usage (87%)
                  </Timeline.Item>
                  <Timeline.Item color="green">
                    <Text strong>Vector Database</Text> - Operational
                  </Timeline.Item>
                  <Timeline.Item color="green">
                    <Text strong>Model Registry</Text> - Synchronized
                  </Timeline.Item>
                </Timeline>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* Enhanced Alert Details Modal */}
      <Modal
        title={
          <Space>
            <BugOutlined />
            Root Cause Analysis & Remediation
          </Space>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key="logs" icon={<DownloadOutlined />}>
            Download Logs
          </Button>,
          <Button key="traces" icon={<LineChartOutlined />}>
            View Traces
          </Button>,
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        {selectedAlert && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Component:</Text>
                <div>{selectedAlert.details?.component}</div>
              </Col>
              <Col span={12}>
                <Text strong>Duration:</Text>
                <div>{selectedAlert.details?.duration}</div>
              </Col>
            </Row>
            
            {selectedAlert.details?.suggestedActions && (
              <div className="mt-4">
                <Text strong>Suggested Actions:</Text>
                <ul className="mt-2">
                  {selectedAlert.details.suggestedActions.map((action: string, index: number) => (
                    <li key={index} className="mb-1">
                      <Button 
                        type="link" 
                        size="small"
                        onClick={() => handleAutoRemediation(action, selectedAlert.key)}
                      >
                        {action}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedAlert.details?.affectedModels && (
              <div className="mt-4">
                <Text strong>Affected Models:</Text>
                <div className="mt-2">
                  {selectedAlert.details.affectedModels.map((model: string) => (
                    <Tag key={model} className="mr-2 mb-2">{model}</Tag>
                  ))}
                </div>
              </div>
            )}

            {selectedAlert.details?.rootCause && (
              <div className="mt-4">
                <Text strong>Root Cause:</Text>
                <div className="mt-1 p-2 bg-gray-50 rounded">
                  {selectedAlert.details.rootCause}
                </div>
              </div>
            )}

            {selectedAlert.details?.resolution && (
              <div className="mt-4">
                <Text strong>Resolution:</Text>
                <div className="mt-1 p-2 bg-green-50 rounded">
                  {selectedAlert.details.resolution}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Monitoring;