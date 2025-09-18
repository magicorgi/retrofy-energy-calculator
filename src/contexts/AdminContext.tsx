"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminRole, ADMIN_PERMISSIONS, ROLE_PERMISSIONS } from '@/types/admin';
import { useAuth } from './AuthContext';

interface AdminContextType {
  adminUser: AdminUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasRole: (role: AdminRole) => boolean;
  switchToAdmin: () => Promise<void>;
  exitAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

interface AdminProviderProps {
  children: React.ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 初始化时设为true

  // 检查用户是否有管理员权限
  const checkAdminAccess = async (userId: string) => {
    try {
      // 检查用户ID或邮箱是否是管理员
      const isAdminUser = userId === 'admin_001' || 
                         (user && user.email === 'admin@danfoss.com.cn') ||
                         (user && user.role === 'system_admin');
      
      if (isAdminUser && user) {
        const mockAdminUser: AdminUser = {
          ...user,
          admin_role: 'super_admin',
          permissions: ROLE_PERMISSIONS.super_admin,
          login_count: 15,
          is_active: true,
          department: '技术部',
          last_login_ip: '192.168.1.100'
        };
        
        return mockAdminUser;
      }
      
      return null;
    } catch (error) {
      console.error('Check admin access error:', error);
      return null;
    }
  };

  // 切换到管理员模式
  const switchToAdmin = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const adminData = await checkAdminAccess(user.id);
      if (adminData) {
        setAdminUser(adminData);
        localStorage.setItem('admin_mode', 'true');
        localStorage.setItem('admin_data', JSON.stringify(adminData));
      } else {
        throw new Error('您没有管理员权限');
      }
    } catch (error) {
      console.error('Switch to admin error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 退出管理员模式
  const exitAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('admin_mode');
    localStorage.removeItem('admin_data');
  };

  // 检查权限
  const hasPermission = (permission: string): boolean => {
    if (!adminUser) return false;
    return adminUser.permissions.includes(permission);
  };

  // 检查是否有任意一个权限
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!adminUser) return false;
    return permissions.some(permission => adminUser.permissions.includes(permission));
  };

  // 检查角色
  const hasRole = (role: AdminRole): boolean => {
    if (!adminUser) return false;
    return adminUser.admin_role === role;
  };

  // 初始化管理员状态
  useEffect(() => {
    const initAdminMode = async () => {
      try {
        // 如果用户已登录，自动检查是否有管理员权限
        if (isAuthenticated && user) {
          const adminData = await checkAdminAccess(user.id);
          if (adminData) {
            setAdminUser(adminData);
            localStorage.setItem('admin_mode', 'true');
            localStorage.setItem('admin_data', JSON.stringify(adminData));
          } else {
            setAdminUser(null);
          }
        } else {
          setAdminUser(null);
        }
      } catch (error) {
        console.error('Init admin mode error:', error);
        setAdminUser(null);
      }
    };

    initAdminMode().finally(() => {
      setIsLoading(false);
    });
  }, [isAuthenticated, user]);

  // 用户登出时清除管理员状态
  useEffect(() => {
    if (!isAuthenticated) {
      setAdminUser(null);
    }
  }, [isAuthenticated]);

  const value: AdminContextType = {
    adminUser,
    isAdmin: !!adminUser,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasRole,
    switchToAdmin,
    exitAdmin
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

