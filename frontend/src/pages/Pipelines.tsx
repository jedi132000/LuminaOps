import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Progress, Modal, Form, Input, Select, message } from 'antd';
import { PlayCircleOutlined, StopOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const Pipelines: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [pipelines, setPipelines] = useState([
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
  ]);

  const handleCreatePipeline = async (values: any) => {
    try {
      const newPipeline = {
        key: String(pipelines.length + 1),
        name: values.name,
        status: 'stopped',
        progress: 0,
        lastRun: 'Never',
        nextRun: values.schedule || 'Manual',
        success: 0,
        failures: 0,
      };
      setPipelines([...pipelines, newPipeline]);
      setIsModalVisible(false);
      form.resetFields();
      message.success('Pipeline created successfully!');
    } catch (error) {
      message.error('Failed to create pipeline');
    }
  };

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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Create New Pipeline
        </Button>
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
      
      <Modal
        title="Create New Pipeline"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={form.submit}
        okText="Create"
        cancelText="Cancel"
      >
        <Form
          form={form}
          onFinish={handleCreatePipeline}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Pipeline Name"
            rules={[{ required: true, message: 'Please input pipeline name!' }]}
          >
            <Input placeholder="Enter pipeline name" />
          </Form.Item>
          
          <Form.Item
            name="schedule"
            label="Schedule"
          >
            <Select placeholder="Select schedule" allowClear>
              <Select.Option value="Manual">Manual</Select.Option>
              <Select.Option value="Hourly">Hourly</Select.Option>
              <Select.Option value="Daily">Daily</Select.Option>
              <Select.Option value="Weekly">Weekly</Select.Option>
              <Select.Option value="Monthly">Monthly</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Pipelines;