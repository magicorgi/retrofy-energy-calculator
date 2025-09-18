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
  Plus, 
  Upload, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  FileSpreadsheet,
  Building,
  Save,
  X
} from 'lucide-react';
import { Product, ProductCategory, ContactRecord } from '@/types/product';

// 模拟产品数据
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
  }
];

// 模拟联系记录数据
const mockContactRecords: ContactRecord[] = [
  {
    id: '1',
    product_id: '1',
    company_name: '北京某建筑公司',
    contact_name: '王总',
    phone: '138-0000-1111',
    email: 'wang@company.com',
    message: '希望了解格力GMV-H180WL/A的详细报价',
    status: 'pending',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    product_id: '2',
    company_name: '上海某设计院',
    contact_name: '李工',
    phone: '138-0000-2222',
    email: 'li@design.com',
    message: '需要美的MDV-H140WL/A的技术参数和安装方案',
    status: 'contacted',
    created_at: '2024-01-18T00:00:00Z',
    updated_at: '2024-01-19T00:00:00Z',
    assigned_to: '销售A'
  }
];

const categories: { value: ProductCategory; label: string }[] = [
  { value: 'chiller', label: '冷水机组' },
  { value: 'heat_pump', label: '热泵' },
  { value: 'industrial_hp', label: '工业高温热泵' },
  { value: 'air_conditioning', label: '空调' },
  { value: 'refrigeration', label: '制冷设备' },
  { value: 'other', label: '其他' }
];

