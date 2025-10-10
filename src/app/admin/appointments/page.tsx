"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Building,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  UserCheck,
  Plus,
  Filter,
  Search,
  Star
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { 
  AppointmentManagement, 
  FollowUpRecord, 
  ADMIN_PERMISSIONS 
} from '@/types/admin';

// 模拟预约数据
const mockAppointments: AppointmentManagement[] = [
  {
    id: '1',
    user_id: '1',
    type: 'consultation',
    title: '节能改造方案咨询',
    description: '希望咨询某商业综合体的节能改造方案，包括热泵系统设计和投资回报分析',
    preferred_date: '2024-01-25',
    preferred_time: '14:00',
    contact_info: {
      name: '张工程师',
      phone: '138****0001',
      email: 'zhang.ming@example.com',
      company: '北京某建筑设计院'
    },
    location: {
      address: '北京市朝阳区某某路123号',
      city: '北京市',
      province: '北京市'
    },
    status: 'confirmed',
    priority: 'high',
    assigned_admin_id: 'admin1',
    assigned_admin_name: '李工程师',
    estimated_duration: 120,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-16T09:00:00Z',
    confirmed_at: '2024-01-16T09:00:00Z',
    notes: '客户对热泵技术很感兴趣，需要详细的技术方案',
    follow_up_records: [
      {
        id: '1',
        appointment_id: '1',
        admin_id: 'admin1',
        admin_name: '李工程师',
        action: 'called',
        content: '与客户电话沟通，确认预约时间和地点',
        result: '预约确认成功',
        next_action: '准备技术方案资料',
        next_follow_up_at: '2024-01-24T10:00:00Z',
        created_at: '2024-01-16T09:00:00Z'
      }
    ]
  },
  {
    id: '2',
    user_id: '2',
    type: 'site_visit',
    title: '工厂现场勘察',
    description: '需要技术人员到工厂进行现场勘察，评估高温热泵改造可行性',
    preferred_date: '2024-01-28',
    preferred_time: '09:00',
    contact_info: {
      name: '李总',
      phone: '139****0002',
      company: '上海节能科技有限公司'
    },
    location: {
      address: '上海市浦东新区工业园区',
      city: '上海市',
      province: '上海市'
    },
    status: 'pending',
    priority: 'medium',
    estimated_duration: 240,
    created_at: '2024-01-18T14:30:00Z',
    updated_at: '2024-01-18T14:30:00Z',
    notes: '工厂运行时间需要考虑，建议安排在周末',
    follow_up_records: []
  },
  {
    id: '3',
    user_id: '3',
    type: 'technical_support',
    title: '设备技术支持',
    description: '已安装的热泵设备运行异常，需要技术支持',
    preferred_date: '2024-01-22',
    preferred_time: '10:30',
    contact_info: {
      name: '王经理',
      phone: '137****0003',
      company: '广州热泵设备制造有限公司'
    },
    status: 'completed',
    priority: 'urgent',
    assigned_admin_id: 'admin2',
    assigned_admin_name: '赵工程师',
    estimated_duration: 180,
    actual_duration: 150,
    satisfaction_rating: 5,
    created_at: '2024-01-20T08:00:00Z',
    updated_at: '2024-01-22T13:30:00Z',
    completed_at: '2024-01-22T13:30:00Z',
    notes: '问题已解决，客户满意度很高',
    follow_up_records: [
      {
        id: '2',
        appointment_id: '3',
        admin_id: 'admin2',
        admin_name: '赵工程师',
        action: 'visited',
        content: '到现场检查设备，发现控制系统参数设置问题',
        result: '问题已解决，设备恢复正常运行',
        created_at: '2024-01-22T13:30:00Z'
      }
    ]
  }
];

// 模拟管理员列表
const mockAdmins = [
  { id: 'admin1', name: '李工程师', department: '技术部' },
  { id: 'admin2', name: '赵工程师', department: '技术部' },
  { id: 'admin3', name: '王客服', department: '客服部' }
];

