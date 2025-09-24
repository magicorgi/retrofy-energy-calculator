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
  TrendingUp,
  FileText,
  MapPin,
  Calendar,
  Users,
  Package,
  Globe,
  ChevronDown
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/types/product';
import Link from 'next/link';

// 区域联系人配置
const regionContacts = {
  north: { name: '张经理', phone: '010-12345678', email: 'north@danfoss.com.cn' },
  east: { name: '李经理', phone: '021-12345678', email: 'east@danfoss.com.cn' },
  south: { name: '王经理', phone: '020-12345678', email: 'south@danfoss.com.cn' },
  central: { name: '刘经理', phone: '027-12345678', email: 'central@danfoss.com.cn' },
  southwest: { name: '陈经理', phone: '028-12345678', email: 'southwest@danfoss.com.cn' },
  northeast: { name: '赵经理', phone: '024-12345678', email: 'northeast@danfoss.com.cn' },
  northwest: { name: '孙经理', phone: '029-12345678', email: 'northwest@danfoss.com.cn' }
};

const regions = [
  { value: 'north', label: '华北' },
  { value: 'east', label: '华东' },
  { value: 'south', label: '华南' },
  { value: 'central', label: '华中' },
  { value: 'southwest', label: '西南' },
  { value: 'northeast', label: '东北' },
  { value: 'northwest', label: '西北' }
];

const industries = [
  { value: 'food_beverage', label: '食品饮料' },
  { value: 'electronics', label: '电子半导体' },
  { value: 'pharmaceutical', label: '制药生物制品' },
  { value: 'tobacco', label: '烟草' },
  { value: 'metallurgy', label: '金属冶炼/金属加工' },
  { value: 'chemical', label: '化工' },
  { value: 'automotive', label: '汽车工业' },
  { value: 'machinery', label: '机械加工' },
  { value: 'commercial_building', label: '商业建筑' },
  { value: 'residential', label: '住宅' },
  { value: 'hospital', label: '医院' },
  { value: 'school', label: '学校' },
  { value: 'other', label: '其他' }
];

const categories = [
  { value: 'compressor', label: '压缩机' },
  { value: 'frequency_converter', label: '变频器' },
  { value: 'heat_exchanger', label: '换热器' },
  { value: 'hydraulic_valve', label: '水力平衡阀' },
  { value: 'sensor', label: '传感器' },
  { value: 'control_system', label: '控制系统' },
  { value: 'expansion_valve', label: '膨胀阀' },
  { value: 'filter_drier', label: '过滤器干燥器' },
  { value: 'other', label: '其他' }
];

