"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Calendar,
  User,
  TrendingUp,
  Image,
  Tag,
  MapPin,
  Building,
  Star,
  Heart,
  ExternalLink,
  Archive,
  CheckCircle
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Article, Case, ADMIN_PERMISSIONS } from '@/types/admin';
import { Product } from '@/types/product';

// 模拟文章数据
const mockArticles: Article[] = [
  {
    id: '1',
    title: '热泵技术发展趋势分析',
    content: '随着国家对节能减排政策的推进...',
    summary: '深入分析热泵技术的发展趋势和市场前景',
    cover_image: '/images/article1.jpg',
    category: '技术分析',
    tags: ['热泵', '技术趋势', '节能'],
    author_id: '1',
    author_name: '张工程师',
    status: 'published',
    view_count: 4521,
    like_count: 89,
    publish_at: '2024-01-15T10:00:00Z',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    seo_title: '热泵技术发展趋势分析 - 节能改造专家',
    seo_description: '深入分析热泵技术发展趋势，为节能改造提供技术指导',
    seo_keywords: ['热泵', '节能技术', '绿色建筑']
  },
  {
    id: '2',
    title: '工业节能改造案例分享',
    content: '某大型工厂通过热泵改造实现显著节能效果...',
    summary: '分享工业节能改造的成功案例和经验',
    category: '案例分享',
    tags: ['工业节能', '案例分析', '热泵改造'],
    author_id: '2',
    author_name: '李工程师',
    status: 'draft',
    view_count: 0,
    like_count: 0,
    created_at: '2024-01-18T00:00:00Z',
    updated_at: '2024-01-19T00:00:00Z'
  }
];

