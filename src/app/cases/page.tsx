"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  MapPin,
  Building,
  Calendar,
  TrendingUp,
  DollarSign,
  Eye,
  Star,
  Thermometer,
  Zap,
  Users
} from 'lucide-react';
import { ProductCase, Product } from '@/types/product';
import Link from 'next/link';

// 丹佛斯产品应用案例数据
const mockCases: ProductCase[] = [
  {
    id: '1',
    product_id: '1',
    title: '北京某商业综合体变频器节能改造项目',
    description: '该项目采用丹佛斯VLT® Flow Drive FC 111变频器，对商业综合体的风机和水泵系统进行全面改造。通过智能变频控制，实现了显著的节能效果。项目涵盖商场、写字楼、酒店等多个业态，总建筑面积约50,000㎡。改造后年节约电费超过180万元，投资回报期约3.8年。',
    location: '北京市朝阳区',
    project_scale: '建筑面积: 50,000㎡',
    energy_savings: 38.5,
    investment_return: 3.8,
    images: ['/images/danfoss-case1-1.jpg', '/images/danfoss-case1-2.jpg'],
    created_at: '2024-01-10T00:00:00Z'
  },
  {
    id: '2',
    product_id: '2',
    title: '上海某办公楼热泵压缩机系统升级',
    description: '办公楼热泵系统全面升级，采用丹佛斯Performer® HHP涡旋压缩机，大幅提升系统效率和可靠性。项目包括3栋办公楼，总建筑面积35,000㎡，改造后系统运行更加稳定，即使在上海冬季低温环境下也能高效运行。',
    location: '上海市浦东新区',
    project_scale: '建筑面积: 35,000㎡',
    energy_savings: 32.1,
    investment_return: 3.5,
    images: ['/images/danfoss-case2-1.jpg'],
    created_at: '2024-01-05T00:00:00Z'
  },
  {
    id: '3',
    product_id: '3',
    title: '青岛某工业园区换热器优化案例',
    description: '工业园区采用丹佛斯H系列微板换热器MPHE，为生产工艺提供高效换热解决方案，替代原有低效换热设备。项目年节约能源费用约120万元，减少CO₂排放约600吨，换热效率提升15%，环保效益显著。',
    location: '青岛市黄岛区',
    project_scale: '工业园区: 100,000㎡',
    energy_savings: 25.8,
    investment_return: 3.2,
    images: ['/images/danfoss-case3-1.jpg', '/images/danfoss-case3-2.jpg'],
    created_at: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    product_id: '4',
    title: '广州某医院水力平衡系统改造',
    description: '三甲医院供暖制冷系统水力平衡改造项目，采用丹佛斯AB-QM自力式流量平衡阀，确保各区域温度均匀，在保证医疗环境舒适度的同时，大幅降低能耗。项目涉及门诊楼、住院楼、医技楼等多个建筑，总建筑面积80,000㎡。',
    location: '广州市天河区',
    project_scale: '建筑面积: 80,000㎡',
    energy_savings: 22.3,
    investment_return: 2.8,
    images: ['/images/danfoss-case4-1.jpg'],
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    product_id: '5',
    title: '杭州某酒店智能控制系统升级',
    description: '五星级酒店采用丹佛斯MBS 3000压力传感器和ECL Comfort 310控制器，实现精确的压力监测和智能控制，提升客房舒适度，降低运营成本。项目包括主楼、裙楼、会议中心等，总建筑面积45,000㎡。',
    location: '杭州市西湖区',
    project_scale: '建筑面积: 45,000㎡',
    energy_savings: 28.9,
    investment_return: 3.6,
    images: ['/images/danfoss-case5-1.jpg', '/images/danfoss-case5-2.jpg'],
    created_at: '2023-12-28T00:00:00Z'
  },
  {
    id: '6',
    product_id: '1',
    title: '深圳某数据中心变频器节能项目',
    description: '大型数据中心采用丹佛斯VLT® Flow Drive FC 111变频器，对冷却系统的风机和水泵进行变频改造。通过精确的转速控制和火灾越控模式，确保数据中心安全运行的同时实现显著节能。项目年节约电费超过300万元。',
    location: '深圳市南山区',
    project_scale: '数据中心: 25,000㎡',
    energy_savings: 45.2,
    investment_return: 2.9,
    images: ['/images/danfoss-case6-1.jpg'],
    created_at: '2023-12-25T00:00:00Z'
  }
];

