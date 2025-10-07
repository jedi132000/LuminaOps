import React from 'react';
import { Layout, Button, Avatar, Dropdown, Menu, Badge } from 'antd';
import { UserOutlined, LogoutOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';

const { Header: AntHeader } = Layout;

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="credits" icon={<CreditCardOutlined />} disabled>
        Premium Credits: {user?.premium_credits || 0}
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
        <div className="flex items-center gap-4">
          <Badge 
            count={user.premium_credits || 0} 
            showZero 
            style={{ backgroundColor: '#52c41a' }}
            overflowCount={99999}
            title="Premium Credits"
          >
            <CreditCardOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          </Badge>
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Button type="text" className="flex items-center">
              <Avatar icon={<UserOutlined />} />
              <span className="ml-2">{user.email}</span>
            </Button>
          </Dropdown>
        </div>
      )}
    </AntHeader>
  );
};