export default function AppointmentManagementPage() {
  const { hasPermission } = useAdmin();
  const [appointments, setAppointments] = useState<AppointmentManagement[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentManagement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 筛选和搜索状态
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  // 跟进记录状态
  const [newFollowUp, setNewFollowUp] = useState({
    action: '',
    content: '',
    result: '',
    next_action: '',
    next_follow_up_at: ''
  });

  // 加载预约数据
  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Load appointments error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // 筛选预约
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = !searchTerm || 
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.contact_info.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || appointment.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || appointment.type === typeFilter;
    const matchesAssignee = assigneeFilter === 'all' || appointment.assigned_admin_id === assigneeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesAssignee;
  });

  // 分配预约
  const handleAssignAppointment = (appointmentId: string, adminId: string) => {
    const admin = mockAdmins.find(a => a.id === adminId);
    if (!admin) return;

    setAppointments(prev => prev.map(appointment =>
      appointment.id === appointmentId
        ? {
            ...appointment,
            assigned_admin_id: adminId,
            assigned_admin_name: admin.name,
            updated_at: new Date().toISOString()
          }
        : appointment
    ));

    if (selectedAppointment?.id === appointmentId) {
      setSelectedAppointment(prev => prev ? {
        ...prev,
        assigned_admin_id: adminId,
        assigned_admin_name: admin.name,
        updated_at: new Date().toISOString()
      } : null);
    }
  };

  // 更新预约状态
  const handleUpdateStatus = (appointmentId: string, status: string) => {
    const now = new Date().toISOString();
    setAppointments(prev => prev.map(appointment =>
      appointment.id === appointmentId
        ? {
            ...appointment,
            status: status as any,
            updated_at: now,
            ...(status === 'confirmed' && { confirmed_at: now }),
            ...(status === 'completed' && { completed_at: now })
          }
        : appointment
    ));

    if (selectedAppointment?.id === appointmentId) {
      setSelectedAppointment(prev => prev ? {
        ...prev,
        status: status as any,
        updated_at: now,
        ...(status === 'confirmed' && { confirmed_at: now }),
        ...(status === 'completed' && { completed_at: now })
      } : null);
    }
  };

  // 添加跟进记录
  const handleAddFollowUp = () => {
    if (!selectedAppointment || !newFollowUp.action || !newFollowUp.content) {
      alert('请填写必要信息');
      return;
    }

    const followUpRecord: FollowUpRecord = {
      id: Date.now().toString(),
      appointment_id: selectedAppointment.id,
      admin_id: 'current_admin',
      admin_name: '当前管理员',
      action: newFollowUp.action,
      content: newFollowUp.content,
      result: newFollowUp.result,
      next_action: newFollowUp.next_action,
      next_follow_up_at: newFollowUp.next_follow_up_at || undefined,
      created_at: new Date().toISOString()
    };

    const updatedAppointment = {
      ...selectedAppointment,
      follow_up_records: [...selectedAppointment.follow_up_records, followUpRecord],
      updated_at: new Date().toISOString()
    };

    setSelectedAppointment(updatedAppointment);
    setAppointments(prev => prev.map(appointment =>
      appointment.id === selectedAppointment.id ? updatedAppointment : appointment
    ));

    // 重置表单
    setNewFollowUp({
      action: '',
      content: '',
      result: '',
      next_action: '',
      next_follow_up_at: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '待确认';
      case 'confirmed': return '已确认';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return '紧急';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return priority;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'consultation': return '咨询服务';
      case 'site_visit': return '现场勘察';
      case 'technical_support': return '技术支持';
      case 'other': return '其他';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (!hasPermission(ADMIN_PERMISSIONS.APPOINTMENT_VIEW)) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">无访问权限</h3>
        <p className="text-gray-600">您没有查看预约管理的权限</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和统计 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">预约管理</h1>
          <p className="text-gray-600 mt-1">
            共 {filteredAppointments.length} 个预约
          </p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">待确认</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {appointments.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已确认</p>
                <p className="text-2xl font-bold text-blue-600">
                  {appointments.filter(a => a.status === 'confirmed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已完成</p>
                <p className="text-2xl font-bold text-green-600">
                  {appointments.filter(a => a.status === 'completed').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">紧急预约</p>
                <p className="text-2xl font-bold text-red-600">
                  {appointments.filter(a => a.priority === 'urgent').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 预约列表 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 搜索和筛选 */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="搜索预约..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="pending">待确认</SelectItem>
                      <SelectItem value="confirmed">已确认</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="cancelled">已取消</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="优先级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部优先级</SelectItem>
                      <SelectItem value="urgent">紧急</SelectItem>
                      <SelectItem value="high">高</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="low">低</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="consultation">咨询服务</SelectItem>
                      <SelectItem value="site_visit">现场勘察</SelectItem>
                      <SelectItem value="technical_support">技术支持</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 预约列表 */}
          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 ${
                      selectedAppointment?.id === appointment.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-transparent'
                    }`}
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{appointment.title}</h4>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusLabel(appointment.status)}
                          </Badge>
                          <Badge className={getPriorityColor(appointment.priority)}>
                            {getPriorityLabel(appointment.priority)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {appointment.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {appointment.contact_info.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(appointment.preferred_date)} {appointment.preferred_time}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {appointment.estimated_duration}分钟
                          </div>
                          {appointment.assigned_admin_name && (
                            <div className="flex items-center gap-1">
                              <UserCheck className="w-3 h-3" />
                              {appointment.assigned_admin_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 预约详情 */}
        <div className="space-y-6">
          {selectedAppointment ? (
            <>
              {/* 基本信息 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">预约详情</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(selectedAppointment.status)}>
                        {getStatusLabel(selectedAppointment.status)}
                      </Badge>
                      <Badge className={getPriorityColor(selectedAppointment.priority)}>
                        {getPriorityLabel(selectedAppointment.priority)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">{selectedAppointment.title}</h4>
                    <p className="text-gray-600 text-sm">{selectedAppointment.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">类型: </span>
                      {getTypeLabel(selectedAppointment.type)}
                    </div>
                    <div>
                      <span className="text-gray-600">预计时长: </span>
                      {selectedAppointment.estimated_duration}分钟
                    </div>
                    <div>
                      <span className="text-gray-600">预约时间: </span>
                      {formatDate(selectedAppointment.preferred_date)} {selectedAppointment.preferred_time}
                    </div>
                    {selectedAppointment.actual_duration && (
                      <div>
                        <span className="text-gray-600">实际时长: </span>
                        {selectedAppointment.actual_duration}分钟
                      </div>
                    )}
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">联系信息</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {selectedAppointment.contact_info.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {selectedAppointment.contact_info.phone}
                      </div>
                      {selectedAppointment.contact_info.company && (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          {selectedAppointment.contact_info.company}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedAppointment.location && (
                    <div>
                      <h5 className="font-medium mb-2">地址信息</h5>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          {selectedAppointment.location.address}
                          <br />
                          {selectedAppointment.location.city}, {selectedAppointment.location.province}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedAppointment.notes && (
                    <div>
                      <h5 className="font-medium mb-2">备注</h5>
                      <p className="text-gray-600 text-sm">{selectedAppointment.notes}</p>
                    </div>
                  )}

                  {selectedAppointment.satisfaction_rating && (
                    <div>
                      <h5 className="font-medium mb-2">满意度评分</h5>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < selectedAppointment.satisfaction_rating!
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {selectedAppointment.satisfaction_rating}/5
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 操作按钮 */}
              {hasPermission(ADMIN_PERMISSIONS.APPOINTMENT_UPDATE) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">操作</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!selectedAppointment.assigned_admin_id && hasPermission(ADMIN_PERMISSIONS.APPOINTMENT_ASSIGN) && (
                      <div>
                        <Label className="text-sm">分配给</Label>
                        <Select onValueChange={(value) => handleAssignAppointment(selectedAppointment.id, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择管理员" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockAdmins.map((admin) => (
                              <SelectItem key={admin.id} value={admin.id}>
                                {admin.name} ({admin.department})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label className="text-sm">更新状态</Label>
                      <Select 
                        value={selectedAppointment.status} 
                        onValueChange={(value) => handleUpdateStatus(selectedAppointment.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">待确认</SelectItem>
                          <SelectItem value="confirmed">已确认</SelectItem>
                          <SelectItem value="completed">已完成</SelectItem>
                          <SelectItem value="cancelled">已取消</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 跟进记录 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">跟进记录 ({selectedAppointment.follow_up_records.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedAppointment.follow_up_records.map((record) => (
                    <div key={record.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {record.action}
                          </Badge>
                          <span className="text-sm font-medium">{record.admin_name}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(record.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{record.content}</p>
                      {record.result && (
                        <p className="text-sm text-green-600">结果: {record.result}</p>
                      )}
                      {record.next_action && (
                        <p className="text-sm text-blue-600">下一步: {record.next_action}</p>
                      )}
                    </div>
                  ))}

                  {/* 添加跟进记录 */}
                  {hasPermission(ADMIN_PERMISSIONS.APPOINTMENT_UPDATE) && (
                    <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg">
                      <h6 className="font-medium mb-3">添加跟进记录</h6>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm">操作类型</Label>
                          <Select value={newFollowUp.action} onValueChange={(value) => 
                            setNewFollowUp(prev => ({ ...prev, action: value }))
                          }>
                            <SelectTrigger>
                              <SelectValue placeholder="选择操作类型" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="called">电话联系</SelectItem>
                              <SelectItem value="emailed">邮件联系</SelectItem>
                              <SelectItem value="visited">现场访问</SelectItem>
                              <SelectItem value="meeting">会议讨论</SelectItem>
                              <SelectItem value="other">其他</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm">跟进内容</Label>
                          <Textarea
                            placeholder="请输入跟进内容..."
                            value={newFollowUp.content}
                            onChange={(e) => setNewFollowUp(prev => ({ ...prev, content: e.target.value }))}
                            className="min-h-[60px]"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">处理结果</Label>
                          <Input
                            placeholder="请输入处理结果..."
                            value={newFollowUp.result}
                            onChange={(e) => setNewFollowUp(prev => ({ ...prev, result: e.target.value }))}
                          />
                        </div>
                        <Button size="sm" onClick={handleAddFollowUp}>
                          <Plus className="w-4 h-4 mr-2" />
                          添加记录
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">选择预约</h3>
                <p className="text-gray-600">从左侧列表中选择一个预约查看详情</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}






