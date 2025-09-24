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
  SortAsc, 
  SortDesc, 
  GitCompare, 
  Phone, 
  Star,
  Building,
  Zap,
  DollarSign,
  Thermometer,
  TrendingUp
} from 'lucide-react';
import { Product, ProductFilter, ProductSort, ProductCategory } from '@/types/product';
import Link from 'next/link';

// 丹佛斯产品数据
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
  },
  {
    id: '4',
    name: 'AB-QM 自力式流量平衡阀',
    brand: '丹佛斯',
    model: 'AB-QM',
    power_range: 'DN15-DN300',
    applicable_industries: ['commercial_building', 'residential', 'hospital'],
    images: ['/images/danfoss-abqm.jpg'],
    contact_region: 'central',
    contact_person: '刘经理',
    contact_phone: '400-890-8986',
    contact_email: 'china.valves@danfoss.com',
    company: '丹佛斯（中国）有限公司',
    category: 'hydraulic_valve',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
    status: 'active',
    source: 'manual'
  },
  {
    id: '5',
    name: 'MBS 3000 压力传感器',
    brand: '丹佛斯',
    model: 'MBS 3000',
    power_range: '0-400bar',
    applicable_industries: ['food_beverage', 'electronics', 'pharmaceutical'],
    images: ['/images/danfoss-mbs3000.jpg'],
    contact_region: 'southwest',
    contact_person: '陈经理',
    contact_phone: '400-890-8986',
    contact_email: 'china.sensors@danfoss.com',
    company: '丹佛斯（中国）有限公司',
    category: 'sensor',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    status: 'active',
    source: 'api'
  },
  {
    id: '6',
    name: 'ECL Comfort 310 控制器',
    brand: '丹佛斯',
    model: 'ECL 310',
    power_range: '1-4个回路',
    applicable_industries: ['commercial_building', 'residential', 'hospital'],
    images: ['/images/danfoss-ecl310.jpg'],
    contact_region: 'northeast',
    contact_person: '赵经理',
    contact_phone: '400-890-8986',
    contact_email: 'china.controls@danfoss.com',
    company: '丹佛斯（中国）有限公司',
    category: 'control_system',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    status: 'active',
    source: 'excel'
  }
];

const categories: { value: ProductCategory; label: string }[] = [
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilter>({});
  const [sort, setSort] = useState<ProductSort>({ field: 'name', order: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 加载产品数据
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // 从管理员管理的产品数据中加载
      const adminProducts = localStorage.getItem('adminProducts');
      if (adminProducts) {
        const parsedProducts = JSON.parse(adminProducts);
        setProducts(parsedProducts);
      } else {
        // 如果没有管理员数据，使用默认数据
        setProducts(mockProducts);
      }
    } catch (error) {
      console.error('加载产品数据失败:', error);
      setProducts(mockProducts);
    } finally {
      setIsLoading(false);
    }
  };

  // 计算节能效果（基于产品类别）
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

  // 应用筛选和排序
  useEffect(() => {
    let filtered = [...products];

    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 其他筛选条件
    if (filters.contact_region) {
      filtered = filtered.filter(product => 
        product.contact_region === filters.contact_region
      );
    }

    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.applicable_industry) {
      filtered = filtered.filter(product => 
        product.applicable_industries.includes(filters.applicable_industry!)
      );
    }

    if (filters.power_range) {
      filtered = filtered.filter(product => 
        product.power_range.toLowerCase().includes(filters.power_range!.toLowerCase())
      );
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort.field) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'brand':
          aValue = a.brand;
          bValue = b.brand;
          break;
        case 'power_range':
          aValue = a.power_range;
          bValue = b.power_range;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sort.order === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

    setFilteredProducts(filtered);
  }, [products, filters, sort, searchTerm]);

  // 获取所有品牌
  const brands = [...new Set(products.map(p => p.brand))];

  // 切换产品对比选择
  const toggleProductComparison = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else if (prev.length < 3) { // 最多对比3个产品
        return [...prev, productId];
      }
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">产品推荐</h1>
          <p className="text-gray-600">为您推荐最适合的节能设备产品</p>
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
                  <Label>搜索产品</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="品牌、型号、厂商..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* 区域筛选 */}
                <div>
                  <Label>联系区域</Label>
                  <Select value={filters.contact_region || 'all'} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, contact_region: value === 'all' ? undefined : value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="选择区域" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部区域</SelectItem>
                      {regions.map(region => (
                        <SelectItem key={region.value} value={region.value}>{region.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 品牌筛选 */}
                <div>
                  <Label>品牌</Label>
                  <Select value={filters.brand || 'all'} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, brand: value === 'all' ? undefined : value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="选择品牌" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部品牌</SelectItem>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 适用行业筛选 */}
                <div>
                  <Label>适用行业</Label>
                  <Select value={filters.applicable_industry || 'all'} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, applicable_industry: value === 'all' ? undefined : value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="选择行业" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部行业</SelectItem>
                      {industries.map(industry => (
                        <SelectItem key={industry.value} value={industry.value}>{industry.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 产品类别 */}
                <div>
                  <Label>产品类别</Label>
                  <Select value={filters.category || 'all'} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, category: value === 'all' ? undefined : value as ProductCategory }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="选择类别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类别</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 功率范围 */}
                <div>
                  <Label>功率范围</Label>
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="如：0.75-630kW"
                      value={filters.power_range || ''}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        power_range: e.target.value || undefined 
                      }))}
                    />
                  </div>
                </div>

                {/* 重置筛选 */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setFilters({});
                    setSearchTerm('');
                  }}
                >
                  重置筛选
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 产品列表 */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* 排序和对比工具栏 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  共找到 {filteredProducts.length} 个产品
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* 排序 */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm">排序:</Label>
                  <Select 
                    value={`${sort.field}-${sort.order}`} 
                    onValueChange={(value) => {
                      const [field, order] = value.split('-');
                      setSort({ field: field as ProductSort['field'], order: order as ProductSort['order'] });
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                      <SelectItem value="price-asc">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          价格 ↑
                        </div>
                      </SelectItem>
                      <SelectItem value="price-desc">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          价格 ↓
                        </div>
                      </SelectItem>
                      <SelectItem value="cop-desc">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          COP ↓
                        </div>
                      </SelectItem>
                      <SelectItem value="cooling_capacity-desc">
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4" />
                          制冷量 ↓
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 对比按钮 */}
                {selectedProducts.length > 0 && (
                  <Button
                    onClick={() => setShowComparison(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <GitCompare className="w-4 h-4 mr-2" />
                    对比 ({selectedProducts.length})
                  </Button>
                )}
              </div>
            </div>

            {/* 产品网格 */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">加载产品数据中...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    energySavings={calculateEnergySavings(product)}
                    isSelected={selectedProducts.includes(product.id)}
                    onToggleComparison={toggleProductComparison}
                    canSelect={selectedProducts.length < 3}
                  />
                ))}
              </div>
            )}

            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Building className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无匹配产品</h3>
                <p className="text-gray-600">请调整筛选条件重新搜索</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 产品卡片组件
