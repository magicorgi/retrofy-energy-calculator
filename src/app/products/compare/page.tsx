"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  X,
  Building,
  Zap,
  DollarSign,
  Thermometer,
  TrendingUp,
  Star,
  Phone,
  Trash2
} from 'lucide-react';
import { Product } from '@/types/product';
import Link from 'next/link';

// 模拟产品数据（与产品列表页保持一致）
const mockProducts: Product[] = [
  {
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
    images: ['/images/gree-chiller.jpg'],
    manual_url: 'https://example.com/manual1.pdf',
    contact_person: '张工程师',
    contact_phone: '138-0000-0001',
    contact_email: 'zhang@gree.com',
    company: '珠海格力电器股份有限公司',
    description: '高效节能冷水机组，适用于商业建筑',
    features: ['变频控制', '高效换热器', '智能除霜'],
    specifications: {
      '制冷剂': 'R410A',
      '电源': '380V/3Ph/50Hz',
      '噪音': '≤65dB(A)'
    },
    applicable_cities: ['北京', '上海', '广州', '深圳'],
    category: 'chiller',
    energy_efficiency_grade: '一级',
    refrigerant_type: 'R410A',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    status: 'active',
    source: 'manual'
  },
  {
    id: '2',
    brand: '美的',
    model: 'MDV-H140WL/A',
    cooling_capacity: 140,
    heating_capacity: 160,
    cop: 4.5,
    iplv: 6.2,
    price_min: 38000,
    price_max: 45000,
    price_unit: '元/kW',
    images: ['/images/midea-chiller.jpg'],
    manual_url: 'https://example.com/manual2.pdf',
    contact_person: '李经理',
    contact_phone: '138-0000-0002',
    contact_email: 'li@midea.com',
    company: '美的集团股份有限公司',
    description: '全直流变频多联机，节能环保',
    features: ['全直流变频', '环保制冷剂', '静音运行'],
    specifications: {
      '制冷剂': 'R32',
      '电源': '380V/3Ph/50Hz',
      '噪音': '≤60dB(A)'
    },
    applicable_cities: ['北京', '上海', '杭州', '南京'],
    category: 'chiller',
    energy_efficiency_grade: '一级',
    refrigerant_type: 'R32',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    status: 'active',
    source: 'api'
  },
  {
    id: '3',
    brand: '海尔',
    model: 'Haier-HP200',
    cooling_capacity: 200,
    heating_capacity: 220,
    cop: 4.8,
    iplv: 6.5,
    price_min: 55000,
    price_max: 62000,
    price_unit: '元/kW',
    images: ['/images/haier-heatpump.jpg'],
    manual_url: 'https://example.com/manual3.pdf',
    contact_person: '王工程师',
    contact_phone: '138-0000-0003',
    contact_email: 'wang@haier.com',
    company: '青岛海尔空调电子有限公司',
    description: '高温热泵机组，适用于工业应用',
    features: ['高温出水', '工业级设计', '远程监控'],
    specifications: {
      '制冷剂': 'R134a',
      '电源': '380V/3Ph/50Hz',
      '出水温度': '85°C'
    },
    applicable_cities: ['北京', '天津', '济南', '青岛'],
    category: 'heat_pump',
    energy_efficiency_grade: '一级',
    refrigerant_type: 'R134a',
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z',
    status: 'active',
    source: 'excel'
  }
];

