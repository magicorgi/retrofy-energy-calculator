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
    brand: '丹佛斯',
    model: 'VLT® Flow Drive FC 111',
    cooling_capacity: 75, // 适用于75kW系统
    cop: 0.95, // 变频器效率
    iplv: 0.96,
    price_min: 8000,
    price_max: 15000,
    price_unit: '元/台',
    images: ['/images/danfoss-fc111.jpg'],
    manual_url: 'https://www.danfoss.com/zh-cn/products/drives/ac-drives/vlt-flow-drive-fc-111/',
    contact_person: '丹佛斯技术支持',
    contact_phone: '400-890-8986',
    contact_email: 'china.drives@danfoss.com',
    company: '丹佛斯（中国）有限公司',
    description: '专为风机和泵类应用设计的变频器，具备火灾模式、跳跃频率、皮带监控等功能',
    features: ['火灾越控模式', '跳跃频率', '皮带监控', '节能优化', 'PID控制'],
    specifications: {
      '功率范围': '0.75-630kW',
      '电源': '380-480V/3Ph',
      '防护等级': 'IP20/IP55',
      '效率': '≥95%'
    },
    applicable_cities: ['北京', '上海', '广州', '深圳', '天津', '重庆', '杭州', '南京'],
    category: 'frequency_converter',
    energy_efficiency_grade: '一级',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    status: 'active',
    source: 'manual'
  },
  {
    id: '2',
    brand: '丹佛斯',
    model: 'Performer® HHP 涡旋压缩机',
    cooling_capacity: 120, // 制冷量120kW
    heating_capacity: 140,
    cop: 4.8,
    iplv: 5.2,
    price_min: 25000,
    price_max: 35000,
    price_unit: '元/台',
    images: ['/images/danfoss-performer-hhp.jpg'],
    manual_url: 'https://www.danfoss.com/zh-cn/products/compressors/scroll-compressors/performer-hhp/',
    contact_person: '丹佛斯压缩机部',
    contact_phone: '400-890-8986',
    contact_email: 'china.compressors@danfoss.com',
    company: '丹佛斯（中国）有限公司',
    description: '适用于住宅和商用热泵的高效涡旋压缩机，即使在-20°C低温下也能可靠运行',
    features: ['高效涡旋设计', '低温运行', '全新簧片阀', '优化涡旋组', '可靠性高'],
    specifications: {
      '功率范围': '5-240kW',
      '制冷剂': 'R410A/R32/R134a',
      '工作温度': '-20°C ~ 65°C',
      '噪音': '≤58dB(A)'
    },
    applicable_cities: ['北京', '上海', '广州', '深圳', '成都', '西安', '沈阳', '哈尔滨'],
    category: 'compressor',
    energy_efficiency_grade: '一级',
    refrigerant_type: 'R410A',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    status: 'active',
    source: 'api'
  },
  {
    id: '3',
    brand: '丹佛斯',
    model: 'H系列微板换热器 MPHE',
    cooling_capacity: 200, // 换热量200kW
    cop: 0.98, // 换热效率
    iplv: 0.99,
    price_min: 12000,
    price_max: 20000,
    price_unit: '元/台',
    images: ['/images/danfoss-mphe.jpg'],
    manual_url: 'https://www.danfoss.com/zh-cn/products/heat-exchangers/plate-heat-exchangers/',
    contact_person: '丹佛斯换热器部',
    contact_phone: '400-890-8986',
    contact_email: 'china.heatexchangers@danfoss.com',
    company: '丹佛斯（中国）有限公司',
    description: '用于空气源或地源热泵的高效微板换热器，可作冷凝器或蒸发器使用',
    features: ['紧凑设计', '高效换热', '耐腐蚀', '易维护', '节能环保'],
    specifications: {
      '换热量': '50-500kW',
      '工作压力': '≤3.0MPa',
      '工作温度': '-40°C ~ 180°C',
      '材质': '不锈钢316L'
    },
    applicable_cities: ['北京', '上海', '广州', '深圳', '杭州', '南京', '武汉', '长沙'],
    category: 'heat_exchanger',
    energy_efficiency_grade: '一级',
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z',
    status: 'active',
    source: 'excel'
  },
  {
    id: '4',
    brand: '丹佛斯',
    model: 'AB-QM 自力式流量平衡阀',
    cooling_capacity: 0, // 阀门类产品
    cop: 0.99, // 流量控制精度
    iplv: 0.99,
    price_min: 2000,
    price_max: 5000,
    price_unit: '元/台',
    images: ['/images/danfoss-abqm.jpg'],
    manual_url: 'https://www.danfoss.com/zh-cn/products/valves/flow-control-valves/',
    contact_person: '丹佛斯阀门部',
    contact_phone: '400-890-8986',
    contact_email: 'china.valves@danfoss.com',
    company: '丹佛斯（中国）有限公司',
    description: '自力式流量平衡阀，确保系统水力平衡，提高能效和舒适度',
    features: ['自力式控制', '精确流量', '压差补偿', '免维护', '节能优化'],
    specifications: {
      '口径范围': 'DN15-DN300',
      '工作压力': '≤1.6MPa',
      '工作温度': '-10°C ~ 120°C',
      '精度': '±5%'
    },
    applicable_cities: ['北京', '上海', '广州', '深圳', '天津', '重庆', '西安', '郑州'],
    category: 'hydraulic_valve',
    energy_efficiency_grade: '一级',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
    status: 'active',
    source: 'manual'
  },
  {
    id: '5',
    brand: '丹佛斯',
    model: 'MBS 3000 压力传感器',
    cooling_capacity: 0, // 传感器类产品
    cop: 0.999, // 测量精度
    iplv: 0.999,
    price_min: 800,
    price_max: 2000,
    price_unit: '元/台',
    images: ['/images/danfoss-mbs3000.jpg'],
    manual_url: 'https://www.danfoss.com/zh-cn/products/sensors/pressure-sensors/',
    contact_person: '丹佛斯传感器部',
    contact_phone: '400-890-8986',
    contact_email: 'china.sensors@danfoss.com',
    company: '丹佛斯（中国）有限公司',
    description: '高精度压力传感器，适用于HVAC系统压力监测和控制',
    features: ['高精度测量', '长期稳定', '抗冲击', '多种输出', 'IO-Link通讯'],
    specifications: {
      '测量范围': '0-400bar',
      '精度': '±0.25% FS',
      '输出信号': '4-20mA/0-10V',
      '防护等级': 'IP67'
    },
    applicable_cities: ['北京', '上海', '广州', '深圳', '苏州', '无锡', '青岛', '大连'],
    category: 'sensor',
    energy_efficiency_grade: '一级',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    status: 'active',
    source: 'api'
  },
  {
    id: '6',
    brand: '丹佛斯',
    model: 'ECL Comfort 310 控制器',
    cooling_capacity: 0, // 控制器类产品
    cop: 0.98, // 控制精度
    iplv: 0.99,
    price_min: 5000,
    price_max: 12000,
    price_unit: '元/台',
    images: ['/images/danfoss-ecl310.jpg'],
    manual_url: 'https://www.danfoss.com/zh-cn/products/controls/heating-controls/',
    contact_person: '丹佛斯控制部',
    contact_phone: '400-890-8986',
    contact_email: 'china.controls@danfoss.com',
    company: '丹佛斯（中国）有限公司',
    description: '智能供热控制器，提供精确的温度和流量控制，优化系统能效',
    features: ['智能控制', '远程监控', '节能算法', '故障诊断', '数据记录'],
    specifications: {
      '控制回路': '1-4个回路',
      '输入信号': '温度/压力/流量',
      '输出信号': '0-10V/PWM',
      '通讯': 'Modbus/BACnet'
    },
    applicable_cities: ['北京', '上海', '广州', '深圳', '济南', '石家庄', '太原', '呼和浩特'],
    category: 'control_system',
    energy_efficiency_grade: '一级',
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

const cities = [
  '北京', '上海', '广州', '深圳', '杭州', '南京', '苏州', '成都',
  '武汉', '西安', '天津', '重庆', '青岛', '大连', '厦门', '宁波'
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [filters, setFilters] = useState<ProductFilter>({});
  const [sort, setSort] = useState<ProductSort>({ field: 'energy_savings', order: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // 计算节能效果（基于COP）
  const calculateEnergySavings = (product: Product) => {
    // 假设基准COP为3.0，计算节能百分比
    const baselineCOP = 3.0;
    return ((product.cop - baselineCOP) / baselineCOP * 100);
  };

  // 应用筛选和排序
  useEffect(() => {
    let filtered = [...products];

    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 其他筛选条件
    if (filters.city) {
      filtered = filtered.filter(product => 
        product.applicable_cities?.includes(filters.city!)
      );
    }

    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.cooling_capacity_min) {
      filtered = filtered.filter(product => product.cooling_capacity >= filters.cooling_capacity_min!);
    }

    if (filters.cooling_capacity_max) {
      filtered = filtered.filter(product => product.cooling_capacity <= filters.cooling_capacity_max!);
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sort.field) {
        case 'energy_savings':
          aValue = calculateEnergySavings(a);
          bValue = calculateEnergySavings(b);
          break;
        case 'price':
          aValue = (a.price_min + a.price_max) / 2;
          bValue = (b.price_min + b.price_max) / 2;
          break;
        case 'cop':
          aValue = a.cop;
          bValue = b.cop;
          break;
        case 'iplv':
          aValue = a.iplv;
          bValue = b.iplv;
          break;
        case 'cooling_capacity':
          aValue = a.cooling_capacity;
          bValue = b.cooling_capacity;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          return 0;
      }

      return sort.order === 'asc' ? aValue - bValue : bValue - aValue;
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
          <div className="lg:col-span-1">
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

                {/* 城市筛选 */}
                <div>
                  <Label>适用城市</Label>
                  <Select value={filters.city || 'all'} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, city: value === 'all' ? undefined : value }))
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

                {/* 制冷量范围 */}
                <div>
                  <Label>制冷量范围 (kW)</Label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="最小值"
                        value={filters.cooling_capacity_min || ''}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          cooling_capacity_min: e.target.value ? Number(e.target.value) : undefined 
                        }))}
                      />
                      <Input
                        type="number"
                        placeholder="最大值"
                        value={filters.cooling_capacity_max || ''}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          cooling_capacity_max: e.target.value ? Number(e.target.value) : undefined 
                        }))}
                      />
                    </div>
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
          <div className="lg:col-span-3">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

            {filteredProducts.length === 0 && (
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

  const formatPrice = (min: number, max: number, unit: string) => {
    if (min === max) {
      return `${min.toLocaleString()} ${unit}`;
    }
    return `${min.toLocaleString()} - ${max.toLocaleString()} ${unit}`;
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
              <CardTitle className="text-lg">{product.model}</CardTitle>
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
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600">制冷量:</span>
              <span className="font-medium">{product.cooling_capacity} kW</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">COP:</span>
              <span className="font-medium">{product.cop}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span className="text-gray-600">IPLV:</span>
              <span className="font-medium">{product.iplv}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-500" />
              <span className="text-gray-600">价格:</span>
              <span className="font-medium text-sm">
                {formatPrice(product.price_min, product.price_max, product.price_unit)}
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

          {/* 适用城市 */}
          {product.applicable_cities && product.applicable_cities.length > 0 && (
            <div>
              <span className="text-xs text-gray-600">适用城市: </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {product.applicable_cities.slice(0, 3).map(city => (
                  <Badge key={city} variant="outline" className="text-xs">
                    {city}
                  </Badge>
                ))}
                {product.applicable_cities.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.applicable_cities.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-2 pt-2">
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