const cities = [
  '北京', '上海', '广州', '深圳', '杭州', '南京', '苏州', '成都',
  '武汉', '西安', '天津', '重庆', '青岛', '大连', '厦门', '宁波'
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [contactRecords, setContactRecords] = useState<ContactRecord[]>(mockContactRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    brand: '',
    model: '',
    cooling_capacity: 0,
    heating_capacity: 0,
    cop: 0,
    iplv: 0,
    price_min: 0,
    price_max: 0,
    price_unit: '元/kW',
    images: [],
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    company: '',
    description: '',
    features: [],
    specifications: {},
    applicable_cities: [],
    category: 'chiller',
    energy_efficiency_grade: '',
    refrigerant_type: '',
    status: 'active',
    source: 'manual'
  });

  const filteredProducts = products.filter(product =>
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    if (!newProduct.brand || !newProduct.model) {
      alert('请填写品牌和型号');
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      ...newProduct,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Product;

    setProducts(prev => [product, ...prev]);
    setIsAddModalOpen(false);
    setNewProduct({
      brand: '',
      model: '',
      cooling_capacity: 0,
      heating_capacity: 0,
      cop: 0,
      iplv: 0,
      price_min: 0,
      price_max: 0,
      price_unit: '元/kW',
      images: [],
      contact_person: '',
      contact_phone: '',
      contact_email: '',
      company: '',
      description: '',
      features: [],
      specifications: {},
      applicable_cities: [],
      category: 'chiller',
      energy_efficiency_grade: '',
      refrigerant_type: '',
      status: 'active',
      source: 'manual'
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    const updatedProduct = {
      ...editingProduct,
      ...newProduct,
      updated_at: new Date().toISOString()
    };

    setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('确定要删除这个产品吗？')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 这里应该实现Excel文件解析逻辑
    console.log('上传Excel文件:', file.name);
    alert('Excel导入功能开发中...');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'manual': return 'bg-blue-100 text-blue-800';
      case 'api': return 'bg-purple-100 text-purple-800';
      case 'excel': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">产品管理</h1>
          <p className="text-gray-600">管理产品信息和联系记录</p>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">产品管理</TabsTrigger>
            <TabsTrigger value="contacts">联系记录</TabsTrigger>
            <TabsTrigger value="import">批量导入</TabsTrigger>
          </TabsList>

          {/* 产品管理 */}
          <TabsContent value="products" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>产品列表</CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsAddModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      添加产品
                    </Button>
                    <Button variant="outline" onClick={() => setIsExcelModalOpen(true)}>
                      <Upload className="w-4 h-4 mr-2" />
                      Excel导入
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="搜索产品..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">产品信息</th>
                        <th className="text-left p-3">技术参数</th>
                        <th className="text-left p-3">价格</th>
                        <th className="text-left p-3">状态</th>
                        <th className="text-left p-3">来源</th>
                        <th className="text-left p-3">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{product.brand} {product.model}</div>
                              <div className="text-sm text-gray-600">{product.company}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              <div>制冷量: {product.cooling_capacity} kW</div>
                              <div>COP: {product.cop} | IPLV: {product.iplv}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              {product.price_min.toLocaleString()} - {product.price_max.toLocaleString()} {product.price_unit}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(product.status)}>
                              {product.status === 'active' ? '启用' : product.status === 'inactive' ? '禁用' : '待审核'}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge className={getSourceColor(product.source)}>
                              {product.source === 'manual' ? '手动录入' : product.source === 'api' ? 'API同步' : 'Excel导入'}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <a href={`/products/${product.id}`} target="_blank" rel="noopener noreferrer">
                                  <Eye className="w-3 h-3" />
                                </a>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 联系记录 */}
          <TabsContent value="contacts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>联系记录</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactRecords.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{record.company_name || record.contact_name}</div>
                          <div className="text-sm text-gray-600">
                            {record.contact_name} | {record.phone} | {record.email}
                          </div>
                        </div>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status === 'pending' ? '待处理' : 
                           record.status === 'contacted' ? '已联系' :
                           record.status === 'quoted' ? '已报价' : '已关闭'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">{record.message}</div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>产品ID: {record.product_id}</span>
                        <span>{new Date(record.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 批量导入 */}
          <TabsContent value="import" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Excel批量导入</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">上传Excel文件</h3>
                    <p className="text-gray-600 mb-4">
                      支持.xlsx格式，请按照模板格式填写产品信息
                    </p>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleExcelUpload}
                      className="hidden"
                      id="excel-upload"
                    />
                    <Button asChild>
                      <label htmlFor="excel-upload" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        选择文件
                      </label>
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Excel模板格式说明</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div>• 品牌、型号、公司为必填字段</div>
                      <div>• 制冷量、COP、IPLV为数值类型</div>
                      <div>• 适用城市用逗号分隔，如：北京,上海,广州</div>
                      <div>• 产品特点用分号分隔，如：变频控制;高效换热器</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      下载模板
                    </Button>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      查看示例
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 添加产品模态框 */}
      {isAddModalOpen && (
        <ProductModal
          title="添加产品"
          product={newProduct}
          onProductChange={setNewProduct}
          onSave={handleAddProduct}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* 编辑产品模态框 */}
      {isEditModalOpen && (
        <ProductModal
          title="编辑产品"
          product={newProduct}
          onProductChange={setNewProduct}
          onSave={handleUpdateProduct}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}

// 产品编辑模态框组件
interface ProductModalProps {
  title: string;
  product: Partial<Product>;
  onProductChange: (product: Partial<Product>) => void;
  onSave: () => void;
  onClose: () => void;
}

function ProductModal({ title, product, onProductChange, onSave, onClose }: ProductModalProps) {
  const handleInputChange = (field: string, value: any) => {
    onProductChange({ ...product, [field]: value });
  };

  const handleArrayInput = (field: string, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    onProductChange({ ...product, [field]: array });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">{title}</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">基本信息</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>品牌 *</Label>
                  <Input
                    value={product.brand || ''}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="如：格力"
                  />
                </div>
                <div>
                  <Label>型号 *</Label>
                  <Input
                    value={product.model || ''}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="如：GMV-H180WL/A"
                  />
                </div>
              </div>

              <div>
                <Label>厂商公司</Label>
                <Input
                  value={product.company || ''}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="公司全称"
                />
              </div>

              <div>
                <Label>产品类别</Label>
                <Select value={product.category || 'chiller'} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>产品描述</Label>
                <textarea
                  className="w-full p-2 border rounded-md resize-none"
                  rows={3}
                  value={product.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="产品描述..."
                />
              </div>
            </div>

            {/* 技术参数 */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">技术参数</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>制冷量 (kW)</Label>
                  <Input
                    type="number"
                    value={product.cooling_capacity || ''}
                    onChange={(e) => handleInputChange('cooling_capacity', parseFloat(e.target.value) || 0)}
                    placeholder="180"
                  />
                </div>
                <div>
                  <Label>制热量 (kW)</Label>
                  <Input
                    type="number"
                    value={product.heating_capacity || ''}
                    onChange={(e) => handleInputChange('heating_capacity', parseFloat(e.target.value) || 0)}
                    placeholder="200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>COP</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={product.cop || ''}
                    onChange={(e) => handleInputChange('cop', parseFloat(e.target.value) || 0)}
                    placeholder="4.2"
                  />
                </div>
                <div>
                  <Label>IPLV</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={product.iplv || ''}
                    onChange={(e) => handleInputChange('iplv', parseFloat(e.target.value) || 0)}
                    placeholder="5.8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>价格最小值</Label>
                  <Input
                    type="number"
                    value={product.price_min || ''}
                    onChange={(e) => handleInputChange('price_min', parseFloat(e.target.value) || 0)}
                    placeholder="45000"
                  />
                </div>
                <div>
                  <Label>价格最大值</Label>
                  <Input
                    type="number"
                    value={product.price_max || ''}
                    onChange={(e) => handleInputChange('price_max', parseFloat(e.target.value) || 0)}
                    placeholder="52000"
                  />
                </div>
              </div>

              <div>
                <Label>价格单位</Label>
                <Select value={product.price_unit || '元/kW'} onValueChange={(value) => handleInputChange('price_unit', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="元/kW">元/kW</SelectItem>
                    <SelectItem value="万元/台">万元/台</SelectItem>
                    <SelectItem value="元/台">元/台</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 联系信息 */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">联系信息</h4>
              
              <div>
                <Label>联系人</Label>
                <Input
                  value={product.contact_person || ''}
                  onChange={(e) => handleInputChange('contact_person', e.target.value)}
                  placeholder="张工程师"
                />
              </div>

              <div>
                <Label>联系电话</Label>
                <Input
                  value={product.contact_phone || ''}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  placeholder="138-0000-0001"
                />
              </div>

              <div>
                <Label>联系邮箱</Label>
                <Input
                  type="email"
                  value={product.contact_email || ''}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="zhang@company.com"
                />
              </div>
            </div>

            {/* 其他信息 */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">其他信息</h4>
              
              <div>
                <Label>适用城市</Label>
                <Input
                  value={product.applicable_cities?.join(', ') || ''}
                  onChange={(e) => handleArrayInput('applicable_cities', e.target.value)}
                  placeholder="北京, 上海, 广州"
                />
                <div className="text-xs text-gray-500 mt-1">用逗号分隔多个城市</div>
              </div>

              <div>
                <Label>产品特点</Label>
                <Input
                  value={product.features?.join('; ') || ''}
                  onChange={(e) => handleArrayInput('features', e.target.value)}
                  placeholder="变频控制; 高效换热器; 智能除霜"
                />
                <div className="text-xs text-gray-500 mt-1">用分号分隔多个特点</div>
              </div>

              <div>
                <Label>能效等级</Label>
                <Select value={product.energy_efficiency_grade || 'none'} onValueChange={(value) => handleInputChange('energy_efficiency_grade', value === 'none' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择能效等级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">不选择</SelectItem>
                    <SelectItem value="一级">一级</SelectItem>
                    <SelectItem value="二级">二级</SelectItem>
                    <SelectItem value="三级">三级</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>制冷剂类型</Label>
                <Input
                  value={product.refrigerant_type || ''}
                  onChange={(e) => handleInputChange('refrigerant_type', e.target.value)}
                  placeholder="R410A"
                />
              </div>

              <div>
                <Label>技术手册URL</Label>
                <Input
                  value={product.manual_url || ''}
                  onChange={(e) => handleInputChange('manual_url', e.target.value)}
                  placeholder="https://example.com/manual.pdf"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t mt-6">
            <Button variant="outline" onClick={onClose} className="flex-1">
              取消
            </Button>
            <Button onClick={onSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
