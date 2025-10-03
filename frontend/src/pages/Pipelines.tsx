import React from 'react';
import { Card, Table, Button, Tag, Space, Progress } from 'antd';
import { PlayCircleOutlined, StopOutlined, EditOutlined } from '@ant-design/icons';

const Pipelines: React.FC = () => {
  const pipelines = [
    {
      key: '1',
      name: 'Data Ingestion Pipeline',
      status: 'running',
      progress: 75,
      lastRun: '2024-01-15 14:30',
      nextRun: '2024-01-16 14:30',
      success: 45,
      failures: 2,
    },
    {
      key: '2',
      name: 'Model Training Pipeline',
      status: 'stopped',
      progress: 100,
      lastRun: '2024-01-14 09:15',
      nextRun: '2024-01-17 09:15',
      success: 23,
      failures: 0,
    },
    {
      key: '3',
      name: 'Model Deployment Pipeline',
      status: 'failed',
      progress: 40,
      lastRun: '2024-01-15 11:45',
      nextRun: 'Manual',
      success: 18,
      failures: 3,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'processing';
      case 'stopped':
        return 'default';
      case 'failed':
        return 'error';
      case 'scheduled':
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Pipeline Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number, record: any) => (
        <Progress
          percent={progress}
          size="small"
          status={record.status === 'failed' ? 'exception' : 'active'}
        />
      ),
    },
    {
      title: 'Last Run',
      dataIndex: 'lastRun',
      key: 'lastRun',
    },
    {
      title: 'Next Run',
      dataIndex: 'nextRun',
      key: 'nextRun',
    },
    {
      title: 'Success/Failures',
      key: 'stats',
      render: (record: any) => (
        <span>
          <Tag color="green">{record.success}</Tag>
          <Tag color="red">{record.failures}</Tag>
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          {record.status === 'running' ? (
            <Button
              type="text"
              icon={<StopOutlined />}
              onClick={() => console.log('Stop pipeline:', record.name)}
            />
          ) : (
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              onClick={() => console.log('Start pipeline:', record.name)}
            />
          )}
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => console.log('Edit pipeline:', record.name)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pipelines</h1>
        <Button type="primary">Create New Pipeline</Button>
      </div>
      
      <Card>
        <Table
          dataSource={pipelines}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  );
};

export default Pipelines;