interface ProductCardProps {
  product: Product;
  energySavings: number;
  isSelected: boolean;
  onToggleComparison: (productId: string) => void;
  canSelect: boolean;
}

function ProductCard({ product, energySavings, isSelected, onToggleComparison, canSelect }: ProductCardProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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

  return (
    <>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  {product.brand}
                </Badge>
                {product.energy_efficiency_grade && (
                  <Badge variant="outline" className="text-xs">
                    {product.energy_efficiency_grade}级能效
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <p className="text-sm text-gray-600">{product.model}</p>
            </div>
            <Button
              size="sm"
              variant={isSelected ? "default" : "outline"}
              onClick={() => onToggleComparison(product.id)}
              disabled={!canSelect && !isSelected}
              className="text-xs"
            >
              <GitCompare className="w-3 h-3 mr-1" />
              {isSelected ? '已选' : '对比'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 产品图片 */}
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <Building className="w-12 h-12 text-gray-400" />
          </div>

          {/* 关键参数 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-gray-600">功率范围:</span>
              <span className="font-medium">{product.power_range}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-600">联系区域:</span>
              <span className="font-medium">{getRegionLabel(product.contact_region)}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="text-gray-600">联系人:</span>
              <span className="font-medium">{product.contact_person}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <span className="text-gray-600">公司:</span>
              <span className="font-medium text-sm truncate">
                {product.company}
              </span>
            </div>
          </div>

          {/* 节能效果 */}
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700">节能效果</span>
              <span className="font-bold text-green-800">
                +{energySavings.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* 适用行业 */}
          {product.applicable_industries && product.applicable_industries.length > 0 && (
            <div>
              <span className="text-xs text-gray-600">适用行业: </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {product.applicable_industries.slice(0, 3).map(industry => (
                  <Badge key={industry} variant="outline" className="text-xs">
                    {getIndustryLabel(industry)}
                  </Badge>
                ))}
                {product.applicable_industries.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.applicable_industries.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsContactModalOpen(true)}
            >
              <Phone className="w-4 h-4 mr-2" />
              联系厂商
            </Button>
            <Button
              size="sm"
              className="flex-1"
              asChild
            >
              <Link href={`/products/${product.id}`}>
                查看详情
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 联系厂商模态框 */}
      {isContactModalOpen && (
        <ContactModal
          product={product}
          onClose={() => setIsContactModalOpen(false)}
        />
      )}
    </>
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
    // 这里应该调用API提交联系记录
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
              <Label>公司名称</Label>
              <Input
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                placeholder="请输入您的公司名称"
              />
            </div>

            <div>
              <Label>联系人姓名 *</Label>
              <Input
                value={formData.contact_name}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                placeholder="请输入您的姓名"
                required
              />
            </div>

            <div>
              <Label>联系电话 *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="请输入您的联系电话"
                required
              />
            </div>

            <div>
              <Label>邮箱地址</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="请输入您的邮箱地址"
              />
            </div>

            <div>
              <Label>留言</Label>
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