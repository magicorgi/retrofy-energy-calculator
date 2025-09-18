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
  const [isLoading, setIsLoading] = useState(false);

  // 检查用户是否有管理员权限
  const checkAdminAccess = async (userId: string) => {
    try {
      // 在实际应用中，这里会调用API检查用户的管理员权限
      // 模拟管理员用户检查
      const mockAdminUsers = ['1', '2']; // 模拟管理员用户ID
      
      if (mockAdminUsers.includes(userId)) {
        const mockAdminUser: AdminUser = {
          ...user!,
          admin_role: userId === '1' ? 'super_admin' : 'admin',
          permissions: userId === '1' 
            ? ROLE_PERMISSIONS.super_admin 
            : ROLE_PERMISSIONS.admin,
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
      if (!isAuthenticated || !user) {
        setAdminUser(null);
        return;
      }

      const adminMode = localStorage.getItem('admin_mode');
      const adminData = localStorage.getItem('admin_data');
      
      if (adminMode === 'true' && adminData) {
        try {
          const parsedAdminData = JSON.parse(adminData);
          // 验证管理员权限是否仍然有效
          const currentAdminData = await checkAdminAccess(user.id);
          if (currentAdminData) {
            setAdminUser(currentAdminData);
          } else {
            // 权限已失效，清除本地数据
            exitAdmin();
          }
        } catch (error) {
          console.error('Init admin mode error:', error);
          exitAdmin();
        }
      }
    };

    initAdminMode();
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

