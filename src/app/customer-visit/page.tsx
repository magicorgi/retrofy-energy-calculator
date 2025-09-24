"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  Settings, 
  Target, 
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Lock, 
  AlertCircle,
  MapPin,
  ClipboardList,
  Zap,
  Building,
  User,
  ShoppingCart
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
    console.log('提交客户拜访表单:', formData);
    alert('客户拜访记录完成！');
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedField = (parentField: string, childField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  };

  const updateDeepNestedField = (parentField: string, childField: string, grandChildField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: {
          ...prev[parentField][childField],
          [grandChildField]: value
        }
      }
    }));
  };

  // 计算每个步骤的完成度
  const getStepCompletionRate = (stepId: number) => {
    switch (stepId) {
      case 1: // 客户信息
        const basicFields = [formData.customerName, formData.customerCompany, formData.visitDate, formData.visitLocation];
        return Math.round((basicFields.filter(field => field.trim() !== '').length / basicFields.length) * 100);
      
      case 2: // 商务关系
        const businessFields = [formData.decisionMaker.position];
        return Math.round((businessFields.filter(field => field.trim() !== '').length / businessFields.length) * 100);
      
      case 3: // 采购信息
        const procurementFields = [formData.procurement.procurementMethod];
        return Math.round((procurementFields.filter(field => field.trim() !== '').length / procurementFields.length) * 100);
      
      case 4: // 设备信息
        const equipmentFields = [formData.equipment.danfossUsage, formData.equipment.competitorUsage, formData.equipment.importantPositions, formData.equipment.importanceReason];
        return Math.round((equipmentFields.filter(field => field.trim() !== '').length / equipmentFields.length) * 100);
      
      case 5: // 供应商信息
        const supplierFields = [formData.suppliers.maintenanceProvider, formData.suppliers.replacementProvider];
        return Math.round((supplierFields.filter(field => field.trim() !== '').length / supplierFields.length) * 100);
      
      case 6: // 机会信息
        return 0; // 机会信息都是可选的，完成度始终为0
      
      default:
        return 0;
    }
  };

  // 检查访问权限
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
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
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">需要登录</h2>
            <p className="text-gray-600 mb-6">请先登录以访问客户拜访工具</p>
            <Link href="/auth/login">
              <Button className="w-full">去登录</Button>
            </Link>
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
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">访问受限</h2>
            <p className="text-gray-600 mb-6">客户拜访工具仅限管理员使用</p>
            <Link href="/">
              <Button variant="outline" className="w-full">返回首页</Button>
            </Link>
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

      case 2:
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
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.decisionMaker.position}
                    onChange={(e) => updateNestedField('decisionMaker', 'position', e.target.value)}
                  >
                    <option value="">请选择决策人职位</option>
                    <option value="总经理/CEO">总经理/CEO</option>
                    <option value="副总经理/副总裁">副总经理/副总裁</option>
                    <option value="技术总监">技术总监</option>
                    <option value="运营总监">运营总监</option>
                    <option value="采购总监">采购总监</option>
                    <option value="财务总监/CFO">财务总监/CFO</option>
                    <option value="生产总监">生产总监</option>
                    <option value="设备总监">设备总监</option>
                    <option value="工程总监">工程总监</option>
                    <option value="技术经理">技术经理</option>
                    <option value="设备经理">设备经理</option>
                    <option value="工程经理">工程经理</option>
                    <option value="采购经理">采购经理</option>
                    <option value="运营经理">运营经理</option>
                    <option value="生产经理">生产经理</option>
                    <option value="厂务经理">厂务经理</option>
                    <option value="厂务设施经理">厂务设施经理</option>
                    <option value="能源经理">能源经理</option>
                    <option value="节能经理">节能经理</option>
                    <option value="环保经理">环保经理</option>
                    <option value="安全经理">安全经理</option>
                    <option value="质量经理">质量经理</option>
                    <option value="维护经理">维护经理</option>
                    <option value="电气工程师">电气工程师</option>
                    <option value="机械工程师">机械工程师</option>
                    <option value="暖通工程师">暖通工程师</option>
                    <option value="自动化工程师">自动化工程师</option>
                    <option value="设备工程师">设备工程师</option>
                    <option value="能源工程师">能源工程师</option>
                    <option value="环保工程师">环保工程师</option>
                    <option value="项目经理">项目经理</option>
                    <option value="技术主管">技术主管</option>
                    <option value="设备主管">设备主管</option>
                    <option value="维护主管">维护主管</option>
                    <option value="采购主管">采购主管</option>
                    <option value="其他">其他</option>
                  </select>
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

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">采购信息</h3>
              <p className="text-gray-600">采购流程和预算信息</p>
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

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">设备信息</h3>
              <p className="text-gray-600">变频器和重要设备信息</p>
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
                    今年的改造预算
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请输入改造预算金额"
                    value={formData.opportunities.budget}
                    onChange={(e) => updateNestedField('opportunities', 'budget', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    已经立项的项目有哪些？我们是否能够参与？
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请描述已立项项目和参与可能性"
                    rows={3}
                    value={formData.opportunities.projects}
                    onChange={(e) => updateNestedField('opportunities', 'projects', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目前的参与情况/竞争对手信息
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请描述参与情况和竞争对手分析"
                    rows={3}
                    value={formData.opportunities.participation}
                    onChange={(e) => updateNestedField('opportunities', 'participation', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    竞争对手信息
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请描述竞争对手情况"
                    rows={3}
                    value={formData.opportunities.competitors}
                    onChange={(e) => updateNestedField('opportunities', 'competitors', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    明年的计划
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="请描述客户明年的发展规划"
                    rows={3}
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
          <p className="text-gray-600">记录客户拜访中的关键信息</p>
        </div>

        {/* 步骤导航 */}
        <div className="mb-8">
          {/* 步骤图标 */}
          <div className="flex justify-center items-center mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors duration-200 cursor-pointer ${
                    currentStep === step.id
                      ? 'bg-green-500 border-green-500 text-white'
                      : currentStep > step.id
                      ? 'bg-green-100 border-green-500 text-green-500'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                  onClick={() => setCurrentStep(step.id)}
                  title={`${step.title} - ${step.description}`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    React.createElement(step.icon, { className: "w-6 h-6" })
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-12 h-0.5 bg-gray-300 mx-2"></div>
                )}
              </div>
            ))}
          </div>

          {/* 步骤标题和完成度 */}
          <div className="grid grid-cols-6 gap-4 mb-4">
            {steps.map((step) => (
              <div key={step.id} className="text-center">
                <p className={`text-sm font-medium ${
                  currentStep === step.id ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-400 mb-2">{step.description}</p>
                {/* 完成度指示器 */}
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-green-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${getStepCompletionRate(step.id)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getStepCompletionRate(step.id)}%
                </p>
              </div>
            ))}
          </div>
          
          {/* 总体进度条 */}
          <Progress value={(currentStep / totalSteps) * 100} className="h-3" />
        </div>

        {/* 表单内容 */}
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>

        {/* 导航按钮 */}
        <div className="max-w-4xl mx-auto mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            上一步
          </Button>

          {currentStep === totalSteps ? (
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4" />
              完成记录
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              下一步
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}