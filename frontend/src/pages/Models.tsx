import React from 'react';
import { Card, Table, Button, Tag, Space } from 'antd';
import { DeploymentUnitOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Models: React.FC = () => {
  const models = [
    {
      key: '1',
      name: 'ResNet-50 v1.2',
      version: '1.2.0',
      framework: 'PyTorch',
      status: 'deployed',
      accuracy: 94.2,
      created: '2024-01-15',
      size: '25.5 MB',
    },
    {
      key: '2',
      name: 'BERT Sentiment',
      version: '2.1.0',
      framework: 'TensorFlow',
      status: 'ready',
      accuracy: 87.8,
      created: '2024-01-14',
      size: '438 MB',
    },
    {
      key: '3',
      name: 'XGBoost Classifier',
      version: '1.0.0',
      framework: 'Scikit-learn',
      status: 'archived',
      accuracy: 91.5,
      created: '2024-01-10',
      size: '5.2 MB',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'success';
      case 'ready':
        return 'processing';
      case 'archived':
        return 'default';
      case 'training':
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Model Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: 'Framework',
      dataIndex: 'framework',
      key: 'framework',
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
      title: 'Accuracy',
      dataIndex: 'accuracy',
      key: 'accuracy',
      render: (value: number) => `${value}%`,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<DeploymentUnitOutlined />}
            onClick={() => console.log('Deploy model:', record.name)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => console.log('Edit model:', record.name)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => console.log('Delete model:', record.name)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Models</h1>
        <Button type="primary">Register New Model</Button>
      </div>
      
      <Card>
        <Table
          dataSource={models}
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

export default Models;