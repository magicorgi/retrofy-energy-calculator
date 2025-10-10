"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Heart, 
  Calculator, 
  MessageSquare, 
  Calendar,
  Building,
  MapPin,
  Phone,
  Mail,
  Edit,
  Star,
  Clock,
  TrendingUp,
  FileText,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserDashboardData, 
  CalculationRecord, 
  UserContactRecord, 
  AppointmentRecord, 
  UserFavorite,
  USER_ROLE_LABELS 
} from '@/types/user';
import Link from 'next/link';

// 模拟用户仪表板数据
const mockDashboardData: UserDashboardData = {
  user: {
    id: '1',
    phone: '138****0001',
    nickname: '张工程师',
    company: '北京某建筑设计院',
    industry: '建筑设计',
    region: '北京市',
    role: 'designer',
    position: '暖通工程师',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
    last_login_at: '2024-01-20T10:30:00Z',
    status: 'active',
    verified: true
  },
  profile: {
    user_id: '1',
    company_info: {
      name: '北京某建筑设计院',
      size: '201-500人',
      website: 'https://example.com',
      address: '北京市朝阳区某某路123号'
    },
    preferences: {
      notification_email: true,
      notification_sms: true,
      newsletter: true
    }
  },
  stats: {
    favorites_count: 12,
    calculations_count: 28,
    contacts_count: 8,
    appointments_count: 3,
    last_activity: '2024-01-20T10:30:00Z'
  },
  recent_calculations: [
    {
      id: '1',
      user_id: '1',
      calculator_type: 'chiller',
      title: '某商业综合体冷水机组选型',
      input_data: { cooling_load: 1800, efficiency: 'high' },
      result_data: { recommended_capacity: 2000, energy_savings: 25.6 },
      created_at: '2024-01-20T09:00:00Z',
      updated_at: '2024-01-20T09:00:00Z'
    },
    {
      id: '2',
      user_id: '1',
      calculator_type: 'heat_pump',
      title: '办公楼热泵系统设计',
      input_data: { building_area: 15000, heating_load: 800 },
      result_data: { recommended_capacity: 900, cop: 4.2 },
      created_at: '2024-01-19T14:30:00Z',
      updated_at: '2024-01-19T14:30:00Z'
    }
  ],
  recent_contacts: [
    {
      id: '1',
      user_id: '1',
      product_id: '1',
      message: '希望了解格力GMV-H180WL/A的详细技术参数和报价',
      contact_info: {
        name: '张工程师',
        phone: '138****0001',
        company: '北京某建筑设计院'
      },
      status: 'contacted',
      created_at: '2024-01-18T16:00:00Z',
      updated_at: '2024-01-19T10:00:00Z',
      response: '感谢您的咨询，我们的技术工程师会在24小时内与您联系。'
    }
  ],
  recent_appointments: [
    {
      id: '1',
      user_id: '1',
      type: 'consultation',
      title: '节能改造方案咨询',
      description: '希望咨询某商业综合体的节能改造方案',
      preferred_date: '2024-01-25',
      preferred_time: '14:00',
      contact_info: {
        name: '张工程师',
        phone: '138****0001',
        company: '北京某建筑设计院'
      },
      status: 'confirmed',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-16T09:00:00Z',
      confirmed_at: '2024-01-16T09:00:00Z'
    }
  ],
  favorites: [
    {
      id: '1',
      user_id: '1',
      item_type: 'product',
      item_id: '1',
      created_at: '2024-01-10T00:00:00Z'
    },
    {
      id: '2',
      user_id: '1',
      item_type: 'case',
      item_id: '1',
      created_at: '2024-01-12T00:00:00Z'
    }
  ]
};

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟加载用户数据
    const loadDashboardData = async () => {
      try {
        // 在实际应用中，这里会调用API获取用户数据
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDashboardData(mockDashboardData);
      } catch (error) {
        console.error('Load dashboard data error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">请先登录</h3>
            <p className="text-gray-600 mb-6">您需要登录后才能访问用户中心</p>
            <Link href="/auth/login">
              <Button className="bg-green-600 hover:bg-green-700">
                立即登录
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  const userData = dashboardData?.user || user!;
  const stats = dashboardData?.stats;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 用户信息卡片 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{userData.nickname}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">
                      {USER_ROLE_LABELS[userData.role]}
                    </Badge>
                    {userData.verified && (
                      <Badge variant="outline" className="text-green-600">
                        已验证
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    {userData.company && (
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {userData.company}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {userData.region}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {userData.phone}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/profile">
                    <Edit className="w-4 h-4 mr-2" />
                    编辑资料
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  退出登录
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 统计卡片 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.favorites_count}</div>
                <div className="text-sm text-gray-600">我的收藏</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Calculator className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.calculations_count}</div>
                <div className="text-sm text-gray-600">计算记录</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.contacts_count}</div>
                <div className="text-sm text-gray-600">联系记录</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.appointments_count}</div>
                <div className="text-sm text-gray-600">预约记录</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 详细内容标签页 */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="favorites">我的收藏</TabsTrigger>
            <TabsTrigger value="calculations">计算记录</TabsTrigger>
            <TabsTrigger value="contacts">联系记录</TabsTrigger>
            <TabsTrigger value="appointments">预约记录</TabsTrigger>
          </TabsList>

          {/* 概览 */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 最近计算 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    最近计算
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.recent_calculations.map((calc) => (
                      <div key={calc.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{calc.title || `${calc.calculator_type}计算`}</h4>
                          <Badge variant="outline" className="text-xs">
                            {calc.calculator_type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatTime(calc.created_at)}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard?tab=calculations">
                        查看全部计算记录
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 最近联系 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    最近联系
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.recent_contacts.map((contact) => (
                      <div key={contact.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="text-sm">{contact.message.substring(0, 50)}...</p>
                          </div>
                          <Badge className={getStatusColor(contact.status)}>
                            {contact.status === 'pending' ? '待处理' : 
                             contact.status === 'contacted' ? '已联系' : '已关闭'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatTime(contact.created_at)}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard?tab=contacts">
                        查看全部联系记录
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 我的收藏 */}
          <TabsContent value="favorites" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  我的收藏
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">暂无收藏</h3>
                  <p className="text-gray-500 mb-4">收藏您感兴趣的产品和案例</p>
                  <Button asChild>
                    <Link href="/products">
                      浏览产品
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 计算记录 */}
          <TabsContent value="calculations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  计算记录
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.recent_calculations.map((calc) => (
                    <div key={calc.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium mb-1">{calc.title || `${calc.calculator_type}计算`}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {formatTime(calc.created_at)}
                          </div>
                        </div>
                        <Badge variant="outline">
                          {calc.calculator_type}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <Button size="sm" variant="outline">
                          查看详情
                        </Button>
                        <Button size="sm" variant="outline">
                          重新计算
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 联系记录 */}
          <TabsContent value="contacts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  联系记录
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.recent_contacts.map((contact) => (
                    <div key={contact.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="mb-2">{contact.message}</p>
                          {contact.response && (
                            <div className="p-2 bg-green-50 rounded text-sm">
                              <strong>回复：</strong>{contact.response}
                            </div>
                          )}
                        </div>
                        <Badge className={getStatusColor(contact.status)}>
                          {contact.status === 'pending' ? '待处理' : 
                           contact.status === 'contacted' ? '已联系' : '已关闭'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        提交时间：{formatTime(contact.created_at)}
                        {contact.updated_at !== contact.created_at && (
                          <span> | 更新时间：{formatTime(contact.updated_at)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 预约记录 */}
          <TabsContent value="appointments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  预约记录
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.recent_appointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium mb-1">{appointment.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{appointment.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(appointment.preferred_date)} {appointment.preferred_time}
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status === 'pending' ? '待确认' : 
                           appointment.status === 'confirmed' ? '已确认' : 
                           appointment.status === 'completed' ? '已完成' : '已取消'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        预约时间：{formatTime(appointment.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}







