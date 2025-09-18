"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Search,
  Filter,
  Download,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Calendar,
  MapPin,
  Building,
  Phone,
  Mail,
  Activity,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { User, UserRole, USER_ROLE_LABELS, REGIONS, INDUSTRIES } from '@/types/user';
import { UserBehavior, UserAnalytics, ADMIN_PERMISSIONS } from '@/types/admin';

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    phone: '138****0001',
    nickname: '张工程师',
    real_name: '张明',
    email: 'zhang.ming@example.com',
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
  {
    id: '2',
    phone: '139****0002',
    nickname: '李总',
    real_name: '李建华',
    email: 'li.jianhua@company.com',
    company: '上海节能科技有限公司',
    industry: '节能服务',
    region: '上海市',
    role: 'company',
    position: '总经理',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-19T00:00:00Z',
    last_login_at: '2024-01-19T15:20:00Z',
    status: 'active',
    verified: true
  },
  {
    id: '3',
    phone: '137****0003',
    nickname: '王供应商',
    real_name: '王德华',
    company: '广州热泵设备制造有限公司',
    industry: '设备制造',
    region: '广东省',
    role: 'supplier',
    position: '销售经理',
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z',
    last_login_at: '2024-01-18T09:45:00Z',
    status: 'active',
    verified: true
  }
];

const mockUserAnalytics: UserAnalytics[] = [
  {
    user_id: '1',
    total_logins: 45,
    total_calculations: 128,
    total_contacts: 12,
    total_appointments: 3,
    last_active: '2024-01-20T10:30:00Z',
    preferred_calculators: ['heat_pump', 'chiller'],
    conversion_rate: 15.6,
    engagement_score: 85
  },
  {
    user_id: '2',
    total_logins: 32,
    total_calculations: 89,
    total_contacts: 18,
    total_appointments: 5,
    last_active: '2024-01-19T15:20:00Z',
    preferred_calculators: ['industrial_heat_pump', 'distributed_energy'],
    conversion_rate: 22.4,
    engagement_score: 92
  }
];

export default function UserManagementPage() {
  const { hasPermission } = useAdmin();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // 筛选和搜索状态
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 加载用户数据
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (error) {
      console.error('Load users error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 筛选用户
  useEffect(() => {
    let filtered = users;

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 角色过滤
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // 地区过滤
    if (regionFilter !== 'all') {
      filtered = filtered.filter(user => user.region === regionFilter);
    }

    // 状态过滤
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // 行业过滤
    if (industryFilter !== 'all') {
      filtered = filtered.filter(user => user.industry === industryFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // 重置到第一页
  }, [users, searchTerm, roleFilter, regionFilter, statusFilter, industryFilter]);

  // 分页数据
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(user => user.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for users:`, selectedUsers);
    // 实现批量操作逻辑
    setSelectedUsers([]);
  };

  const handleExport = () => {
    console.log('Export users:', filteredUsers);
    // 实现导出逻辑
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '活跃';
      case 'inactive': return '非活跃';
      case 'suspended': return '已暂停';
      default: return status;
    }
  };

  if (!hasPermission(ADMIN_PERMISSIONS.USER_VIEW)) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">无访问权限</h3>
        <p className="text-gray-600">您没有查看用户管理的权限</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
          <p className="text-gray-600 mt-1">
            共 {filteredUsers.length} 个用户
            {selectedUsers.length > 0 && ` (已选择 ${selectedUsers.length} 个)`}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            导出数据
          </Button>
          {hasPermission(ADMIN_PERMISSIONS.USER_CREATE) && (
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              添加用户
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">用户列表</TabsTrigger>
          <TabsTrigger value="analytics">用户分析</TabsTrigger>
          <TabsTrigger value="behavior">行为分析</TabsTrigger>
        </TabsList>

        {/* 用户列表 */}
        <TabsContent value="list" className="space-y-6">
          {/* 筛选和搜索 */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {/* 搜索 */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="搜索用户..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* 角色筛选 */}
                <div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="角色" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部角色</SelectItem>
                      {Object.entries(USER_ROLE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 地区筛选 */}
                <div>
                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="地区" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部地区</SelectItem>
                      {REGIONS.slice(0, 10).map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 行业筛选 */}
                <div>
                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="行业" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部行业</SelectItem>
                      {INDUSTRIES.slice(0, 10).map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 状态筛选 */}
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="active">活跃</SelectItem>
                      <SelectItem value="inactive">非活跃</SelectItem>
                      <SelectItem value="suspended">已暂停</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 批量操作 */}
          {selectedUsers.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    已选择 {selectedUsers.length} 个用户
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('export')}>
                      导出选中
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('disable')}>
                      批量禁用
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('message')}>
                      发送消息
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 用户表格 */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="text-left py-3 px-4">用户信息</th>
                      <th className="text-left py-3 px-4">角色</th>
                      <th className="text-left py-3 px-4">公司/行业</th>
                      <th className="text-left py-3 px-4">地区</th>
                      <th className="text-left py-3 px-4">状态</th>
                      <th className="text-left py-3 px-4">注册时间</th>
                      <th className="text-left py-3 px-4">最后登录</th>
                      <th className="text-left py-3 px-4">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                              {user.nickname.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {user.nickname}
                                {user.verified && (
                                  <Badge variant="outline" className="text-xs text-green-600">
                                    已验证
                                  </Badge>
                                )}
                              </div>
                              <div className="text-gray-500 text-xs flex items-center gap-2">
                                <Phone className="w-3 h-3" />
                                {user.phone}
                              </div>
                              {user.email && (
                                <div className="text-gray-500 text-xs flex items-center gap-2">
                                  <Mail className="w-3 h-3" />
                                  {user.email}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">
                            {USER_ROLE_LABELS[user.role]}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            {user.company && (
                              <div className="font-medium text-xs flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {user.company}
                              </div>
                            )}
                            <div className="text-gray-500 text-xs">{user.industry}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-xs">
                            <MapPin className="w-3 h-3" />
                            {user.region}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(user.status)}>
                            {getStatusLabel(user.status)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500">
                          {user.last_login_at ? formatDateTime(user.last_login_at) : '从未登录'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {hasPermission(ADMIN_PERMISSIONS.USER_UPDATE) && (
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <div className="text-sm text-gray-600">
                    显示 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, filteredUsers.length)} 条，
                    共 {filteredUsers.length} 条记录
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                      上一页
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 用户分析 */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">总用户数</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">活跃用户</p>
                    <p className="text-2xl font-bold text-green-600">
                      {users.filter(u => u.status === 'active').length}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">企业用户</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {users.filter(u => u.role === 'company').length}
                    </p>
                  </div>
                  <Building className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">验证用户</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {users.filter(u => u.verified).length}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 用户分布图表 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>用户角色分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(USER_ROLE_LABELS).map(([key, label]) => {
                    const count = users.filter(u => u.role === key).length;
                    const percentage = users.length > 0 ? (count / users.length * 100).toFixed(1) : 0;
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">{label}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{count}</div>
                          <div className="text-xs text-gray-500">{percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>地区分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(users.map(u => u.region))).slice(0, 5).map((region) => {
                    const count = users.filter(u => u.region === region).length;
                    const percentage = users.length > 0 ? (count / users.length * 100).toFixed(1) : 0;
                    return (
                      <div key={region} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{region}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{count}</div>
                          <div className="text-xs text-gray-500">{percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 行为分析 */}
        <TabsContent value="behavior" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                用户行为分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">行为分析功能开发中</h3>
                <p className="text-gray-600">用户行为追踪和分析功能即将上线</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

