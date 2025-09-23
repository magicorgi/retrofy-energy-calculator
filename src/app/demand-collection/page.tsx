"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ClipboardList, 
  Building, 
  Thermometer, 
  Zap, 
  DollarSign, 
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Target,
  Users,
  MapPin
} from 'lucide-react';

export default function DemandCollectionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // 基本信息
    companyName: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    region: '',
    
    // 项目信息
    projectType: '',
    buildingType: '',
    buildingArea: '',
    buildingAge: '',
    
    // 能耗现状
    annualElectricityBill: '',
    annualGasBill: '',
    hvacSystemType: '',
    hvacSystemAge: '',
    
    // 改造需求
    primaryGoals: [],
    budgetRange: '',
    urgencyLevel: '',
    timeline: '',
    
    // 技术偏好
    preferredTechnologies: [],
    environmentalRequirements: '',
    
    // 项目详情
    projectDescription: '',
    additionalRequirements: ''
  });

  const totalSteps = 6;

  const steps = [
    { id: 1, title: '基本信息', description: '公司及联系人信息', icon: Users },
    { id: 2, title: '项目概况', description: '建筑及项目基本信息', icon: Building },
    { id: 3, title: '能耗现状', description: '当前能源消耗情况', icon: Thermometer },
    { id: 4, title: '改造需求', description: '节能改造目标与预算', icon: Target },
    { id: 5, title: '技术偏好', description: '技术方案偏好', icon: Zap },
    { id: 6, title: '项目详情', description: '详细需求描述', icon: ClipboardList }
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
    // 这里将处理表单提交
    console.log('提交需求收集表单:', formData);
    alert('需求收集完成！我们会尽快与您联系。');
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公司名称 *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="请输入您的公司名称"
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                联系人姓名 *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="请输入联系人姓名"
                value={formData.contactName}
                onChange={(e) => updateField('contactName', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                联系电话 *
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="请输入联系电话"
                value={formData.contactPhone}
                onChange={(e) => updateField('contactPhone', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="请输入邮箱地址"
                value={formData.contactEmail}
                onChange={(e) => updateField('contactEmail', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                所在地区 *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.region}
                onChange={(e) => updateField('region', e.target.value)}
              >
                <option value="">请选择地区</option>
                <option value="华北">华北地区</option>
                <option value="华东">华东地区</option>
                <option value="华南">华南地区</option>
                <option value="华中">华中地区</option>
                <option value="西南">西南地区</option>
                <option value="西北">西北地区</option>
                <option value="东北">东北地区</option>
              </select>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                项目类型 *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.projectType}
                onChange={(e) => updateField('projectType', e.target.value)}
              >
                <option value="">请选择项目类型</option>
                <option value="办公楼">办公楼</option>
                <option value="商场">商场</option>
                <option value="酒店">酒店</option>
                <option value="医院">医院</option>
                <option value="学校">学校</option>
                <option value="工厂">工厂</option>
                <option value="数据中心">数据中心</option>
                <option value="其他">其他</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                建筑类型 *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.buildingType}
                onChange={(e) => updateField('buildingType', e.target.value)}
              >
                <option value="">请选择建筑类型</option>
                <option value="新建">新建建筑</option>
                <option value="既有建筑">既有建筑改造</option>
                <option value="扩建">扩建项目</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                建筑面积 (m²) *
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="请输入建筑面积"
                value={formData.buildingArea}
                onChange={(e) => updateField('buildingArea', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                建筑年限
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.buildingAge}
                onChange={(e) => updateField('buildingAge', e.target.value)}
              >
                <option value="">请选择建筑年限</option>
                <option value="0-5年">0-5年</option>
                <option value="5-10年">5-10年</option>
                <option value="10-20年">10-20年</option>
                <option value="20年以上">20年以上</option>
              </select>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-12">
            <ClipboardList className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              调研问题即将上线
            </h3>
            <p className="text-gray-600 mb-6">
              我们正在准备详细的调研问题，将包括能耗现状、改造需求、技术偏好等内容
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• 能耗现状分析</p>
              <p>• 改造目标设定</p>
              <p>• 预算与时间规划</p>
              <p>• 技术方案偏好</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">节能改造需求收集</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            通过专业的调研问卷，我们帮您分析节能改造需求，制定最适合的改造方案
          </p>
        </div>

        {/* 步骤指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= step.id 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3 hidden md:block">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        {/* 表单内容 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* 导航按钮 */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            上一步
          </Button>
          
          <div className="flex gap-3">
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                下一步
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                提交需求
              </Button>
            )}
          </div>
        </div>

        {/* 特色说明 */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Target className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2">精准需求分析</h3>
              <p className="text-sm text-gray-600">
                通过专业问卷深入了解您的具体需求和项目特点
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">定制化方案</h3>
              <p className="text-sm text-gray-600">
                基于需求分析为您提供最适合的节能改造解决方案
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold mb-2">专家对接</h3>
              <p className="text-sm text-gray-600">
                专业团队跟进，提供从咨询到实施的全流程服务
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
