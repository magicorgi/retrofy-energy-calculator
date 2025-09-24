"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Building, 
  ShoppingCart, 
  Settings, 
  Briefcase, 
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  Calendar,
  MapPin,
  Lock, 
  AlertCircle 
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext'; 
import { useAuth } from '@/contexts/AuthContext'; 
import Link from 'next/link';

export default function CustomerVisitPage() {
  const { isAdmin, isLoading: adminLoading } = useAdmin(); 
  const { isAuthenticated, isLoading: authLoading } = useAuth(); 
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // 客户基本信息
    customerName: '',
    customerCompany: '',
    visitDate: '',
    visitLocation: '',
    visitPurpose: '',
    
    // 商务关系模块
    decisionMaker: {
      position: '',
      businessScope: '',
      relationshipLevel: ''
    },
    
    // 采购信息模块
    procurement: {
      projectTime: '',
      budgetTime: '',
      procurementMethod: ''
    },
    
    // 设备基本信息模块
    equipment: {
      danfossUsage: '',
      competitorUsage: '',
      environment: '',
      lifecycle: {
        model: '',
        age: '',
        power: ''
      },
      applicationMethod: '',
      importantPositions: '',
      importanceReason: '',
      downtimeLoss: '',
      currentPainPoints: '',
      currentSolutions: ''
    },
    
    // 供应商信息模块
    suppliers: {
      maintenanceProvider: '',
      replacementProvider: ''
    },
    
    // 机会信息模块
    opportunities: {
      budget: '',
      projects: '',
      participation: '',
      competitors: '',
      nextYearPlan: ''
    }
  });

  const totalSteps = 6;

  const steps = [
    { id: 1, title: '客户信息', description: '客户基本信息', icon: Building },
    { id: 2, title: '商务关系', description: '决策人信息', icon: User },
    { id: 3, title: '采购信息', description: '采购流程信息', icon: ShoppingCart },
    { id: 4, title: '设备信息', description: '设备基本信息', icon: Settings },
    { id: 5, title: '供应商信息', description: '供应商信息', icon: Briefcase },
    { id: 6, title: '机会信息', description: '机会点搜集', icon: Target }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('提交客户拜访记录:', formData);
    alert('客户拜访记录保存成功！');
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedField = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateDeepNestedField = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  // 加载状态和权限检查
  if (adminLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">需要登录</h2>
            <p className="text-gray-600 mb-6">请先登录以访问客户拜访工具</p>
            <Button asChild>
              <Link href="/auth/login">立即登录</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">访问受限</h2>
            <p className="text-gray-600 mb-6">客户拜访工具仅限管理员使用</p>
            <Button variant="outline" asChild>
              <Link href="/">返回首页</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">客户基本信息</h3>
              <p className="text-gray-600">请填写客户的基本信息</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  客户信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      客户名称 *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="请输入客户名称"
                      value={formData.customerName}
                      onChange={(e) => updateField('customerName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      客户公司 *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="请输入客户公司"
                      value={formData.customerCompany}
                      onChange={(e) => updateField('customerCompany', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      拜访日期 *
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={formData.visitDate}
                      onChange={(e) => updateField('visitDate', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      拜访地点 *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="请输入拜访地点"
                      value={formData.visitLocation}
                      onChange={(e) => updateField('visitLocation', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    拜访目的
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请描述本次拜访的主要目的"
                    rows={3}
                    value={formData.visitPurpose}
                    onChange={(e) => updateField('visitPurpose', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">商务关系</h3>
              <p className="text-gray-600">决策人信息和商务关系</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  决策人信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    决策人职位 *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请输入决策人职位"
                    value={formData.decisionMaker.position}
                    onChange={(e) => updateNestedField('decisionMaker', 'position', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    负责业务范围
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请描述决策人负责的业务范围"
                    rows={3}
                    value={formData.decisionMaker.businessScope}
                    onChange={(e) => updateNestedField('decisionMaker', 'businessScope', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    关系距离/程度
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.decisionMaker.relationshipLevel}
                    onChange={(e) => updateNestedField('decisionMaker', 'relationshipLevel', e.target.value)}
                  >
                    <option value="">请选择关系程度</option>
                    <option value="初次接触">初次接触</option>
                    <option value="一般了解">一般了解</option>
                    <option value="熟悉">熟悉</option>
                    <option value="深度合作">深度合作</option>
                    <option value="战略伙伴">战略伙伴</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">采购信息</h3>
              <p className="text-gray-600">采购流程相关信息</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  采购流程
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    采购方式 *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.procurement.procurementMethod}
                    onChange={(e) => updateNestedField('procurement', 'procurementMethod', e.target.value)}
                  >
                    <option value="">请选择采购方式</option>
                    <option value="公开招标">公开招标</option>
                    <option value="邀请招标">邀请招标</option>
                    <option value="竞争性谈判">竞争性谈判</option>
                    <option value="单一来源采购">单一来源采购</option>
                    <option value="询价采购">询价采购</option>
                    <option value="框架协议">框架协议</option>
                    <option value="其他">其他</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    立项时间点
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.procurement.projectTime}
                    onChange={(e) => updateNestedField('procurement', 'projectTime', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    预算决策时间点
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.procurement.budgetTime}
                    onChange={(e) => updateNestedField('procurement', 'budgetTime', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">设备基本信息</h3>
              <p className="text-gray-600">变频器用量和重要设备信息</p>
            </div>

            {/* 变频器用量卡片 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  变频器用量
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      丹佛斯用量 *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="请输入丹佛斯变频器用量"
                      value={formData.equipment.danfossUsage}
                      onChange={(e) => updateNestedField('equipment', 'danfossUsage', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      友商用量 *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="请输入友商变频器用量"
                      value={formData.equipment.competitorUsage}
                      onChange={(e) => updateNestedField('equipment', 'competitorUsage', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    使用环境
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.equipment.environment}
                    onChange={(e) => updateNestedField('equipment', 'environment', e.target.value)}
                  >
                    <option value="">请选择使用环境</option>
                    <option value="恶劣">恶劣</option>
                    <option value="较好">较好</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      机型
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="请输入机型"
                      value={formData.equipment.lifecycle.model}
                      onChange={(e) => updateDeepNestedField('equipment', 'lifecycle', 'model', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      启机年龄
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="如：5年"
                      value={formData.equipment.lifecycle.age}
                      onChange={(e) => updateDeepNestedField('equipment', 'lifecycle', 'age', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      功率
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={formData.equipment.lifecycle.power}
                      onChange={(e) => updateDeepNestedField('equipment', 'lifecycle', 'power', e.target.value)}
                    >
                      <option value="">请选择功率</option>
                      <option value="大">大</option>
                      <option value="中">中</option>
                      <option value="小">小</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    主要应用方式
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请描述变频器的主要应用方式"
                    rows={3}
                    value={formData.equipment.applicationMethod}
                    onChange={(e) => updateNestedField('equipment', 'applicationMethod', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 重要设备卡片 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  重要设备
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    重点工位有哪些？ *
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请描述重点工位"
                    rows={3}
                    value={formData.equipment.importantPositions}
                    onChange={(e) => updateNestedField('equipment', 'importantPositions', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    为什么重要？ *
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请说明重点工位的重要性"
                    rows={3}
                    value={formData.equipment.importanceReason}
                    onChange={(e) => updateNestedField('equipment', 'importanceReason', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    停机带来的损失
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请描述停机带来的损失"
                    rows={3}
                    value={formData.equipment.downtimeLoss}
                    onChange={(e) => updateNestedField('equipment', 'downtimeLoss', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目前的痛点？
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请描述目前的痛点"
                    rows={3}
                    value={formData.equipment.currentPainPoints}
                    onChange={(e) => updateNestedField('equipment', 'currentPainPoints', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目前的解决方式
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请描述目前的解决方式"
                    rows={3}
                    value={formData.equipment.currentSolutions}
                    onChange={(e) => updateNestedField('equipment', 'currentSolutions', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">供应商信息</h3>
              <p className="text-gray-600">目前的供应途径信息</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  目前的供应途径
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目前的维保谁在做？ *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请输入维保供应商"
                    value={formData.suppliers.maintenanceProvider}
                    onChange={(e) => updateNestedField('suppliers', 'maintenanceProvider', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目前的替换/改造谁来做？ *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请输入改造供应商"
                    value={formData.suppliers.replacementProvider}
                    onChange={(e) => updateNestedField('suppliers', 'replacementProvider', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">机会信息</h3>
              <p className="text-gray-600">机会点搜集和竞争分析</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  机会点搜集
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    今年的改造预算 *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请输入今年的改造预算"
                    value={formData.opportunities.budget}
                    onChange={(e) => updateNestedField('opportunities', 'budget', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    已经立项的项目有哪些？我们是否能够参与？ *
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请描述已立项项目和参与可能性"
                    rows={4}
                    value={formData.opportunities.projects}
                    onChange={(e) => updateNestedField('opportunities', 'projects', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目前的参与情况/竞争对手信息 *
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请描述参与情况和竞争对手信息"
                    rows={4}
                    value={formData.opportunities.competitors}
                    onChange={(e) => updateNestedField('opportunities', 'competitors', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    明年的计划 *
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请描述明年的计划"
                    rows={4}
                    value={formData.opportunities.nextYearPlan}
                    onChange={(e) => updateNestedField('opportunities', 'nextYearPlan', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">客户拜访工具</h1>
          <p className="text-gray-600">专业的客户拜访记录和管理工具</p>
        </div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">步骤 {currentStep} / {totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        {/* 步骤指示器 */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentStep === step.id
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : currentStep > step.id
                    ? 'bg-green-50 text-green-600 hover:bg-green-100'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                tabIndex={0}
                role="button"
                aria-label={`跳转到步骤 ${step.id}: ${step.title}`}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  React.createElement(step.icon, { className: "w-5 h-5" })
                )}
                <span className="font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 提示信息 */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">💡 点击下方步骤可快速跳转到对应内容</p>
        </div>

        {/* 表单内容 */}
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>

        {/* 导航按钮 */}
        <div className="flex justify-between items-center mt-8 max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>上一步</span>
          </Button>

          <div className="flex space-x-4">
            <Button variant="outline" asChild>
              <Link href="/">取消</Link>
            </Button>
            
            {currentStep === totalSteps ? (
              <Button
                onClick={handleSubmit}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                <span>保存记录</span>
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center space-x-2"
              >
                <span>下一步</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
