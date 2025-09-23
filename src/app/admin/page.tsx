"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Calculator,
  MessageSquare,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { DashboardStats, UserGrowthData, CalculationHeatData, ConversionFunnelData } from '@/types/admin';

// 模拟数据
const mockDashboardStats: DashboardStats = {
  total_users: 12847,
  new_users_today: 156,
  new_users_this_month: 3421,
  active_users_today: 2891,
  active_users_this_month: 8934,
  user_retention_rate: 78.5,
  
  total_calculations: 45623,
  calculations_today: 234,
  calculations_this_month: 8967,
  popular_calculators: [
    { name: '热泵计算器', count: 15623 },
    { name: '冷水机组计算器', count: 12456 },
    { name: '工业高温热泵', count: 8934 },
    { name: '分布式能源', count: 5678 },
  ],
  
  total_contacts: 3456,
  contacts_today: 23,
  contact_conversion_rate: 15.2,
  total_appointments: 1234,
  appointments_today: 8,
  appointment_conversion_rate: 35.7,
  
  total_articles: 156,
  total_cases: 89,
  total_products: 234,
  popular_content: [
    { title: '某商业综合体节能改造案例', views: 5623, type: 'case' },
    { title: '热泵技术发展趋势分析', views: 4521, type: 'article' },
    { title: '格力GMV-H180WL/A产品详情', views: 3892, type: 'product' },
  ],
  
  system_health: 'healthy',
  response_time: 245,
  error_rate: 0.12,
  uptime: 99.87
};

const mockUserGrowthData: UserGrowthData[] = [
  { date: '2024-01-01', new_users: 45, total_users: 12000, active_users: 8500 },
  { date: '2024-01-02', new_users: 52, total_users: 12052, active_users: 8623 },
  { date: '2024-01-03', new_users: 38, total_users: 12090, active_users: 8456 },
  { date: '2024-01-04', new_users: 67, total_users: 12157, active_users: 8789 },
  { date: '2024-01-05', new_users: 41, total_users: 12198, active_users: 8567 },
  { date: '2024-01-06', new_users: 59, total_users: 12257, active_users: 8834 },
  { date: '2024-01-07', new_users: 73, total_users: 12330, active_users: 8991 },
];

const mockCalculationHeatData: CalculationHeatData[] = [
  { calculator_type: '热泵计算器', count: 15623, growth_rate: 12.5, avg_duration: 8.5 },
  { calculator_type: '冷水机组计算器', count: 12456, growth_rate: 8.3, avg_duration: 6.2 },
  { calculator_type: '工业高温热泵', count: 8934, growth_rate: 15.7, avg_duration: 12.1 },
  { calculator_type: '分布式能源', count: 5678, growth_rate: -2.1, avg_duration: 9.8 },
];

const mockConversionFunnelData: ConversionFunnelData[] = [
  { stage: '访问首页', count: 45623, conversion_rate: 100 },
  { stage: '使用计算器', count: 18249, conversion_rate: 40.0 },
  { stage: '查看产品', count: 9124, conversion_rate: 50.0 },
  { stage: '联系厂商', count: 2737, conversion_rate: 30.0 },
  { stage: '预约服务', count: 978, conversion_rate: 35.7 },
];

