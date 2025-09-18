"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare,
  Building,
  Briefcase,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  SERVICE_TYPE_LABELS,
  PROJECT_USAGE_LABELS,
  BUDGET_RANGE_LABELS,
  URGENCY_LABELS,
  MEETING_TYPE_LABELS,
  TIME_SLOTS,
  DURATION_OPTIONS
} from '@/types/appointment';
import { REGIONS } from '@/types/user';

export default function AppointmentPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 表单数据
  const [formData, setFormData] = useState({
    service_type: 'consultation',
    service_description: '',
    project_name: '',
    project_area: '',
    project_usage: 'office',
    project_province: '',
    project_city: '',
    project_address: '',
    budget_range: 'under_50',
    urgency: 'medium',
    current_system: '',
    timeline: '',
    provider_type: 'platform_recommend',
    max_providers: 3,
    meeting_type: 'both',
    duration: 60,
    preferred_dates: [] as string[],
    preferred_times: [] as string[],
    special_requirements: '',
    contact_name: user?.nickname || '',
    contact_phone: user?.phone || '',
    contact_email: user?.email || '',
    contact_company: user?.company || '',
    contact_title: '',
    message: ''
  });

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return !!formData.service_type;
      case 2:
        return !!(formData.project_name && formData.project_area && formData.project_province && formData.project_city);
      case 3:
        return true;
      case 4:
        return !!(formData.preferred_dates.length && formData.preferred_times.length && formData.contact_name && formData.contact_phone);
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('预约请求已提交:', formData);
      router.push('/appointment/success');
    } catch (error) {
      console.error('Submit error:', error);
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDate = (date: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_dates: prev.preferred_dates.includes(date)
        ? prev.preferred_dates.filter(d => d !== date)
        : prev.preferred_dates.length < 3 
          ? [...prev.preferred_dates, date]
          : prev.preferred_dates
    }));
  };

  const toggleTime = (time: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_times: prev.preferred_times.includes(time)
        ? prev.preferred_times.filter(t => t !== time)
        : prev.preferred_times.length < 3 
          ? [...prev.preferred_times, time]
          : prev.preferred_times
    }));
  };

  // 如果认证系统还在加载，显示加载状态
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 页面标题和进度 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">预约洽谈</h1>
          <p className="text-gray-600">让我们为您匹配最合适的服务商</p>
          
          {/* 进度条 */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 5 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <h2 className="text-xl font-medium text-gray-900">
              {currentStep === 1 && '选择服务类型'}
              {currentStep === 2 && '项目信息'}
              {currentStep === 3 && '选择服务商'}
              {currentStep === 4 && '预约时间'}
              {currentStep === 5 && '确认信息'}
            </h2>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            {/* 步骤1: 选择服务类型 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">您需要什么服务？</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(SERVICE_TYPE_LABELS).map(([key, label]) => (
                      <div
                        key={key}
                        className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.service_type === key
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => updateField('service_type', key)}
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                            {key === 'consultation' && <MessageSquare className="w-6 h-6 text-white" />}
                            {key === 'design' && <Building className="w-6 h-6 text-white" />}
                            {key === 'procurement' && <Briefcase className="w-6 h-6 text-white" />}
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">{label}</h4>
                          <p className="text-sm text-gray-600">
                            {key === 'consultation' && '节能诊断、方案咨询、技术指导'}
                            {key === 'design' && '方案设计、施工图、系统优化'}
                            {key === 'procurement' && '设备选型、采购咨询、供应商推荐'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>服务描述 (可选)</Label>
                  <Textarea
                    value={formData.service_description}
                    onChange={(e) => updateField('service_description', e.target.value)}
                    placeholder="请简要描述您的具体需求..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* 步骤2: 项目信息 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">项目基本信息</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>项目名称 *</Label>
                    <Input
                      value={formData.project_name}
                      onChange={(e) => updateField('project_name', e.target.value)}
                      placeholder="请输入项目名称"
                    />
                  </div>
                  
                  <div>
                    <Label>建筑面积 (m²) *</Label>
                    <Input
                      type="number"
                      value={formData.project_area}
                      onChange={(e) => updateField('project_area', e.target.value)}
                      placeholder="请输入建筑面积"
                    />
                  </div>

                  <div>
                    <Label>建筑用途 *</Label>
                    <Select value={formData.project_usage} onValueChange={(value) => updateField('project_usage', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择建筑用途" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PROJECT_USAGE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>预算范围 *</Label>
                    <Select value={formData.budget_range} onValueChange={(value) => updateField('budget_range', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择预算范围" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(BUDGET_RANGE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>所在省份 *</Label>
                    <Select value={formData.project_province} onValueChange={(value) => updateField('project_province', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择省份" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.slice(0, 20).map((region) => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>所在城市 *</Label>
                    <Input
                      value={formData.project_city}
                      onChange={(e) => updateField('project_city', e.target.value)}
                      placeholder="请输入城市名称"
                    />
                  </div>

                  <div>
                    <Label>紧急程度</Label>
                    <Select value={formData.urgency} onValueChange={(value) => updateField('urgency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(URGENCY_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>项目时间线</Label>
                    <Input
                      value={formData.timeline}
                      onChange={(e) => updateField('timeline', e.target.value)}
                      placeholder="如：3个月内完成"
                    />
                  </div>
                </div>

                <div>
                  <Label>现有系统描述</Label>
                  <Textarea
                    value={formData.current_system}
                    onChange={(e) => updateField('current_system', e.target.value)}
                    placeholder="请描述现有的HVAC系统情况..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>详细地址</Label>
                  <Input
                    value={formData.project_address}
                    onChange={(e) => updateField('project_address', e.target.value)}
                    placeholder="请输入详细地址（可选）"
                  />
                </div>
              </div>
            )}

            {/* 步骤3: 选择服务商 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">选择服务商</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={formData.provider_type === 'platform_recommend' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateField('provider_type', 'platform_recommend')}
                    >
                      平台推荐
                    </Button>
                    <Button
                      variant={formData.provider_type === 'user_select' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateField('provider_type', 'user_select')}
                    >
                      自主选择
                    </Button>
                  </div>
                </div>

                {formData.provider_type === 'platform_recommend' ? (
                  <div className="p-6 bg-blue-50 rounded-lg text-center">
                    <Building className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h4 className="font-medium text-blue-900 mb-2">智能推荐服务商</h4>
                    <p className="text-blue-700 text-sm mb-4">
                      我们将根据您的项目需求，为您推荐最匹配的 {formData.max_providers} 家服务商
                    </p>
                    <div className="max-w-xs mx-auto">
                      <Label>推荐数量</Label>
                      <Select 
                        value={formData.max_providers.toString()} 
                        onValueChange={(value) => updateField('max_providers', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1家</SelectItem>
                          <SelectItem value="2">2家</SelectItem>
                          <SelectItem value="3">3家</SelectItem>
                          <SelectItem value="5">5家</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-medium text-gray-900 mb-2">服务商列表功能开发中</h4>
                    <p className="text-gray-600">服务商选择功能即将上线</p>
                  </div>
                )}
              </div>
            )}

            {/* 步骤4: 预约时间 */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">预约时间和联系方式</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 联系信息 */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">联系信息</h4>
                    
                    <div>
                      <Label>姓名 *</Label>
                      <Input
                        value={formData.contact_name}
                        onChange={(e) => updateField('contact_name', e.target.value)}
                        placeholder="请输入您的姓名"
                      />
                    </div>
                    
                    <div>
                      <Label>手机号 *</Label>
                      <Input
                        value={formData.contact_phone}
                        onChange={(e) => updateField('contact_phone', e.target.value)}
                        placeholder="请输入手机号"
                      />
                    </div>
                    
                    <div>
                      <Label>邮箱</Label>
                      <Input
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => updateField('contact_email', e.target.value)}
                        placeholder="请输入邮箱地址"
                      />
                    </div>
                    
                    <div>
                      <Label>公司名称</Label>
                      <Input
                        value={formData.contact_company}
                        onChange={(e) => updateField('contact_company', e.target.value)}
                        placeholder="请输入公司名称"
                      />
                    </div>

                    <div>
                      <Label>职位</Label>
                      <Input
                        value={formData.contact_title}
                        onChange={(e) => updateField('contact_title', e.target.value)}
                        placeholder="请输入职位"
                      />
                    </div>
                  </div>

                  {/* 预约信息 */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">预约信息</h4>
                    
                    <div>
                      <Label>会议方式</Label>
                      <Select value={formData.meeting_type} onValueChange={(value) => updateField('meeting_type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(MEETING_TYPE_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>预期时长</Label>
                      <Select 
                        value={formData.duration.toString()} 
                        onValueChange={(value) => updateField('duration', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DURATION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>偏好日期 (选择2-3个) *</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {Array.from({ length: 14 }, (_, i) => {
                          const date = new Date();
                          date.setDate(date.getDate() + i + 1);
                          const dateStr = date.toISOString().split('T')[0];
                          const isSelected = formData.preferred_dates.includes(dateStr);
                          
                          return (
                            <Button
                              key={dateStr}
                              variant={isSelected ? 'default' : 'outline'}
                              size="sm"
                              className="text-xs"
                              onClick={() => toggleDate(dateStr)}
                            >
                              {date.getMonth() + 1}/{date.getDate()}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <Label>偏好时间段 (选择2-3个) *</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {TIME_SLOTS.map((timeSlot) => {
                          const isSelected = formData.preferred_times.includes(timeSlot);
                          
                          return (
                            <Button
                              key={timeSlot}
                              variant={isSelected ? 'default' : 'outline'}
                              size="sm"
                              className="text-xs"
                              onClick={() => toggleTime(timeSlot)}
                            >
                              {timeSlot}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <Label>特殊要求</Label>
                      <Textarea
                        value={formData.special_requirements}
                        onChange={(e) => updateField('special_requirements', e.target.value)}
                        placeholder="如：需要现场勘察、需要带技术资料等..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>留言和需求描述 *</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="请详细描述您的需求、期望和关注点..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* 步骤5: 确认信息 */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">确认预约信息</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">服务信息</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">服务类型: </span>
                        <span className="font-medium">{SERVICE_TYPE_LABELS[formData.service_type as keyof typeof SERVICE_TYPE_LABELS]}</span>
                      </div>
                      {formData.service_description && (
                        <div>
                          <span className="text-gray-600">服务描述: </span>
                          <span className="font-medium">{formData.service_description}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">项目信息</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">项目名称: </span>
                        <span className="font-medium">{formData.project_name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">建筑面积: </span>
                        <span className="font-medium">{formData.project_area} m²</span>
                      </div>
                      <div>
                        <span className="text-gray-600">建筑用途: </span>
                        <span className="font-medium">{PROJECT_USAGE_LABELS[formData.project_usage as keyof typeof PROJECT_USAGE_LABELS]}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">预算范围: </span>
                        <span className="font-medium">{BUDGET_RANGE_LABELS[formData.budget_range as keyof typeof BUDGET_RANGE_LABELS]}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">项目地址: </span>
                        <span className="font-medium">{formData.project_province} {formData.project_city}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">联系信息</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">姓名: </span>
                        <span className="font-medium">{formData.contact_name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">手机号: </span>
                        <span className="font-medium">{formData.contact_phone}</span>
                      </div>
                      {formData.contact_email && (
                        <div>
                          <span className="text-gray-600">邮箱: </span>
                          <span className="font-medium">{formData.contact_email}</span>
                        </div>
                      )}
                      {formData.contact_company && (
                        <div>
                          <span className="text-gray-600">公司: </span>
                          <span className="font-medium">{formData.contact_company}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">预约信息</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">会议方式: </span>
                        <span className="font-medium">{MEETING_TYPE_LABELS[formData.meeting_type as keyof typeof MEETING_TYPE_LABELS]}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">预期时长: </span>
                        <span className="font-medium">{formData.duration}分钟</span>
                      </div>
                      <div>
                        <span className="text-gray-600">偏好日期: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.preferred_dates.map((date) => (
                            <span key={date} className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {new Date(date).toLocaleDateString('zh-CN')}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">偏好时间: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.preferred_times.map((time) => (
                            <span key={time} className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {formData.message && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">留言内容</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm">{formData.message}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            上一步
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              disabled={!validateCurrentStep()}
            >
              下一步
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!validateCurrentStep() || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  提交中...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  确认提交
                </>
              )}
            </Button>
          )}
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">
            💡 提交预约后，我们将在24小时内为您匹配合适的服务商，并通过短信和邮件通知您
          </p>
        </div>
      </div>
    </div>
  );
}