function ProductCompareContent() {
  const searchParams = useSearchParams();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactProduct, setContactProduct] = useState<Product | null>(null);

  useEffect(() => {
    // 从URL参数获取要对比的产品ID
    const productIds = searchParams.get('ids')?.split(',') || [];
    const products = mockProducts.filter(p => productIds.includes(p.id));
    setSelectedProducts(products);
  }, [searchParams]);

  const calculateEnergySavings = (product: Product) => {
    const baselineCOP = 3.0;
    return ((product.cop - baselineCOP) / baselineCOP * 100);
  };

  const formatPrice = (product: Product) => {
    if (product.price_min === product.price_max) {
      return `${product.price_min.toLocaleString()} ${product.price_unit}`;
    }
    return `${product.price_min.toLocaleString()} - ${product.price_max.toLocaleString()} ${product.price_unit}`;
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleContact = (product: Product) => {
    setContactProduct(product);
    setIsContactModalOpen(true);
  };

  if (selectedProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Building className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有选择要对比的产品</h3>
            <p className="text-gray-600 mb-6">请返回产品列表选择产品进行对比</p>
            <Link href="/products">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回产品列表
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题和操作 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">产品对比</h1>
            <p className="text-gray-600">对比 {selectedProducts.length} 个产品</p>
          </div>
          <Link href="/products">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回产品列表
            </Button>
          </Link>
        </div>

        {/* 对比表格 */}
        <div className="overflow-x-auto">
          <div className="min-w-full bg-white rounded-lg shadow-sm border">
            {/* 表头 */}
            <div className="grid grid-cols-4 gap-0 border-b">
              <div className="p-4 bg-gray-50 font-medium text-gray-900">对比项目</div>
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-4 border-l relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 p-1 h-6 w-6"
                    onClick={() => removeProduct(product.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  
                  {/* 产品图片 */}
                  <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center">
                    <Building className="w-8 h-8 text-gray-400" />
                  </div>
                  
                  {/* 产品信息 */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {product.brand}
                      </Badge>
                      {product.energy_efficiency_grade && (
                        <Badge variant="outline" className="text-xs">
                          {product.energy_efficiency_grade}级
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-2">{product.model}</h3>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                        onClick={() => handleContact(product)}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        联系厂商
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                        asChild
                      >
                        <Link href={`/products/${product.id}`}>
                          查看详情
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 基本信息对比 */}
            <div className="grid grid-cols-4 gap-0 border-b">
              <div className="p-4 bg-gray-50 font-medium text-gray-900">品牌厂商</div>
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-4 border-l">
                  <div className="font-medium">{product.brand}</div>
                  <div className="text-sm text-gray-600">{product.company}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-0 border-b">
              <div className="p-4 bg-gray-50 font-medium text-gray-900">产品类别</div>
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-4 border-l">
                  <Badge variant="outline">{product.category}</Badge>
                </div>
              ))}
            </div>

            {/* 技术参数对比 */}
            <div className="grid grid-cols-4 gap-0 border-b">
              <div className="p-4 bg-gray-50 font-medium text-gray-900 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-blue-500" />
                制冷量 (kW)
              </div>
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-4 border-l">
                  <div className="font-medium">{product.cooling_capacity}</div>
                  {product.heating_capacity && (
                    <div className="text-sm text-gray-600">制热: {product.heating_capacity} kW</div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-0 border-b">
              <div className="p-4 bg-gray-50 font-medium text-gray-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                COP
              </div>
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-4 border-l">
                  <div className="font-medium">{product.cop}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-0 border-b">
              <div className="p-4 bg-gray-50 font-medium text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                IPLV
              </div>
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-4 border-l">
                  <div className="font-medium">{product.iplv}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-0 border-b">
              <div className="p-4 bg-gray-50 font-medium text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                节能效果
              </div>
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-4 border-l">
                  <div className="font-medium text-green-600">
                    +{calculateEnergySavings(product).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>

            {/* 价格对比 */}
            <div className="grid grid-cols-4 gap-0 border-b">
              <div className="p-4 bg-gray-50 font-medium text-gray-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-500" />
                价格区间
              </div>
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-4 border-l">
                  <div className="font-medium">{formatPrice(product)}</div>
                </div>
              ))}
            </div>

            {/* 制冷剂类型 */}
            <div className="grid grid-cols-4 gap-0 border-b">
              <div className="p-4 bg-gray-50 font-medium text-gray-900">制冷剂</div>
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-4 border-l">
                  <div>{product.refrigerant_type || '-'}</div>
                </div>
              ))}
            </div>

            {/* 适用城市 */}
            <div className="grid grid-cols-4 gap-0 border-b">
              <div className="p-4 bg-gray-50 font-medium text-gray-900">适用城市</div>
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-4 border-l">
                  <div className="flex flex-wrap gap-1">
                    {product.applicable_cities?.slice(0, 3).map(city => (
                      <Badge key={city} variant="outline" className="text-xs">
                        {city}
                      </Badge>
                    ))}
                    {product.applicable_cities && product.applicable_cities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{product.applicable_cities.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 产品特点 */}
            <div className="grid grid-cols-4 gap-0">
              <div className="p-4 bg-gray-50 font-medium text-gray-900">产品特点</div>
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-4 border-l">
                  <ul className="space-y-1">
                    {product.features?.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start gap-1 text-sm">
                        <Star className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {product.features && product.features.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{product.features.length - 3} 个特点
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 推荐总结 */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>对比总结与建议</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">最高COP</h4>
                  <div className="text-2xl font-bold text-blue-800">
                    {Math.max(...selectedProducts.map(p => p.cop))}
                  </div>
                  <div className="text-sm text-blue-600">
                    {selectedProducts.find(p => p.cop === Math.max(...selectedProducts.map(p => p.cop)))?.brand} 
                    {selectedProducts.find(p => p.cop === Math.max(...selectedProducts.map(p => p.cop)))?.model}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">最佳节能</h4>
                  <div className="text-2xl font-bold text-green-800">
                    +{Math.max(...selectedProducts.map(p => calculateEnergySavings(p))).toFixed(1)}%
                  </div>
                  <div className="text-sm text-green-600">
                    {selectedProducts.find(p => calculateEnergySavings(p) === Math.max(...selectedProducts.map(p => calculateEnergySavings(p))))?.brand} 
                    {selectedProducts.find(p => calculateEnergySavings(p) === Math.max(...selectedProducts.map(p => calculateEnergySavings(p))))?.model}
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">最低价格</h4>
                  <div className="text-2xl font-bold text-purple-800">
                    {Math.min(...selectedProducts.map(p => p.price_min)).toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-600">
                    {selectedProducts.find(p => p.price_min === Math.min(...selectedProducts.map(p => p.price_min)))?.brand} 
                    {selectedProducts.find(p => p.price_min === Math.min(...selectedProducts.map(p => p.price_min)))?.model}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 联系厂商模态框 */}
      {isContactModalOpen && contactProduct && (
        <ContactModal
          product={contactProduct}
          onClose={() => {
            setIsContactModalOpen(false);
            setContactProduct(null);
          }}
        />
      )}
    </div>
  );
}

// 联系厂商模态框组件
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

export default function ProductComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    }>
      <ProductCompareContent />
    </Suspense>
  );
}