// 丹佛斯产品数据（用于关联显示）
const mockProducts: Product[] = [
  {
    id: '1',
    brand: '丹佛斯',
    model: 'VLT® Flow Drive FC 111',
    company: '丹佛斯（中国）有限公司',
    category: 'frequency_converter'
  } as Product,
  {
    id: '2',
    brand: '丹佛斯',
    model: 'Performer® HHP 涡旋压缩机',
    company: '丹佛斯（中国）有限公司',
    category: 'compressor'
  } as Product,
  {
    id: '3',
    brand: '丹佛斯',
    model: 'H系列微板换热器 MPHE',
    company: '丹佛斯（中国）有限公司',
    category: 'heat_exchanger'
  } as Product,
  {
    id: '4',
    brand: '丹佛斯',
    model: 'AB-QM 自力式流量平衡阀',
    company: '丹佛斯（中国）有限公司',
    category: 'hydraulic_valve'
  } as Product,
  {
    id: '5',
    brand: '丹佛斯',
    model: 'MBS 3000 压力传感器',
    company: '丹佛斯（中国）有限公司',
    category: 'sensor'
  } as Product,
  {
    id: '6',
    brand: '丹佛斯',
    model: 'ECL Comfort 310 控制器',
    company: '丹佛斯（中国）有限公司',
    category: 'control_system'
  } as Product
];

const cities = [
  '北京', '上海', '广州', '深圳', '杭州', '南京', '苏州', '成都',
  '武汉', '西安', '天津', '重庆', '青岛', '大连', '厦门', '宁波'
];

const projectTypes = [
  '商业综合体', '办公楼', '酒店', '医院', '学校', '工业厂房', '数据中心', '其他'
];