// 模拟产品详情数据（使用新的数据结构）
const mockProduct: Product = {
  id: '1',
  name: 'VLT® Flow Drive FC 111 变频器',
  brand: '丹佛斯',
  model: 'FC 111',
  power_range: '0.75-630kW',
  applicable_industries: ['food_beverage', 'electronics', 'commercial_building'],
  images: ['/images/danfoss-fc111.jpg'],
  contact_region: 'east',
  contact_person: regionContacts.east.name,
  contact_phone: regionContacts.east.phone,
  contact_email: regionContacts.east.email,
  company: '丹佛斯（中国）有限公司',
  category: 'frequency_converter',
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
  status: 'active',
  source: 'manual'
};

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  useEffect(() => {
    if (product) {
      setSelectedRegion(product.contact_region);
    }
  }, [product]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      // 从管理员管理的产品数据中查找
      const adminProducts = localStorage.getItem('adminProducts');
      if (adminProducts) {
        const parsedProducts = JSON.parse(adminProducts);
        const foundProduct = parsedProducts.find((p: Product) => p.id === params.id);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setProduct(mockProduct);
        }
      } else {
        setProduct(mockProduct);
      }
    } catch (error) {
      console.error('加载产品详情失败:', error);
      setProduct(mockProduct);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEnergySavings = (product: Product) => {
    // 根据产品类别返回不同的节能效果
    const savingsMap = {
      'frequency_converter': 25,
      'compressor': 30,
      'heat_exchanger': 20,
      'hydraulic_valve': 15,
      'sensor': 10,
      'control_system': 35,
      'expansion_valve': 18,
      'filter_drier': 12,
      'other': 20
    };
    return savingsMap[product.category] || 20;
  };

  const getRegionLabel = (region: string) => {
    return regions.find(r => r.value === region)?.label || region;
  };

  const getIndustryLabel = (industry: string) => {
    return industries.find(i => i.value === industry)?.label || industry;
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  const getCurrentContactInfo = () => {
    return regionContacts[selectedRegion as keyof typeof regionContacts] || regionContacts.east;
  };

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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">产品未找到</h2>
          <p className="text-gray-600 mb-4">抱歉，您访问的产品不存在或已被删除。</p>
          <Link href="/products">
            <Button>返回产品列表</Button>
          </Link>
        </div>
      </div>
    );
  }

  const energySavings = calculateEnergySavings(product);

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
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
                
                {/* 图片缩略图 */}
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded cursor-pointer ${
                        index === activeImageIndex ? 'ring-2 ring-green-500' : ''
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <Package className="w-full h-full text-gray-400" />
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
                  <Badge variant="outline">{getCategoryLabel(product.category)}</Badge>
                </div>
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <p className="text-sm text-gray-600">{product.model}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 关键参数 */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="text-xs text-gray-600">功率范围</div>
                      <div className="font-medium">{product.power_range}</div>
                    </div>
                  </div>
                  
                  {/* 联系区域选择 */}
                  <div>
                    <div className="text-xs text-gray-600 mb-2">联系区域</div>
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择联系区域" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map(region => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 节能效果 */}
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">节能效果</span>
                    <span className="font-bold text-green-800">
                      +{energySavings}%
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
                </div>

                {/* 联系信息 */}
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600 mb-2">联系信息</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{getCurrentContactInfo().name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{getCurrentContactInfo().phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{getCurrentContactInfo().email}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 适用行业 */}
            {product.applicable_industries && product.applicable_industries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building className="w-5 h-5" />
                    适用行业
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.applicable_industries.map(industry => (
                      <Badge key={industry} variant="outline">
                        {getIndustryLabel(industry)}
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">产品描述</TabsTrigger>
              <TabsTrigger value="specifications">技术规格</TabsTrigger>
              <TabsTrigger value="features">产品特点</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>产品描述</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">产品名称</h4>
                      <p className="text-gray-700">{product.name}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">品牌</h4>
                      <p className="text-gray-700">{product.brand}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">型号</h4>
                      <p className="text-gray-700">{product.model}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">功率范围</h4>
                      <p className="text-gray-700">{product.power_range}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">产品类别</h4>
                      <p className="text-gray-700">{getCategoryLabel(product.category)}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">公司信息</h4>
                      <p className="text-gray-700">{product.company}</p>
                    </div>
                  </div>
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
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">产品名称</span>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">品牌</span>
                      <span className="font-medium">{product.brand}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">型号</span>
                      <span className="font-medium">{product.model}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">功率范围</span>
                      <span className="font-medium">{product.power_range}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">产品类别</span>
                      <span className="font-medium">{getCategoryLabel(product.category)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">状态</span>
                      <span className="font-medium">{product.status === 'active' ? '活跃' : '非活跃'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">数据来源</span>
                      <span className="font-medium">{product.source === 'manual' ? '手动录入' : 'API导入'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">更新时间</span>
                      <span className="font-medium">{new Date(product.updated_at).toLocaleDateString()}</span>
                    </div>
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
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">节能效果显著，可节省{energySavings}%的能源消耗</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">适用于{product.applicable_industries.map(getIndustryLabel).join('、')}等行业</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">功率范围：{product.power_range}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">专业的区域技术支持服务</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">丹佛斯品牌保障，质量可靠</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 联系厂商模态框 */}
      {isContactModalOpen && (
        <ContactModal
          product={product}
          selectedRegion={selectedRegion}
          contactInfo={getCurrentContactInfo()}
          onClose={() => setIsContactModalOpen(false)}
        />
      )}
    </div>
  );
}

// 联系厂商模态框组件
interface ContactModalProps {
  product: Product;
  selectedRegion: string;
  contactInfo: { name: string; phone: string; email: string };
  onClose: () => void;
}

function ContactModal({ product, selectedRegion, contactInfo, onClose }: ContactModalProps) {
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
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-gray-600">
              联系区域: {regions.find(r => r.value === selectedRegion)?.label} | 联系人: {contactInfo.name} | {contactInfo.phone}
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