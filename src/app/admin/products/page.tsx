"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Upload,
  Download,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Product, ProductCategory, ContactRegion, ApplicableIndustry } from "@/types/product"

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("")
  const [filterRegion, setFilterRegion] = useState<string>("")

  // 表单数据
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: '',
    model: '',
    power_range: '',
    applicable_industries: [],
    images: [],
    contact_region: '',
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    company: '',
    category: 'compressor',
    status: 'active'
  })

  // 模拟数据
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'VLT变频器FC-102',
        brand: 'Danfoss',
        model: 'FC-102',
        power_range: '0.37-90kW',
        applicable_industries: ['food_beverage', 'electronics'],
        images: ['/images/fc-102.jpg'],
        contact_region: 'east',
        contact_person: '张经理',
        contact_phone: '138-0000-1234',
        contact_email: 'zhang@danfoss.com',
        company: '丹佛斯(上海)投资有限公司',
        category: 'frequency_converter',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        status: 'active',
        source: 'manual'
      },
      {
        id: '2',
        name: '涡旋压缩机CSH系列',
        brand: 'Danfoss',
        model: 'CSH-120',
        power_range: '10-50kW',
        applicable_industries: ['commercial_building', 'residential'],
        images: ['/images/csh-120.jpg'],
        contact_region: 'north',
        contact_person: '李经理',
        contact_phone: '139-0000-5678',
        contact_email: 'li@danfoss.com',
        company: '丹佛斯(天津)有限公司',
        category: 'compressor',
        created_at: '2024-01-02',
        updated_at: '2024-01-02',
        status: 'active',
        source: 'manual'
      }
    ]
    
    setTimeout(() => {
      setProducts(mockProducts)
      setIsLoading(false)
    }, 1000)
  }, [])

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
  ]

  const regions: { value: ContactRegion; label: string }[] = [
    { value: 'north', label: '华北' },
    { value: 'east', label: '华东' },
    { value: 'south', label: '华南' },
    { value: 'central', label: '华中' },
    { value: 'southwest', label: '西南' },
    { value: 'northeast', label: '东北' },
    { value: 'northwest', label: '西北' }
  ]

  const industries: { value: ApplicableIndustry; label: string }[] = [
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
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingProduct) {
      // 编辑产品
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...formData as Product, id: editingProduct.id, updated_at: new Date().toISOString() }
          : p
      ))
      setEditingProduct(null)
    } else {
      // 添加新产品
      const newProduct: Product = {
        ...formData as Product,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setProducts(prev => [...prev, newProduct])
      setShowAddForm(false)
    }
    
    // 重置表单
    setFormData({
      name: '',
      brand: '',
      model: '',
      power_range: '',
      applicable_industries: [],
      images: [],
      contact_region: '',
      contact_person: '',
      contact_phone: '',
      contact_email: '',
      company: '',
      category: 'compressor',
      status: 'active'
    })
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData(product)
    setShowAddForm(true)
  }

  const handleDelete = (productId: string) => {
    if (confirm('确定要删除这个产品吗？')) {
      setProducts(prev => prev.filter(p => p.id !== productId))
    }
  }

  const handleIndustryChange = (industry: ApplicableIndustry, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      applicable_industries: checked 
        ? [...(prev.applicable_industries || []), industry]
        : (prev.applicable_industries || []).filter(i => i !== industry)
    }))
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || product.category === filterCategory
    const matchesRegion = !filterRegion || product.contact_region === filterRegion
    
    return matchesSearch && matchesCategory && matchesRegion
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />活跃</Badge>
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />未激活</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">待审核</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* 页面标题 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">产品管理</h1>
              <p className="text-gray-600 mt-2">管理产品信息、图片和联系方式</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                导入
              </Button>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                添加产品
              </Button>
            </div>
          </div>

          {/* 搜索和筛选 */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">搜索产品</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="search"
                      placeholder="产品名称、品牌、型号..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">产品类别</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择类别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">全部类别</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="region">联系区域</Label>
                  <Select value={filterRegion} onValueChange={setFilterRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择区域" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">全部区域</SelectItem>
                      {regions.map(region => (
                        <SelectItem key={region.value} value={region.value}>
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    <Filter className="w-4 h-4 mr-2" />
                    筛选
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 添加/编辑产品表单 */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>{editingProduct ? '编辑产品' : '添加产品'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">产品名称 *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="请输入产品名称"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand">品牌 *</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                        placeholder="请输入品牌"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="model">型号 *</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                        placeholder="请输入型号"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="power_range">功率范围 *</Label>
                      <Input
                        id="power_range"
                        value={formData.power_range}
                        onChange={(e) => setFormData(prev => ({ ...prev, power_range: e.target.value }))}
                        placeholder="如: 10-50kW"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">产品类别 *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as ProductCategory }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                      <Label htmlFor="company">厂商公司 *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="请输入厂商公司"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>适用行业或应用 *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                      {industries.map(industry => (
                        <div key={industry.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={industry.value}
                            checked={formData.applicable_industries?.includes(industry.value) || false}
                            onChange={(e) => handleIndustryChange(industry.value, e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={industry.value} className="text-sm">
                            {industry.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div>
                      <Label htmlFor="contact_person">联系人 *</Label>
                      <Input
                        id="contact_person"
                        value={formData.contact_person}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
                        placeholder="请输入联系人"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_phone">联系电话 *</Label>
                      <Input
                        id="contact_phone"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                        placeholder="请输入联系电话"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_email">联系邮箱</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                        placeholder="请输入联系邮箱"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="images">产品图片</Label>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">支持上传多张图片</p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false)
                        setEditingProduct(null)
                        setFormData({
                          name: '',
                          brand: '',
                          model: '',
                          power_range: '',
                          applicable_industries: [],
                          images: [],
                          contact_region: '',
                          contact_person: '',
                          contact_phone: '',
                          contact_email: '',
                          company: '',
                          category: 'compressor',
                          status: 'active'
                        })
                      }}
                    >
                      取消
                    </Button>
                    <Button type="submit">
                      {editingProduct ? '更新产品' : '添加产品'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* 产品列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      {getStatusBadge(product.status)}
                    </div>
                    <p className="text-sm text-gray-600">{product.brand} {product.model}</p>
                    <p className="text-sm text-gray-600">功率范围: {product.power_range}</p>
                    <p className="text-sm text-gray-600">联系区域: {regions.find(r => r.value === product.contact_region)?.label}</p>
                    <div className="flex flex-wrap gap-1">
                      {product.applicable_industries.slice(0, 2).map(industry => (
                        <Badge key={industry} variant="outline" className="text-xs">
                          {industries.find(i => i.value === industry)?.label}
                        </Badge>
                      ))}
                      {product.applicable_industries.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.applicable_industries.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无产品</h3>
                <p className="text-gray-600 mb-4">还没有添加任何产品，点击上方按钮开始添加</p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  添加产品
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}