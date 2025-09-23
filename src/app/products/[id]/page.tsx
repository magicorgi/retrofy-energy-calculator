"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Download, 
  Star,
  Building,
  Zap,
  DollarSign,
  Thermometer,
  TrendingUp,
  FileText,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';
import { Product, ProductCase } from '@/types/product';
import Link from 'next/link';

// 模拟产品详情数据
const mockProduct: Product = {
  id: '1',
  brand: '格力',
  model: 'GMV-H180WL/A',
  cooling_capacity: 180,
  heating_capacity: 200,
  cop: 4.2,
  iplv: 5.8,
  price_min: 45000,
  price_max: 52000,
  price_unit: '元/kW',
  images: ['/images/gree-chiller-1.jpg', '/images/gree-chiller-2.jpg'],
  manual_url: 'https://example.com/manual1.pdf',
  contact_person: '张工程师',
  contact_phone: '138-0000-0001',
  contact_email: 'zhang@gree.com',
  company: '珠海格力电器股份有限公司',
  description: 'GMV-H180WL/A是格力新一代高效节能冷水机组，采用先进的变频控制技术，具有出色的节能性能和稳定的运行表现。适用于各类商业建筑、办公楼、酒店等场所的中央空调系统。',
  features: [
    '全直流变频技术，节能效果显著',
    '高效换热器设计，提升系统效率',
    '智能除霜功能，确保低温运行',
    '静音运行，噪音低于65dB(A)',
    '远程监控功能，便于管理维护',
    '环保制冷剂，符合环保要求'
  ],
  specifications: {
    '制冷剂': 'R410A',
    '电源': '380V/3Ph/50Hz',
    '噪音': '≤65dB(A)',
    '外形尺寸': '1800×800×2000mm',
    '重量': '1200kg',
    '工作温度': '-15°C ~ +45°C',
    '出水温度': '7°C',
    '回水温度': '12°C'
  },
  applicable_cities: ['北京', '上海', '广州', '深圳', '杭州', '南京'],
  category: 'chiller',
  energy_efficiency_grade: '一级',
  refrigerant_type: 'R410A',
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
  status: 'active',
  source: 'manual'
};

// 模拟关联案例数据
const mockCases: ProductCase[] = [
  {
    id: '1',
    product_id: '1',
    title: '北京某商业综合体节能改造项目',
    description: '该项目采用格力GMV-H180WL/A冷水机组，替换原有老旧设备，实现了显著的节能效果。',
    location: '北京市朝阳区',
    project_scale: '建筑面积: 50,000㎡',
    energy_savings: 35.2,
    investment_return: 4.2,
    images: ['/images/case1-1.jpg', '/images/case1-2.jpg'],
    created_at: '2024-01-10T00:00:00Z'
  },
  {
    id: '2',
    product_id: '1',
    title: '上海某办公楼中央空调系统升级',
    description: '办公楼中央空调系统全面升级，采用格力高效冷水机组，大幅降低运行成本。',
    location: '上海市浦东新区',
    project_scale: '建筑面积: 35,000㎡',
    energy_savings: 28.6,
    investment_return: 3.8,
    images: ['/images/case2-1.jpg'],
    created_at: '2024-01-05T00:00:00Z'
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [cases, setCases] = useState<ProductCase[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    // 这里应该根据ID从API获取产品详情
    setProduct(mockProduct);
    setCases(mockCases);
  }, [params.id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  const calculateEnergySavings = () => {
    const baselineCOP = 3.0;
    return ((product.cop - baselineCOP) / baselineCOP * 100);
  };

  const formatPrice = () => {
    if (product.price_min === product.price_max) {
      return `${product.price_min.toLocaleString()} ${product.price_unit}`;
    }
    return `${product.price_min.toLocaleString()} - ${product.price_max.toLocaleString()} ${product.price_unit}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link href="/products">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回产品列表
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 产品图片 */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Building className="w-16 h-16 text-gray-400" />
                </div>
                
                {/* 图片缩略图 */}
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded cursor-pointer ${
                        index === activeImageIndex ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <Building className="w-full h-full text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 产品信息 */}
          <div className="space-y-6">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{product.brand}</Badge>
                  {product.energy_efficiency_grade && (
                    <Badge variant="outline">{product.energy_efficiency_grade}级能效</Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{product.model}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 关键参数 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="text-xs text-gray-600">制冷量</div>
                      <div className="font-medium">{product.cooling_capacity} kW</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="text-xs text-gray-600">COP</div>
                      <div className="font-medium">{product.cop}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <div>
                      <div className="text-xs text-gray-600">IPLV</div>
                      <div className="font-medium">{product.iplv}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className="text-xs text-gray-600">价格</div>
                      <div className="font-medium text-sm">{formatPrice()}</div>
                    </div>
                  </div>
                </div>

                {/* 节能效果 */}
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">节能效果</span>
                    <span className="font-bold text-green-800">
                      +{calculateEnergySavings().toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => setIsContactModalOpen(true)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    联系厂商
                  </Button>
                  {product.manual_url && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={product.manual_url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        下载技术手册
                      </a>
                    </Button>
                  )}
                </div>

                {/* 联系信息 */}
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600 mb-2">联系信息</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{product.contact_person}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{product.contact_phone}</span>
                    </div>
                    {product.contact_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{product.contact_email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 适用城市 */}
            {product.applicable_cities && product.applicable_cities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5" />
                    适用城市
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.applicable_cities.map(city => (
                      <Badge key={city} variant="outline">
                        {city}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 详细信息标签页 */}
        <div className="mt-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">产品描述</TabsTrigger>
              <TabsTrigger value="specifications">技术规格</TabsTrigger>
              <TabsTrigger value="features">产品特点</TabsTrigger>
              <TabsTrigger value="cases">关联案例</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>产品描述</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>技术规格</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{key}</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>产品特点</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.features?.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cases" className="mt-6">
              <div className="space-y-4">
                {cases.map((caseItem) => (
                  <Card key={caseItem.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{caseItem.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
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
                      
                      <p className="text-gray-700 mb-4">{caseItem.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-green-50 rounded">
                          <div className="text-sm text-green-600 mb-1">节能效果</div>
                          <div className="font-bold text-green-800">+{caseItem.energy_savings}%</div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded">
                          <div className="text-sm text-blue-600 mb-1">投资回报期</div>
                          <div className="font-bold text-blue-800">{caseItem.investment_return}年</div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        查看案例详情
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 联系厂商模态框 */}
      {isContactModalOpen && (
        <ContactModal
          product={product}
          onClose={() => setIsContactModalOpen(false)}
        />
      )}
    </div>
  );
}

// 联系厂商模态框组件（复用产品列表页的组件）
interface ContactModalProps {
  product: Product;
  onClose: () => void;
}

function ContactModal({ product, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('提交联系记录:', { product_id: product.id, ...formData });
    alert('提交成功！我们会尽快与您联系。');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">联系厂商</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-600 mb-1">产品信息</div>
            <div className="font-medium">{product.brand} {product.model}</div>
            <div className="text-sm text-gray-600">
              联系人: {product.contact_person} | {product.contact_phone}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">公司名称</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                placeholder="请输入您的公司名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">联系人姓名 *</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.contact_name}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                placeholder="请输入您的姓名"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">联系电话 *</label>
              <input
                type="tel"
                className="w-full p-2 border rounded-md"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="请输入您的联系电话"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">邮箱地址</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="请输入您的邮箱地址"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">留言</label>
              <textarea
                className="w-full p-2 border rounded-md resize-none"
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="请描述您的需求..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                取消
              </Button>
              <Button type="submit" className="flex-1">
                提交申请
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}




