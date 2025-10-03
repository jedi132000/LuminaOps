import React from 'react';
import { Layout, Button, Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';

const { Header: AntHeader } = Layout;

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader className="bg-white shadow-sm px-6 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">
        LuminaOps
      </div>
      
      {user && (
        <Dropdown overlay={userMenu} placement="bottomRight">
          <Button type="text" className="flex items-center">
            <Avatar icon={<UserOutlined />} />
            <span className="ml-2">{user.email}</span>
          </Button>
        </Dropdown>
      )}
    </AntHeader>
  );
};