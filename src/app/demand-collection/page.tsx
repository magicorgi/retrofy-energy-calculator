"use client";

import React, { useState, useEffect } from 'react';
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
  MapPin,
  Lock,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function DemandCollectionPage() {
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [surveyType, setSurveyType] = useState<'building' | 'factory' | 'park'>('factory');
  const [formData, setFormData] = useState({
    // 基本信息
    companyName: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactPosition: '',
    contactLevel: '',
    region: '',
    city: '',
    detailedAddress: '',
    ownerName: '',
    
    // 项目信息
    projectType: '',
    buildingType: '',
    buildingArea: '',
    buildingAge: '',
    
    // 工厂专用信息
    industry: '',
    mainEnergySystems: [],
    chillerType: '',
    chillerCapacity: '',
    hasHeatRecoveryChiller: false,
    steamBoilerType: '',
    steamBoilerCapacity: '',
    hotWaterBoilerType: '',
    hotWaterBoilerCapacity: '',
    airCompressorPower: '',
    airCompressorCapacity: '',
    coolingWaterFlow: '',
    hasCleanRoom: false,
    cleanRoomArea: '',
    hasPreheatReheat: false,
    usesHeatRecovery: false,
    
    // 能耗现状
    annualElectricityBill: '',
    annualGasBill: '',
    hvacSystemType: '',
    hvacSystemAge: '',
    
    // 能耗数据
    energyConsumption: {
      chillerElectric: '',
      chillerGas: '',
      chillerOil: '',
      boilerGas: '',
      boilerOil: '',
      steamBoilerGas: '',
      steamBoilerOil: '',
      hotWaterBoilerGas: '',
      hotWaterBoilerOil: '',
      coolingTowerElectric: '',
      pumpElectric: '',
      airCompressorElectric: ''
    },
    
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

  const totalSteps = 4;

  const steps = [
    { id: 1, title: '调研类型', description: '选择调研对象类型', icon: ClipboardList },
    { id: 2, title: '工厂基本情况', description: '工厂基本信息与行业分类', icon: Building },
    { id: 3, title: '主要能耗设备', description: '能耗设备形式与规格', icon: Thermometer },
    { id: 4, title: '能耗基本情况', description: '上年度能耗消耗量', icon: Target }
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
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // 当地区改变时，清空城市选择
      if (field === 'region') {
        newData.city = '';
      }
      
      return newData;
    });
  };

  const updateEnergyConsumption = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      energyConsumption: {
        ...prev.energyConsumption,
        [field]: value
      }
    }));
  };

  const toggleArrayField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value]
    }));
  };

  // 权限检查
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 非管理员访问限制
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">访问受限</h2>
            <p className="text-gray-600 mb-6">
              需求收集功能仅对管理员开放，请先登录管理员账户
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  管理员登录
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  返回首页
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">选择调研对象类型</h3>
              <p className="text-gray-600">请选择您要调研的对象类型，我们将为您提供相应的专业问卷</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  surveyType === 'factory' ? 'ring-2 ring-green-500 bg-green-50' : ''
                }`}
                onClick={() => setSurveyType('factory')}
              >
                <CardContent className="p-6 text-center">
                  <Building className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <h4 className="font-semibold mb-2">工厂调研</h4>
                  <p className="text-sm text-gray-600">工业制造企业能耗调研</p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  surveyType === 'building' ? 'ring-2 ring-green-500 bg-green-50' : ''
                }`}
                onClick={() => setSurveyType('building')}
              >
                <CardContent className="p-6 text-center">
                  <Building className="w-8 h-8 mx-auto mb-3 text-green-600" />
                  <h4 className="font-semibold mb-2">建筑调研</h4>
                  <p className="text-sm text-gray-600">商业建筑能耗调研</p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  surveyType === 'park' ? 'ring-2 ring-green-500 bg-green-50' : ''
                }`}
                onClick={() => setSurveyType('park')}
              >
                <CardContent className="p-6 text-center">
                  <Building className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                  <h4 className="font-semibold mb-2">园区调研</h4>
                  <p className="text-sm text-gray-600">产业园区能耗调研</p>
                </CardContent>
              </Card>
            </div>
            
            {surveyType === 'factory' && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">工厂调研内容预览</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 工厂基本情况与行业分类</li>
                  <li>• 主要能耗系统分析</li>
                  <li>• 能耗设备详细规格</li>
                  <li>• 上年度能耗数据统计</li>
                </ul>
              </div>
            )}
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
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
                  业主名称 *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="请输入业主名称"
                  value={formData.ownerName}
                  onChange={(e) => updateField('ownerName', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                详细地址 *
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="请输入工厂详细地址"
                rows={2}
                value={formData.detailedAddress}
                onChange={(e) => updateField('detailedAddress', e.target.value)}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
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
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
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
                  职位 *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.contactPosition}
                  onChange={(e) => updateField('contactPosition', e.target.value)}
                >
                  <option value="">请选择职位</option>
                  <option value="总经理">总经理</option>
                  <option value="副总经理">副总经理</option>
                  <option value="总工程师">总工程师</option>
                  <option value="副总工程师">副总工程师</option>
                  <option value="部门经理">部门经理</option>
                  <option value="副部门经理">副部门经理</option>
                  <option value="项目经理">项目经理</option>
                  <option value="主管">主管</option>
                  <option value="工程师">工程师</option>
                  <option value="助理工程师">助理工程师</option>
                  <option value="技术员">技术员</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  职级
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.contactLevel}
                  onChange={(e) => updateField('contactLevel', e.target.value)}
                >
                  <option value="">请选择职级</option>
                  <option value="高级">高级</option>
                  <option value="中级">中级</option>
                  <option value="初级">初级</option>
                  <option value="无">无</option>
                </select>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所在城市 *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                >
                  <option value="">请先选择地区</option>
                  {formData.region === '华北' && (
                    <>
                      <option value="北京">北京</option>
                      <option value="天津">天津</option>
                      <option value="石家庄">石家庄</option>
                      <option value="太原">太原</option>
                      <option value="呼和浩特">呼和浩特</option>
                      <option value="唐山">唐山</option>
                      <option value="秦皇岛">秦皇岛</option>
                      <option value="保定">保定</option>
                      <option value="张家口">张家口</option>
                    </>
                  )}
                  {formData.region === '华东' && (
                    <>
                      <option value="上海">上海</option>
                      <option value="南京">南京</option>
                      <option value="杭州">杭州</option>
                      <option value="合肥">合肥</option>
                      <option value="福州">福州</option>
                      <option value="南昌">南昌</option>
                      <option value="济南">济南</option>
                      <option value="苏州">苏州</option>
                      <option value="无锡">无锡</option>
                      <option value="宁波">宁波</option>
                      <option value="青岛">青岛</option>
                    </>
                  )}
                  {formData.region === '华南' && (
                    <>
                      <option value="广州">广州</option>
                      <option value="深圳">深圳</option>
                      <option value="珠海">珠海</option>
                      <option value="汕头">汕头</option>
                      <option value="佛山">佛山</option>
                      <option value="湛江">湛江</option>
                      <option value="南宁">南宁</option>
                      <option value="海口">海口</option>
                      <option value="三亚">三亚</option>
                    </>
                  )}
                  {formData.region === '华中' && (
                    <>
                      <option value="郑州">郑州</option>
                      <option value="武汉">武汉</option>
                      <option value="长沙">长沙</option>
                      <option value="洛阳">洛阳</option>
                      <option value="宜昌">宜昌</option>
                      <option value="襄阳">襄阳</option>
                      <option value="株洲">株洲</option>
                      <option value="湘潭">湘潭</option>
                    </>
                  )}
                  {formData.region === '西南' && (
                    <>
                      <option value="重庆">重庆</option>
                      <option value="成都">成都</option>
                      <option value="贵阳">贵阳</option>
                      <option value="昆明">昆明</option>
                      <option value="拉萨">拉萨</option>
                      <option value="绵阳">绵阳</option>
                      <option value="遵义">遵义</option>
                      <option value="大理">大理</option>
                    </>
                  )}
                  {formData.region === '西北' && (
                    <>
                      <option value="西安">西安</option>
                      <option value="兰州">兰州</option>
                      <option value="西宁">西宁</option>
                      <option value="银川">银川</option>
                      <option value="乌鲁木齐">乌鲁木齐</option>
                      <option value="宝鸡">宝鸡</option>
                      <option value="天水">天水</option>
                      <option value="石河子">石河子</option>
                    </>
                  )}
                  {formData.region === '东北' && (
                    <>
                      <option value="沈阳">沈阳</option>
                      <option value="大连">大连</option>
                      <option value="长春">长春</option>
                      <option value="哈尔滨">哈尔滨</option>
                      <option value="鞍山">鞍山</option>
                      <option value="抚顺">抚顺</option>
                      <option value="吉林">吉林</option>
                      <option value="齐齐哈尔">齐齐哈尔</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-8">
            {/* 工厂基本情况标题 */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">工厂基本情况</h3>
              <p className="text-gray-600">请填写工厂的基本信息和行业分类</p>
            </div>

            {/* 基本信息卡片 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      详细地址 *
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="请输入工厂详细地址"
                      rows={2}
                      value={formData.detailedAddress}
                      onChange={(e) => updateField('detailedAddress', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      业主名称 *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="请输入业主名称"
                      value={formData.ownerName}
                      onChange={(e) => updateField('ownerName', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 所属行业卡片 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  1）所属行业（单选）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    '食品饮料', '电子半导体', '制药生物制品', '烟草', 
                    '金属冶炼/金属加工', '化工', '汽车工业', '机械加工'
                  ].map((industry) => (
                    <label key={industry} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="industry"
                        value={industry}
                        checked={formData.industry === industry}
                        onChange={(e) => updateField('industry', e.target.value)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{industry}</span>
                    </label>
                  ))}
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="industry"
                      value="其他"
                      checked={formData.industry === '其他'}
                      onChange={(e) => updateField('industry', e.target.value)}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">其他：</span>
                    <input
                      type="text"
                      placeholder="请填写"
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                      value={formData.industry === '其他' ? formData.industry : ''}
                      onChange={(e) => updateField('industry', `其他：${e.target.value}`)}
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* 主要能耗系统卡片 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  2）主要能耗系统（多选）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    '冷冻站', '蒸汽锅炉', '热水锅炉', '市政蒸汽/市政热力',
                    '循环冷却水', '洁净厂房', '空气压缩机'
                  ].map((system) => (
                    <label key={system} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.mainEnergySystems.includes(system)}
                        onChange={() => toggleArrayField('mainEnergySystems', system)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{system}</span>
                    </label>
                  ))}
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.mainEnergySystems.some((item: string) => item.startsWith('其他：'))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const otherValue = prompt('请输入其他能耗系统：');
                          if (otherValue) {
                            toggleArrayField('mainEnergySystems', `其他：${otherValue}`);
                          }
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            mainEnergySystems: prev.mainEnergySystems.filter((item: string) => !item.startsWith('其他：'))
                          }));
                        }
                      }}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">其他：</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-8">
            {/* 主要能耗设备形式标题 */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">主要能耗设备形式</h3>
              <p className="text-gray-600">请填写各类能耗设备的详细规格信息</p>
            </div>

            {/* 冷水机组卡片 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  1）冷水机组
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">冷水机组类型（多选）</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['水冷式离心机', '水冷式螺杆机', '水冷式活塞机', '风冷热泵'].map((type) => (
                      <label key={type} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.chillerType.includes(type)}
                          onChange={() => toggleArrayField('chillerType', type)}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      冷水机组总制冷量
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="请输入数值"
                        value={formData.chillerCapacity}
                        onChange={(e) => updateField('chillerCapacity', e.target.value)}
                      />
                      <select className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50">
                        <option>冷吨</option>
                        <option>kW</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      是否有热回收冷水机组
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="hasHeatRecoveryChiller"
                          checked={formData.hasHeatRecoveryChiller === true}
                          onChange={() => updateField('hasHeatRecoveryChiller', true)}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">有</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="hasHeatRecoveryChiller"
                          checked={formData.hasHeatRecoveryChiller === false}
                          onChange={() => updateField('hasHeatRecoveryChiller', false)}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">无</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 蒸汽锅炉卡片 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  2）蒸汽锅炉
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">蒸汽锅炉类型（多选）</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['卧式蒸汽锅炉', '立式蒸汽锅炉', '蒸汽发生器'].map((type) => (
                      <label key={type} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.steamBoilerType.includes(type)}
                          onChange={() => toggleArrayField('steamBoilerType', type)}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    蒸汽锅炉总蒸发量
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="请输入数值"
                      value={formData.steamBoilerCapacity}
                      onChange={(e) => updateField('steamBoilerCapacity', e.target.value)}
                    />
                    <span className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm">吨/小时</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 热水锅炉卡片 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  3）热水锅炉
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">热水锅炉类型（多选）</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['承压热水锅炉', '常压热水锅炉', '真空热水锅炉'].map((type) => (
                      <label key={type} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hotWaterBoilerType.includes(type)}
                          onChange={() => toggleArrayField('hotWaterBoilerType', type)}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    热水锅炉总制热量
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="请输入数值"
                      value={formData.hotWaterBoilerCapacity}
                      onChange={(e) => updateField('hotWaterBoilerCapacity', e.target.value)}
                    />
                    <span className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm">kW</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 空气压缩机卡片 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  4）空气压缩机
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      电机总功率
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="请输入数值"
                        value={formData.airCompressorPower}
                        onChange={(e) => updateField('airCompressorPower', e.target.value)}
                      />
                      <span className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm">kW</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      总产气能力
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="请输入数值"
                        value={formData.airCompressorCapacity}
                        onChange={(e) => updateField('airCompressorCapacity', e.target.value)}
                      />
                      <span className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm">m³/分钟</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 循环冷却水卡片 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  5）循环冷却水
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    冷却水循环量
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="请输入数值"
                      value={formData.coolingWaterFlow}
                      onChange={(e) => updateField('coolingWaterFlow', e.target.value)}
                    />
                    <span className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm">m³/小时</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 洁净厂房卡片 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  6）洁净厂房
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">是否有洁净厂房</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="hasCleanRoom"
                        checked={formData.hasCleanRoom === true}
                        onChange={() => updateField('hasCleanRoom', true)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">有</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="hasCleanRoom"
                        checked={formData.hasCleanRoom === false}
                        onChange={() => updateField('hasCleanRoom', false)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">无</span>
                    </label>
                  </div>
                </div>
                
                {formData.hasCleanRoom && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        洁净厂房面积
                      </label>
                      <div className="flex">
                        <input
                          type="number"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="请输入面积"
                          value={formData.cleanRoomArea}
                          onChange={(e) => updateField('cleanRoomArea', e.target.value)}
                        />
                        <span className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm">m²</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        空调系统有无预热、再热需求
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="hasPreheatReheat"
                            checked={formData.hasPreheatReheat === true}
                            onChange={() => updateField('hasPreheatReheat', true)}
                            className="text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">有</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="hasPreheatReheat"
                            checked={formData.hasPreheatReheat === false}
                            onChange={() => updateField('hasPreheatReheat', false)}
                            className="text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">无</span>
                        </label>
                      </div>
                    </div>
                    
                    {formData.hasPreheatReheat && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          是否采用冷水机组热回收
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="usesHeatRecovery"
                              checked={formData.usesHeatRecovery === true}
                              onChange={() => updateField('usesHeatRecovery', true)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">是</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="usesHeatRecovery"
                              checked={formData.usesHeatRecovery === false}
                              onChange={() => updateField('usesHeatRecovery', false)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">否</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-8">
            {/* 能耗基本情况标题 */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">能耗基本情况</h3>
              <p className="text-gray-600">请填写上一年度主要能耗系统的能耗量数据</p>
            </div>

            {/* 能耗数据表格卡片 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  上一年度主要能耗系统能耗量
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">系统/设备</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">能源类型</th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">年耗量</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">冷冻站（电制冷冷机）</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">电</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex">
                            <input
                              type="number"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="请输入数值"
                              value={formData.energyConsumption.chillerElectric}
                              onChange={(e) => updateEnergyConsumption('chillerElectric', e.target.value)}
                            />
                            <span className="ml-2 text-sm text-gray-500">kWh</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">冷冻站（溴化锂冷机）</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">天然气</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex">
                            <input
                              type="number"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="请输入数值"
                              value={formData.energyConsumption.chillerGas}
                              onChange={(e) => updateEnergyConsumption('chillerGas', e.target.value)}
                            />
                            <span className="ml-2 text-sm text-gray-500">m³</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">冷冻站（溴化锂冷机）</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">燃油</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex">
                            <input
                              type="number"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="请输入数值"
                              value={formData.energyConsumption.chillerOil}
                              onChange={(e) => updateEnergyConsumption('chillerOil', e.target.value)}
                            />
                            <span className="ml-2 text-sm text-gray-500">吨</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">锅炉房</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">天然气</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex">
                            <input
                              type="number"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="请输入数值"
                              value={formData.energyConsumption.boilerGas}
                              onChange={(e) => updateEnergyConsumption('boilerGas', e.target.value)}
                            />
                            <span className="ml-2 text-sm text-gray-500">m³</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">锅炉房</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">燃油</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex">
                            <input
                              type="number"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="请输入数值"
                              value={formData.energyConsumption.boilerOil}
                              onChange={(e) => updateEnergyConsumption('boilerOil', e.target.value)}
                            />
                            <span className="ml-2 text-sm text-gray-500">吨</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">蒸汽锅炉</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">天然气</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex">
                            <input
                              type="number"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="请输入数值"
                              value={formData.energyConsumption.steamBoilerGas}
                              onChange={(e) => updateEnergyConsumption('steamBoilerGas', e.target.value)}
                            />
                            <span className="ml-2 text-sm text-gray-500">m³</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">蒸汽锅炉</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">燃油</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex">
                            <input
                              type="number"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="请输入数值"
                              value={formData.energyConsumption.steamBoilerOil}
                              onChange={(e) => updateEnergyConsumption('steamBoilerOil', e.target.value)}
                            />
                            <span className="ml-2 text-sm text-gray-500">吨</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">热水锅炉</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">天然气</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex">
                            <input
                              type="number"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="请输入数值"
                              value={formData.energyConsumption.hotWaterBoilerGas}
                              onChange={(e) => updateEnergyConsumption('hotWaterBoilerGas', e.target.value)}
                            />
                            <span className="ml-2 text-sm text-gray-500">m³</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">热水锅炉</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">燃油</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex">
                            <input
                              type="number"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="请输入数值"
                              value={formData.energyConsumption.hotWaterBoilerOil}
                              onChange={(e) => updateEnergyConsumption('hotWaterBoilerOil', e.target.value)}
                            />
                            <span className="ml-2 text-sm text-gray-500">吨</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">冷却塔</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">电</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex">
                            <input
                              type="number"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="请输入数值"
                              value={formData.energyConsumption.coolingTowerElectric}
                              onChange={(e) => updateEnergyConsumption('coolingTowerElectric', e.target.value)}
                            />
                            <span className="ml-2 text-sm text-gray-500">kWh</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">气泵</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">电</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex">
                            <input
                              type="number"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="请输入数值"
                              value={formData.energyConsumption.pumpElectric}
                              onChange={(e) => updateEnergyConsumption('pumpElectric', e.target.value)}
                            />
                            <span className="ml-2 text-sm text-gray-500">kWh</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">空气压缩机</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">电</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex">
                            <input
                              type="number"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="请输入数值"
                              value={formData.energyConsumption.airCompressorElectric}
                              onChange={(e) => updateEnergyConsumption('airCompressorElectric', e.target.value)}
                            />
                            <span className="ml-2 text-sm text-gray-500">kWh</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
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
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">
              💡 点击下方步骤可快速跳转到对应内容
            </p>
          </div>
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className="flex items-center cursor-pointer hover:opacity-80 transition-all duration-200 rounded-lg p-2 -m-2 hover:bg-gray-50"
                  onClick={() => setCurrentStep(step.id)}
                  title={`点击跳转到：${step.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setCurrentStep(step.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`跳转到步骤 ${step.id}：${step.title}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    currentStep >= step.id 
                      ? 'bg-green-500 border-green-500 text-white shadow-md' 
                      : 'bg-white border-gray-300 text-gray-400 hover:border-green-300 hover:text-green-500'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      React.createElement(step.icon, { className: "w-5 h-5" })
                    )}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <div className={`text-sm font-medium transition-colors ${
                      currentStep >= step.id 
                        ? 'text-gray-900' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 transition-colors ${
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
