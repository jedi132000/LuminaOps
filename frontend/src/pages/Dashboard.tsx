import React from 'react';
import { Card, Row, Col, Statistic, Progress, Table } from 'antd';
import {
  ExperimentOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  MonitorOutlined,
} from '@ant-design/icons';

const Dashboard: React.FC = () => {
  // Mock data for dashboard
  const stats = [
    {
      title: 'Active Experiments',
      value: 12,
      icon: <ExperimentOutlined className="text-blue-500" />,
    },
    {
      title: 'Deployed Models',
      value: 8,
      icon: <DatabaseOutlined className="text-green-500" />,
    },
    {
      title: 'Running Pipelines',
      value: 5,
      icon: <DeploymentUnitOutlined className="text-purple-500" />,
    },
    {
      title: 'System Health',
      value: 98,
      suffix: '%',
      icon: <MonitorOutlined className="text-orange-500" />,
    },
  ];

  const recentExperiments = [
    {
      key: '1',
      name: 'Image Classification v2',
      status: 'Running',
      accuracy: 94.2,
      created: '2024-01-15',
    },
    {
      key: '2',
      name: 'NLP Sentiment Analysis',
      status: 'Completed',
      accuracy: 87.8,
      created: '2024-01-14',
    },
  ];

  const columns = [
    {
      title: 'Experiment Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Accuracy',
      dataIndex: 'accuracy',
      key: 'accuracy',
      render: (value: number) => `${value}%`,
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <Row gutter={[16, 16]} className="mb-6">
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Recent Experiments" className="h-full">
            <Table
              dataSource={recentExperiments}
              columns={columns}
              pagination={false}
            />
          </Card>
        </Col>
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
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;