"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings,
  Users,
  FileText,
  Calculator,
  Calendar,
  BarChart3,
  Menu,
  X,
  LogOut,
  Home,
  Shield,
  Bell,
  Search
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { ADMIN_PERMISSIONS } from '@/types/admin';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminUser, isAdmin, isLoading, hasPermission, exitAdmin } = useAdmin();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 确保组件在客户端挂载后再渲染
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 在挂载前或加载中显示加载状态
  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 如果不是管理员，显示权限提示
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">访问受限</h2>
          <p className="text-gray-600 mb-6">
            您没有访问后台管理系统的权限，请联系管理员获取权限。
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/auth/login">
                <Shield className="w-4 h-4 mr-2" />
                管理员登录
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 导航菜单配置
  const menuItems = [
    {
      href: '/admin',
      label: '数据看板',
      icon: BarChart3,
      permission: ADMIN_PERMISSIONS.DASHBOARD_VIEW,
      exact: true
    },
    {
      href: '/admin/users',
      label: '用户管理',
      icon: Users,
      permission: ADMIN_PERMISSIONS.USER_VIEW
    },
    {
      href: '/admin/content',
      label: '内容管理',
      icon: FileText,
      permission: ADMIN_PERMISSIONS.CONTENT_VIEW
    },
    {
      href: '/admin/calculators',
      label: '计算器管理',
      icon: Calculator,
      permission: ADMIN_PERMISSIONS.CALCULATOR_VIEW
    },
    {
      href: '/admin/appointments',
      label: '预约管理',
      icon: Calendar,
      permission: ADMIN_PERMISSIONS.APPOINTMENT_VIEW
    },
    {
      href: '/admin/settings',
      label: '系统设置',
      icon: Settings,
      permission: ADMIN_PERMISSIONS.SYSTEM_CONFIG
    }
  ];

  // 过滤用户有权限的菜单
  const visibleMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleExitAdmin = () => {
    exitAdmin();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 侧边栏 */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* 侧边栏头部 */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">管理后台</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 管理员信息 */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{adminUser?.nickname}</div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {adminUser?.admin_role === 'super_admin' ? '超级管理员' :
                   adminUser?.admin_role === 'admin' ? '管理员' :
                   adminUser?.admin_role === 'content_admin' ? '内容管理员' :
                   adminUser?.admin_role === 'service_admin' ? '客服管理员' :
                   '数据分析师'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="p-4 space-y-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive(item.href, item.exact)
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 底部操作 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              返回前台
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleExitAdmin}
          >
            <LogOut className="w-4 h-4 mr-2" />
            退出管理
          </Button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden md:flex items-center gap-2">
              <div className="text-sm text-gray-500">当前位置:</div>
              <div className="text-sm font-medium text-gray-900">
                {visibleMenuItems.find(item => isActive(item.href, item.exact))?.label || '管理后台'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 搜索 */}
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 通知 */}
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>

            {/* 用户信息 */}
            <div className="flex items-center gap-2 text-sm">
              <div className="hidden md:block text-right">
                <div className="font-medium text-gray-900">{adminUser?.nickname}</div>
                <div className="text-gray-500">{adminUser?.email || adminUser?.phone}</div>
              </div>
            </div>
          </div>
        </header>

        {/* 主内容 */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* 移动端遮罩 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

