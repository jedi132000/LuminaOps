import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ExperimentOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  MonitorOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/experiments',
      icon: <ExperimentOutlined />,
      label: <Link to="/experiments">Experiments</Link>,
    },
    {
      key: '/models',
      icon: <DatabaseOutlined />,
      label: <Link to="/models">Models</Link>,
    },
    {
      key: '/pipelines',
      icon: <DeploymentUnitOutlined />,
      label: <Link to="/pipelines">Pipelines</Link>,
    },
    {
      key: '/monitoring',
      icon: <MonitorOutlined />,
      label: <Link to="/monitoring">Monitoring</Link>,
    },
  ];

  return (
    <Sider width={250} className="bg-gray-50">
      <Menu
        mode="vertical"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="border-r-0"
      />
    </Sider>
  );
};