export default function AdminDashboard() {
  const { hasPermission } = useAdmin();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // 加载数据
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(mockDashboardStats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Load dashboard data error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">加载数据中...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">数据加载失败</h3>
        <p className="text-gray-600 mb-4">无法加载仪表板数据，请稍后重试</p>
        <Button onClick={loadDashboardData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          重新加载
        </Button>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toLocaleString();
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">数据看板</h1>
          <p className="text-gray-600 mt-1">
            最后更新: {lastUpdated.toLocaleString('zh-CN')}
          </p>
        </div>
        <Button onClick={loadDashboardData} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          刷新数据
        </Button>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 用户统计 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总用户数</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.total_users)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">今日新增 {stats.new_users_today}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 计算统计 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总计算次数</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.total_calculations)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">今日 {stats.calculations_today}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 联系转化 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">联系转化率</p>
                <p className="text-2xl font-bold text-gray-900">{stats.contact_conversion_rate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600">今日 {stats.contacts_today} 次</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 预约转化 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">预约转化率</p>
                <p className="text-2xl font-bold text-gray-900">{stats.appointment_conversion_rate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-600">今日 {stats.appointments_today} 次</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 详细数据标签页 */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="users">用户分析</TabsTrigger>
          <TabsTrigger value="calculators">计算热度</TabsTrigger>
          <TabsTrigger value="conversion">转化漏斗</TabsTrigger>
          <TabsTrigger value="system">系统状态</TabsTrigger>
        </TabsList>

        {/* 概览 */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 热门计算器 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  热门计算器
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.popular_calculators.map((calc, index) => (
                    <div key={calc.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{calc.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{formatNumber(calc.count)}</div>
                        <div className="text-sm text-gray-500">次使用</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 热门内容 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  热门内容
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.popular_content.map((content, index) => (
                    <div key={content.title} className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {content.type === 'case' ? '案例' : 
                             content.type === 'article' ? '文章' : '产品'}
                          </Badge>
                        </div>
                        <div className="font-medium text-sm leading-tight">{content.title}</div>
                      </div>
                      <div className="text-right ml-3">
                        <div className="font-bold text-gray-900">{formatNumber(content.views)}</div>
                        <div className="text-sm text-gray-500">浏览</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 用户分析 */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>活跃用户</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatNumber(stats.active_users_today)}
                </div>
                <p className="text-sm text-gray-600">今日活跃用户</p>
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-1">本月活跃用户</div>
                  <div className="text-lg font-semibold">{formatNumber(stats.active_users_this_month)}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>用户留存</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.user_retention_rate}%
                </div>
                <p className="text-sm text-gray-600">7日留存率</p>
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600">较上周提升 2.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>新增用户</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {formatNumber(stats.new_users_this_month)}
                </div>
                <p className="text-sm text-gray-600">本月新增</p>
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-1">今日新增</div>
                  <div className="text-lg font-semibold">{stats.new_users_today}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 计算热度 */}
        <TabsContent value="calculators" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>计算器使用统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">计算器名称</th>
                      <th className="text-right py-3 px-4">使用次数</th>
                      <th className="text-right py-3 px-4">增长率</th>
                      <th className="text-right py-3 px-4">平均时长</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCalculationHeatData.map((item) => (
                      <tr key={item.calculator_type} className="border-b">
                        <td className="py-3 px-4 font-medium">{item.calculator_type}</td>
                        <td className="py-3 px-4 text-right">{formatNumber(item.count)}</td>
                        <td className="py-3 px-4 text-right">
                          <div className={`flex items-center justify-end gap-1 ${
                            item.growth_rate >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.growth_rate >= 0 ? 
                              <TrendingUp className="w-4 h-4" /> : 
                              <TrendingDown className="w-4 h-4" />
                            }
                            {Math.abs(item.growth_rate)}%
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">{item.avg_duration}分钟</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 转化漏斗 */}
        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>用户转化漏斗</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockConversionFunnelData.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{stage.stage}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{formatNumber(stage.count)}</div>
                        <div className="text-sm text-gray-500">{stage.conversion_rate}%</div>
                      </div>
                    </div>
                    {index < mockConversionFunnelData.length - 1 && (
                      <div className="flex justify-center py-2">
                        <TrendingDown className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 系统状态 */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">系统健康度</p>
                    <p className={`text-2xl font-bold ${getHealthColor(stats.system_health)}`}>
                      {stats.system_health === 'healthy' ? '健康' :
                       stats.system_health === 'warning' ? '警告' : '严重'}
                    </p>
                  </div>
                  {getHealthIcon(stats.system_health)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">平均响应时间</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.response_time}ms</p>
                  </div>
                  <Clock className="w-12 h-12 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">错误率</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.error_rate}%</p>
                  </div>
                  <AlertTriangle className="w-12 h-12 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">系统正常运行时间</p>
                    <p className="text-2xl font-bold text-green-600">{stats.uptime}%</p>
                  </div>
                  <Activity className="w-12 h-12 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}