// 模拟案例数据
const mockCases: Case[] = [
  {
    id: '1',
    title: '某商业综合体节能改造案例',
    description: '通过热泵系统改造，实现30%的节能效果',
    content: '项目详细介绍...',
    cover_image: '/images/case1.jpg',
    images: ['/images/case1-1.jpg', '/images/case1-2.jpg'],
    category: '商业建筑',
    tags: ['商业综合体', '热泵改造', '节能30%'],
    client_name: '某商业地产公司',
    project_scale: '10万平方米',
    energy_savings: 30,
    cost_savings: 150000,
    implementation_time: '6个月',
    location: {
      province: '北京市',
      city: '北京市',
      address: '朝阳区某某路123号'
    },
    products_used: ['1', '2'],
    status: 'published',
    view_count: 5623,
    like_count: 156,
    author_id: '1',
    author_name: '张工程师',
    created_at: '2024-01-12T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: '工厂高温热泵应用案例',
    description: '工业高温热泵在制造业的成功应用',
    content: '工厂改造详情...',
    cover_image: '/images/case2.jpg',
    images: ['/images/case2-1.jpg'],
    category: '工业建筑',
    tags: ['工业热泵', '高温应用', '制造业'],
    client_name: '某制造企业',
    project_scale: '5万平方米',
    energy_savings: 25,
    cost_savings: 80000,
    implementation_time: '4个月',
    location: {
      province: '广东省',
      city: '深圳市'
    },
    products_used: ['3'],
    status: 'featured',
    view_count: 3892,
    like_count: 98,
    author_id: '2',
    author_name: '李工程师',
    created_at: '2024-01-08T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  }
];

export default function ContentManagementPage() {
  const { hasPermission } = useAdmin();
  const [articles, setArticles] = useState<Article[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // 加载内容数据
  const loadContent = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setArticles(mockArticles);
      setCases(mockCases);
      // setProducts(mockProducts);
    } catch (error) {
      console.error('Load content error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  // 筛选文章
  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchTerm || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // 筛选案例
  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = !searchTerm || 
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || caseItem.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDeleteArticle = (id: string) => {
    if (confirm('确定要删除这篇文章吗？')) {
      setArticles(prev => prev.filter(article => article.id !== id));
    }
  };

  const handleDeleteCase = (id: string) => {
    if (confirm('确定要删除这个案例吗？')) {
      setCases(prev => prev.filter(caseItem => caseItem.id !== id));
    }
  };

  const handlePublishArticle = (id: string) => {
    setArticles(prev => prev.map(article =>
      article.id === id 
        ? { ...article, status: 'published' as const, publish_at: new Date().toISOString() }
        : article
    ));
  };

  const handlePublishCase = (id: string) => {
    setCases(prev => prev.map(caseItem =>
      caseItem.id === id 
        ? { ...caseItem, status: 'published' as const }
        : caseItem
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'featured': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return '已发布';
      case 'draft': return '草稿';
      case 'featured': return '精选';
      case 'archived': return '已归档';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  if (!hasPermission(ADMIN_PERMISSIONS.CONTENT_VIEW)) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">无访问权限</h3>
        <p className="text-gray-600">您没有查看内容管理的权限</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">内容管理</h1>
          <p className="text-gray-600 mt-1">
            管理文章、案例和产品内容
          </p>
        </div>
        {hasPermission(ADMIN_PERMISSIONS.CONTENT_CREATE) && (
          <div className="flex gap-3">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              新建文章
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              新建案例
            </Button>
          </div>
        )}
      </div>

      {/* 内容统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">文章总数</p>
                <p className="text-2xl font-bold text-blue-600">{articles.length}</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    已发布 {articles.filter(a => a.status === 'published').length}
                  </span>
                </div>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">案例总数</p>
                <p className="text-2xl font-bold text-green-600">{cases.length}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-600">
                    精选 {cases.filter(c => c.status === 'featured').length}
                  </span>
                </div>
              </div>
              <Building className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总浏览量</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(articles.reduce((sum, a) => sum + a.view_count, 0) + 
                    cases.reduce((sum, c) => sum + c.view_count, 0)).toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-600">本月增长</span>
                </div>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总点赞数</p>
                <p className="text-2xl font-bold text-red-600">
                  {articles.reduce((sum, a) => sum + a.like_count, 0) + 
                   cases.reduce((sum, c) => sum + c.like_count, 0)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">用户喜爱</span>
                </div>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="articles">文章管理</TabsTrigger>
          <TabsTrigger value="cases">案例管理</TabsTrigger>
          <TabsTrigger value="products">产品管理</TabsTrigger>
        </TabsList>

        {/* 文章管理 */}
        <TabsContent value="articles" className="space-y-6">
          {/* 搜索和筛选 */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="搜索文章..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="published">已发布</SelectItem>
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="archived">已归档</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部分类</SelectItem>
                      <SelectItem value="技术分析">技术分析</SelectItem>
                      <SelectItem value="案例分享">案例分享</SelectItem>
                      <SelectItem value="行业动态">行业动态</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 文章列表 */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4">文章信息</th>
                      <th className="text-left py-3 px-4">分类</th>
                      <th className="text-left py-3 px-4">作者</th>
                      <th className="text-left py-3 px-4">状态</th>
                      <th className="text-left py-3 px-4">数据</th>
                      <th className="text-left py-3 px-4">发布时间</th>
                      <th className="text-left py-3 px-4">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((article) => (
                      <tr key={article.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-3">
                            {article.cover_image && (
                              <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <Image className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="font-medium line-clamp-1">{article.title}</div>
                              <div className="text-gray-500 text-xs line-clamp-2 mt-1">
                                {article.summary}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                {article.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{article.category}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{article.author_name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(article.status)}>
                            {getStatusLabel(article.status)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-xs space-y-1">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.view_count.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {article.like_count}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500">
                          {article.publish_at ? formatDate(article.publish_at) : '未发布'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {hasPermission(ADMIN_PERMISSIONS.CONTENT_UPDATE) && (
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            {article.status === 'draft' && hasPermission(ADMIN_PERMISSIONS.CONTENT_PUBLISH) && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => handlePublishArticle(article.id)}
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                            )}
                            {hasPermission(ADMIN_PERMISSIONS.CONTENT_DELETE) && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleDeleteArticle(article.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            )}
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

        {/* 案例管理 */}
        <TabsContent value="cases" className="space-y-6">
          {/* 搜索和筛选 */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="搜索案例..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="published">已发布</SelectItem>
                      <SelectItem value="featured">精选</SelectItem>
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="archived">已归档</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部分类</SelectItem>
                      <SelectItem value="商业建筑">商业建筑</SelectItem>
                      <SelectItem value="工业建筑">工业建筑</SelectItem>
                      <SelectItem value="住宅建筑">住宅建筑</SelectItem>
                      <SelectItem value="公共建筑">公共建筑</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 案例列表 */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4">案例信息</th>
                      <th className="text-left py-3 px-4">分类</th>
                      <th className="text-left py-3 px-4">项目规模</th>
                      <th className="text-left py-3 px-4">节能效果</th>
                      <th className="text-left py-3 px-4">状态</th>
                      <th className="text-left py-3 px-4">数据</th>
                      <th className="text-left py-3 px-4">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCases.map((caseItem) => (
                      <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <Building className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium line-clamp-1">{caseItem.title}</div>
                              <div className="text-gray-500 text-xs line-clamp-2 mt-1">
                                {caseItem.description}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {caseItem.location.province} {caseItem.location.city}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{caseItem.category}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-xs">
                            <div className="font-medium">{caseItem.project_scale}</div>
                            <div className="text-gray-500">{caseItem.implementation_time}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-xs">
                            <div className="flex items-center gap-1 text-green-600">
                              <TrendingUp className="w-3 h-3" />
                              节能 {caseItem.energy_savings}%
                            </div>
                            <div className="text-gray-500 mt-1">
                              节省 ¥{caseItem.cost_savings.toLocaleString()}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(caseItem.status)}>
                            {getStatusLabel(caseItem.status)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-xs space-y-1">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {caseItem.view_count.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {caseItem.like_count}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {hasPermission(ADMIN_PERMISSIONS.CONTENT_UPDATE) && (
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            {caseItem.status === 'published' && hasPermission(ADMIN_PERMISSIONS.CONTENT_PUBLISH) && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => handlePublishCase(caseItem.id)}
                              >
                                <Star className="w-4 h-4 text-yellow-600" />
                              </Button>
                            )}
                            {hasPermission(ADMIN_PERMISSIONS.CONTENT_DELETE) && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleDeleteCase(caseItem.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            )}
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

        {/* 产品管理 */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">产品管理功能开发中</h3>
              <p className="text-gray-600 mb-6">产品内容管理功能即将上线</p>
              <Button asChild>
                <a href="/admin/products" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  访问现有产品管理
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

