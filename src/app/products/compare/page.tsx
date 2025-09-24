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
// 丹佛斯产品数据 - 与主产品页面保持一致
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'VLT® Flow Drive FC 111 变频器',
    brand: '丹佛斯',
    model: 'FC 111',
    power_range: '0.75-630kW',
    applicable_industries: ['food_beverage', 'electronics', 'commercial_building'],
    images: ['/images/danfoss-fc111.jpg'],
    contact_region: 'east',
    contact_person: '张经理',
    contact_phone: '400-890-8986',
    contact_email: 'china.drives@danfoss.com',
    company: '丹佛斯（中国）有限公司',
    category: 'frequency_converter',
    energy_efficiency_grade: '一级',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    status: 'active',
    source: 'manual'
  },
  {
    id: '2',
    name: 'Performer® HHP 涡旋压缩机',
    brand: '丹佛斯',
    model: 'HHP',
    power_range: '5-240kW',
    applicable_industries: ['residential', 'commercial_building', 'hospital'],
    images: ['/images/danfoss-performer-hhp.jpg'],
    contact_region: 'north',
    contact_person: '李经理',
    contact_phone: '400-890-8986',
    contact_email: 'china.compressors@danfoss.com',
    company: '丹佛斯（中国）有限公司',
    category: 'compressor',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    status: 'active',
    source: 'api'
  },
  {
    id: '3',
    name: 'H系列微板换热器 MPHE',
    brand: '丹佛斯',
    model: 'MPHE',
    power_range: '50-500kW',
    applicable_industries: ['commercial_building', 'hospital', 'school'],
    images: ['/images/danfoss-mphe.jpg'],
    contact_region: 'south',
    contact_person: '王经理',
    contact_phone: '400-890-8986',
    contact_email: 'china.heatexchangers@danfoss.com',
    company: '丹佛斯（中国）有限公司',
    category: 'heat_exchanger',
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
    // 根据产品类别返回不同的节能效果
    const savingsMap = {
      'frequency_converter': 25,
      'compressor': 30,
      'heat_exchanger': 20,
      'hydraulic_valve': 15,
      'sensor': 10,
      'control_system': 18,
      'expansion_valve': 12,
      'filter_drier': 8,
      'other': 5
    };
    return savingsMap[product.category] || 5;
  };

  const getIndustryLabel = (industry: string) => {
    const industryMap = {
      'food_beverage': '食品饮料',
      'electronics': '电子半导体',
      'pharmaceutical': '制药生物制品',
      'tobacco': '烟草',
      'metallurgy': '金属冶炼/金属加工',
      'chemical': '化工',
      'automotive': '汽车工业',
      'machinery': '机械加工',
      'commercial_building': '商业建筑',
      'residential': '住宅',
      'hospital': '医院',
      'school': '学校',
      'other': '其他'
    };
    return industryMap[industry as keyof typeof industryMap] || industry;
  };

  const getRegionLabel = (region: string) => {
    const regionMap = {
      'north': '华北',
      'east': '华东',
      'south': '华南',
      'central': '华中',
      'southwest': '西南',
      'northeast': '东北',
      'northwest': '西北'
    };
    return regionMap[region as keyof typeof regionMap] || region;
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
                功率范围
              </div>
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-4 border-l">
                  <div className="font-medium">{product.power_range}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-0 border-b">
              <div className="p-4 bg-gray-50 font-medium text-gray-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                联系区域
              </div>
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-4 border-l">
                  <div className="font-medium">{getRegionLabel(product.contact_region)}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-0 border-b">
              <div className="p-4 bg-gray-50 font-medium text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                联系人
              </div>
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-4 border-l">
                  <div className="font-medium">{product.contact_person}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-0 border-b">
              <div className="p-4 bg-gray-50 font-medium text-gray-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-green-500" />
                适用行业
              </div>
              {selectedProducts.map((product) => (
                <div key={product.id} className="p-4 border-l">
                  <div className="space-y-1">
                    {product.applicable_industries.slice(0, 2).map(industry => (
                      <Badge key={industry} variant="outline" className="text-xs mr-1">
                        {getIndustryLabel(industry)}
                      </Badge>
                    ))}
                    {product.applicable_industries.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{product.applicable_industries.length - 2}
                      </Badge>
                    )}
                  </div>
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