export default function CasesPage() {
  const [cases, setCases] = useState<ProductCase[]>(mockCases);
  const [filteredCases, setFilteredCases] = useState<ProductCase[]>(mockCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    product_id: '',
    project_type: '',
    energy_savings_min: '',
    investment_return_max: ''
  });
  const [sortBy, setSortBy] = useState<'created_at' | 'energy_savings' | 'investment_return'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 获取产品信息
  const getProductInfo = (productId: string) => {
    return mockProducts.find(p => p.id === productId);
  };

  // 应用筛选和排序
  useEffect(() => {
    let filtered = [...cases];

    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(caseItem => 
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 城市筛选
    if (filters.city) {
      filtered = filtered.filter(caseItem => 
        caseItem.location.includes(filters.city)
      );
    }

    // 产品筛选
    if (filters.product_id) {
      filtered = filtered.filter(caseItem => caseItem.product_id === filters.product_id);
    }

    // 项目类型筛选
    if (filters.project_type) {
      filtered = filtered.filter(caseItem => 
        caseItem.title.includes(filters.project_type) || 
        caseItem.description.includes(filters.project_type)
      );
    }

    // 节能效果筛选
    if (filters.energy_savings_min) {
      filtered = filtered.filter(caseItem => 
        caseItem.energy_savings >= parseFloat(filters.energy_savings_min)
      );
    }

    // 投资回报期筛选
    if (filters.investment_return_max) {
      filtered = filtered.filter(caseItem => 
        caseItem.investment_return <= parseFloat(filters.investment_return_max)
      );
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'energy_savings':
          aValue = a.energy_savings;
          bValue = b.energy_savings;
          break;
        case 'investment_return':
          aValue = a.investment_return;
          bValue = b.investment_return;
          break;
        default:
          return 0;
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredCases(filtered);
  }, [cases, filters, sortBy, sortOrder, searchTerm]);

  const getEnergySavingsColor = (savings: number) => {
    if (savings >= 40) return 'text-green-600 bg-green-100';
    if (savings >= 30) return 'text-blue-600 bg-blue-100';
    if (savings >= 20) return 'text-orange-600 bg-orange-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getInvestmentReturnColor = (years: number) => {
    if (years <= 3) return 'text-green-600 bg-green-100';
    if (years <= 4) return 'text-blue-600 bg-blue-100';
    if (years <= 5) return 'text-orange-600 bg-orange-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">案例库</h1>
          <p className="text-gray-600">真实项目案例，为您提供参考和借鉴</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 筛选侧边栏 */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  筛选条件
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 搜索 */}
                <div>
                  <Label>搜索案例</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="项目名称、描述、地点..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* 城市筛选 */}
                <div>
                  <Label>项目城市</Label>
                  <Select value={filters.city || 'all'} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, city: value === 'all' ? '' : value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="选择城市" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部城市</SelectItem>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 产品筛选 */}
                <div>
                  <Label>应用产品</Label>
                  <Select value={filters.product_id || 'all'} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, product_id: value === 'all' ? '' : value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="选择产品" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部产品</SelectItem>
                      {mockProducts.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.brand} {product.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 项目类型筛选 */}
                <div>
                  <Label>项目类型</Label>
                  <Select value={filters.project_type || 'all'} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, project_type: value === 'all' ? '' : value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      {projectTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 节能效果筛选 */}
                <div>
                  <Label>最低节能效果 (%)</Label>
                  <Input
                    type="number"
                    placeholder="20"
                    value={filters.energy_savings_min}
                    onChange={(e) => setFilters(prev => ({ ...prev, energy_savings_min: e.target.value }))}
                  />
                </div>

                {/* 投资回报期筛选 */}
                <div>
                  <Label>最长回报期 (年)</Label>
                  <Input
                    type="number"
                    placeholder="5"
                    value={filters.investment_return_max}
                    onChange={(e) => setFilters(prev => ({ ...prev, investment_return_max: e.target.value }))}
                  />
                </div>

                {/* 重置筛选 */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setFilters({
                      city: '',
                      product_id: '',
                      project_type: '',
                      energy_savings_min: '',
                      investment_return_max: ''
                    });
                    setSearchTerm('');
                  }}
                >
                  重置筛选
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 案例列表 */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* 排序工具栏 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  共找到 {filteredCases.length} 个案例
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* 排序 */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm">排序:</Label>
                  <Select 
                    value={`${sortBy}-${sortOrder}`} 
                    onValueChange={(value) => {
                      const [field, order] = value.split('-');
                      setSortBy(field as any);
                      setSortOrder(order as any);
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at-desc">最新发布 ↓</SelectItem>
                      <SelectItem value="created_at-asc">最新发布 ↑</SelectItem>
                      <SelectItem value="energy_savings-desc">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          节能效果 ↓
                        </div>
                      </SelectItem>
                      <SelectItem value="energy_savings-asc">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          节能效果 ↑
                        </div>
                      </SelectItem>
                      <SelectItem value="investment_return-asc">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          回报期 ↑
                        </div>
                      </SelectItem>
                      <SelectItem value="investment_return-desc">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          回报期 ↓
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 案例网格 */}
            <div className="space-y-6">
              {filteredCases.map((caseItem) => {
                const product = getProductInfo(caseItem.product_id);
                return (
                  <Card key={caseItem.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 案例图片 */}
                        <div className="lg:col-span-1">
                          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                            <Building className="w-12 h-12 text-gray-400" />
                          </div>
                          
                          {/* 关键指标 */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className={`p-3 rounded-lg text-center ${getEnergySavingsColor(caseItem.energy_savings)}`}>
                              <div className="text-lg font-bold">+{caseItem.energy_savings}%</div>
                              <div className="text-xs">节能效果</div>
                            </div>
                            <div className={`p-3 rounded-lg text-center ${getInvestmentReturnColor(caseItem.investment_return)}`}>
                              <div className="text-lg font-bold">{caseItem.investment_return}年</div>
                              <div className="text-xs">投资回报</div>
                            </div>
                          </div>
                        </div>

                        {/* 案例信息 */}
                        <div className="lg:col-span-2">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-xl font-semibold mb-2">{caseItem.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {caseItem.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Building className="w-4 h-4" />
                                  {caseItem.project_scale}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(caseItem.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4 leading-relaxed">{caseItem.description}</p>

                          {/* 应用产品信息 */}
                          {product && (
                            <div className="p-3 bg-blue-50 rounded-lg mb-4">
                              <div className="flex items-center gap-2 mb-1">
                                <Zap className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-900">应用产品</span>
                              </div>
                              <div className="text-blue-800">
                                <div className="font-medium">{product.brand} {product.model}</div>
                                <div className="text-sm">{product.company}</div>
                              </div>
                            </div>
                          )}

                          {/* 操作按钮 */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              查看详情
                            </Button>
                            {product && (
                              <Button size="sm" asChild>
                                <Link href={`/products/${product.id}`}>
                                  <Thermometer className="w-4 h-4 mr-2" />
                                  查看产品
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredCases.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Building className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无匹配案例</h3>
                <p className="text-gray-600">请调整筛选条件重新搜索</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}