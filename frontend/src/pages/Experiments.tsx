import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, Select, message } from 'antd';
import { PlayCircleOutlined, StopOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const Experiments: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [experiments, setExperiments] = useState([
    {
      key: '1',
      name: 'Image Classification v2',
      status: 'running',
      accuracy: 94.2,
      loss: 0.123,
      created: '2024-01-15',
      framework: 'PyTorch',
    },
    {
      key: '2',
      name: 'NLP Sentiment Analysis',
      status: 'completed',
      accuracy: 87.8,
      loss: 0.445,
      created: '2024-01-14',
      framework: 'TensorFlow',
    },
    {
      key: '3',
      name: 'Recommendation System',
      status: 'failed',
      accuracy: 0,
      loss: 0,
      created: '2024-01-13',
      framework: 'Scikit-learn',
    },
  ]);

  const handleCreateExperiment = async (values: any) => {
    try {
      const newExperiment = {
        key: String(experiments.length + 1),
        name: values.name,
        status: 'ready',
        accuracy: 0,
        loss: 0,
        created: new Date().toISOString().split('T')[0],
        framework: values.framework,
      };
      setExperiments([...experiments, newExperiment]);
      setIsModalVisible(false);
      form.resetFields();
      message.success('Experiment created successfully!');
    } catch (error) {
      message.error('Failed to create experiment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'processing';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

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
      render: (value: number) => value > 0 ? `${value}%` : '-',
    },
    {
      title: 'Loss',
      dataIndex: 'loss',
      key: 'loss',
      render: (value: number) => value > 0 ? value.toFixed(3) : '-',
    },
    {
      title: 'Framework',
      dataIndex: 'framework',
      key: 'framework',
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
          {record.status === 'running' ? (
            <Button
              type="text"
              icon={<StopOutlined />}
              onClick={() => console.log('Stop experiment:', record.name)}
            />
          ) : (
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              onClick={() => console.log('Start experiment:', record.name)}
            />
          )}
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => console.log('Edit experiment:', record.name)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Experiments</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Create New Experiment
        </Button>
      </div>
      
      <Card>
        <Table
          dataSource={experiments}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
      
      <Modal
        title="Create New Experiment"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={form.submit}
        okText="Create"
        cancelText="Cancel"
      >
        <Form
          form={form}
          onFinish={handleCreateExperiment}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Experiment Name"
            rules={[{ required: true, message: 'Please input experiment name!' }]}
          >
            <Input placeholder="Enter experiment name" />
          </Form.Item>
          
          <Form.Item
            name="framework"
            label="Framework"
            rules={[{ required: true, message: 'Please select a framework!' }]}
          >
            <Select placeholder="Select framework">
              <Select.Option value="PyTorch">PyTorch</Select.Option>
              <Select.Option value="TensorFlow">TensorFlow</Select.Option>
              <Select.Option value="Scikit-learn">Scikit-learn</Select.Option>
              <Select.Option value="Keras">Keras</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Experiments;