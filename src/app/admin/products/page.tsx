"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Lock, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Upload, 
  Download,
  Building,
  Package,
  Save,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Product, ProductCategory } from '@/types/product';

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

export default function AdminProductsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: '丹佛斯',
    model: '',
    power_range: '',
    applicable_industries: [],
    images: [],
    contact_region: 'east',
    category: 'other',
    status: 'active',
    source: 'manual'
  });

  // 加载产品数据
  useEffect(() => {
    loadProducts();
  }, []);

  // 搜索筛选
  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // 模拟从API加载数据
      const storedProducts = localStorage.getItem('adminProducts');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        // 默认产品数据
        const defaultProducts: Product[] = [
          {
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
            contact_person: regionContacts.north.name,
            contact_phone: regionContacts.north.phone,
            contact_email: regionContacts.north.email,
            company: '丹佛斯（中国）有限公司',
            category: 'compressor',
            created_at: '2024-01-10T00:00:00Z',
            updated_at: '2024-01-10T00:00:00Z',
            status: 'active',
            source: 'api'
          }
        ];
        setProducts(defaultProducts);
        localStorage.setItem('adminProducts', JSON.stringify(defaultProducts));
      }
    } catch (error) {
      console.error('加载产品数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('adminProducts', JSON.stringify(newProducts));
  };

  const handleAddProduct = () => {
    setFormData({
      name: '',
      brand: '丹佛斯',
      model: '',
      power_range: '',
      applicable_industries: [],
      images: [],
      contact_region: 'east',
      category: 'other',
      status: 'active',
      source: 'manual'
    });
    setEditingProduct(null);
    setShowAddForm(true);
    setIsEditing(true);
  };

  const handleEditProduct = (product: Product) => {
    setFormData(product);
    setEditingProduct(product);
    setShowAddForm(true);
    setIsEditing(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('确定要删除这个产品吗？')) {
      const newProducts = products.filter(p => p.id !== productId);
      saveProducts(newProducts);
    }
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.model || !formData.power_range) {
      alert('请填写必填字段');
      return;
    }

    const contact = regionContacts[formData.contact_region as keyof typeof regionContacts];
    
    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name!,
      brand: formData.brand!,
      model: formData.model!,
      power_range: formData.power_range!,
      applicable_industries: formData.applicable_industries!,
      images: formData.images!,
      contact_region: formData.contact_region!,
      contact_person: contact.name,
      contact_phone: contact.phone,
      contact_email: contact.email,
      company: '丹佛斯（中国）有限公司',
      category: formData.category!,
      status: formData.status!,
      source: formData.source!,
      created_at: editingProduct?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let newProducts: Product[];
    if (editingProduct) {
      newProducts = products.map(p => p.id === editingProduct.id ? productData : p);
    } else {
      newProducts = [...products, productData];
    }

    saveProducts(newProducts);
    setShowAddForm(false);
    setIsEditing(false);
    setEditingProduct(null);
  };

  const handleIndustryChange = (industry: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      applicable_industries: checked 
        ? [...(prev.applicable_industries || []), industry]
        : (prev.applicable_industries || []).filter(i => i !== industry)
    }));
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-3 text-gray-600">加载中...</span>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">访问受限</CardTitle>
            <CardDescription>
              您没有权限访问此管理页面。请联系管理员。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/">
                返回首页
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">产品管理</h1>
          <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            添加产品
          </Button>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">产品列表</TabsTrigger>
            <TabsTrigger value="import">批量导入</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* 搜索和筛选 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  搜索产品
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="搜索产品名称、品牌或型号..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 产品列表 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  产品列表 ({filteredProducts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">加载中...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">暂无产品数据</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{product.name}</h3>
                              <Badge variant="secondary">{product.brand}</Badge>
                              <Badge variant="outline">{product.model}</Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">功率范围:</span> {product.power_range}
                              </div>
                              <div>
                                <span className="font-medium">联系区域:</span> {regions.find(r => r.value === product.contact_region)?.label}
                              </div>
                              <div>
                                <span className="font-medium">联系人:</span> {product.contact_person}
                              </div>
                              <div>
                                <span className="font-medium">状态:</span> 
                                <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className="ml-1">
                                  {product.status === 'active' ? '活跃' : '非活跃'}
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="font-medium text-sm">适用行业:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {product.applicable_industries.slice(0, 3).map(industry => (
                                  <Badge key={industry} variant="outline" className="text-xs">
                                    {industries.find(i => i.value === industry)?.label}
                                  </Badge>
                                ))}
                                {product.applicable_industries.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{product.applicable_industries.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>批量导入产品</CardTitle>
                <CardDescription>
                  支持Excel文件批量导入产品信息
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">批量导入功能开发中</p>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    下载模板
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 添加/编辑产品表单 */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {editingProduct ? '编辑产品' : '添加产品'}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowAddForm(false);
                      setIsEditing(false);
                      setEditingProduct(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">产品名称 *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="请输入产品名称"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">品牌 *</Label>
                    <Input
                      id="brand"
                      value={formData.brand || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      placeholder="请输入品牌"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="model">型号 *</Label>
                    <Input
                      id="model"
                      value={formData.model || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                      placeholder="请输入型号"
                    />
                  </div>
                  <div>
                    <Label htmlFor="power_range">功率范围 *</Label>
                    <Input
                      id="power_range"
                      value={formData.power_range || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, power_range: e.target.value }))}
                      placeholder="如：0.75-630kW"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">产品类别 *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as ProductCategory }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择产品类别" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="contact_region">联系区域 *</Label>
                    <Select
                      value={formData.contact_region}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, contact_region: value }))}
                    >
                      <SelectTrigger>
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

                <div>
                  <Label>适用行业 *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {industries.map(industry => (
                      <label key={industry.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.applicable_industries?.includes(industry.value) || false}
                          onChange={(e) => handleIndustryChange(industry.value, e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">{industry.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="images">产品图片URL</Label>
                  <Input
                    id="images"
                    value={formData.images?.[0] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, images: [e.target.value] }))}
                    placeholder="请输入产品图片URL"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setIsEditing(false);
                      setEditingProduct(null);
                    }}
                  >
                    取消
                  </Button>
                  <Button onClick={handleSaveProduct} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    保存
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}