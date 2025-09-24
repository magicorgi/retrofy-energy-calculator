"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Building, 
  MapPin, 
  Phone, 
  Mail,
  Save,
  ArrowLeft,
  Upload,
  Bell,
  Shield,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  INDUSTRIES, 
  REGIONS, 
  COMPANY_SIZES, 
  USER_ROLE_LABELS, 
  UserRole,
  UserProfile 
} from '@/types/user';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // 基本信息表单
  const [basicInfo, setBasicInfo] = useState({
    nickname: '',
    real_name: '',
    email: '',
    company: '',
    position: '',
    industry: '',
    region: '',
    role: 'individual' as UserRole
  });

  // 公司信息表单
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    size: '',
    website: '',
    address: '',
    business_license: ''
  });

  // 偏好设置
  const [preferences, setPreferences] = useState({
    notification_email: true,
    notification_sms: true,
    newsletter: true
  });

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      setBasicInfo({
        nickname: user.nickname || '',
        real_name: user.real_name || '',
        email: user.email || '',
        company: user.company || '',
        position: user.position || '',
        industry: user.industry || '',
        region: user.region || '',
        role: user.role || 'individual'
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">请先登录</h3>
            <p className="text-gray-600 mb-6">您需要登录后才能管理个人资料</p>
            <Link href="/auth/login">
              <Button className="bg-green-600 hover:bg-green-700">
                立即登录
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 保存基本信息
  const handleSaveBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await updateUser(basicInfo);
      setMessage({ type: 'success', text: '基本信息保存成功！' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : '保存失败，请重试' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 保存偏好设置
  const handleSavePreferences = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // 在实际应用中，这里会调用API保存偏好设置
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: '偏好设置保存成功！' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: '保存失败，请重试' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCompanyInfoChange = (field: string, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回用户中心
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">个人资料</h1>
            <p className="text-gray-600">管理您的个人信息和偏好设置</p>
          </div>
        </div>

        {/* 消息提示 */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="company">公司信息</TabsTrigger>
            <TabsTrigger value="preferences">偏好设置</TabsTrigger>
            <TabsTrigger value="security">安全设置</TabsTrigger>
          </TabsList>

          {/* 基本信息 */}
          <TabsContent value="basic" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  基本信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveBasicInfo} className="space-y-6">
                  {/* 头像上传 */}
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        更换头像
                      </Button>
                      <p className="text-sm text-gray-500 mt-1">
                        支持JPG、PNG格式，文件大小不超过2MB
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 昵称 */}
                    <div className="space-y-2">
                      <Label htmlFor="nickname">昵称 *</Label>
                      <Input
                        id="nickname"
                        value={basicInfo.nickname}
                        onChange={(e) => handleInputChange('nickname', e.target.value)}
                        placeholder="请输入昵称"
                        required
                      />
                    </div>

                    {/* 真实姓名 */}
                    <div className="space-y-2">
                      <Label htmlFor="real_name">真实姓名</Label>
                      <Input
                        id="real_name"
                        value={basicInfo.real_name}
                        onChange={(e) => handleInputChange('real_name', e.target.value)}
                        placeholder="请输入真实姓名"
                      />
                    </div>

                    {/* 手机号（只读） */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">手机号</Label>
                      <Input
                        id="phone"
                        value={user?.phone || ''}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">手机号不可修改</p>
                    </div>

                    {/* 邮箱 */}
                    <div className="space-y-2">
                      <Label htmlFor="email">邮箱</Label>
                      <Input
                        id="email"
                        type="email"
                        value={basicInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="请输入邮箱地址"
                      />
                    </div>

                    {/* 用户角色 */}
                    <div className="space-y-2">
                      <Label>用户类型</Label>
                      <Select value={basicInfo.role} onValueChange={(value) => handleInputChange('role', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(USER_ROLE_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 职位 */}
                    <div className="space-y-2">
                      <Label htmlFor="position">职位</Label>
                      <Input
                        id="position"
                        value={basicInfo.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        placeholder="请输入职位"
                      />
                    </div>

                    {/* 公司名称 */}
                    <div className="space-y-2">
                      <Label htmlFor="company">公司名称</Label>
                      <Input
                        id="company"
                        value={basicInfo.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="请输入公司名称"
                      />
                    </div>

                    {/* 行业 */}
                    <div className="space-y-2">
                      <Label>所属行业 *</Label>
                      <Select value={basicInfo.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择行业" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map(industry => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 地区 */}
                    <div className="space-y-2">
                      <Label>所在地区 *</Label>
                      <Select value={basicInfo.region} onValueChange={(value) => handleInputChange('region', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择地区" />
                        </SelectTrigger>
                        <SelectContent>
                          {REGIONS.map(region => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          保存中...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          保存基本信息
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 公司信息 */}
          <TabsContent value="company" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  公司信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 公司名称 */}
                    <div className="space-y-2">
                      <Label htmlFor="company_name">公司名称</Label>
                      <Input
                        id="company_name"
                        value={companyInfo.name}
                        onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                        placeholder="请输入公司全称"
                      />
                    </div>

                    {/* 公司规模 */}
                    <div className="space-y-2">
                      <Label>公司规模</Label>
                      <Select value={companyInfo.size} onValueChange={(value) => handleCompanyInfoChange('size', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择公司规模" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPANY_SIZES.map(size => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 公司网站 */}
                    <div className="space-y-2">
                      <Label htmlFor="website">公司网站</Label>
                      <Input
                        id="website"
                        type="url"
                        value={companyInfo.website}
                        onChange={(e) => handleCompanyInfoChange('website', e.target.value)}
                        placeholder="https://www.example.com"
                      />
                    </div>

                    {/* 营业执照 */}
                    <div className="space-y-2">
                      <Label htmlFor="business_license">营业执照号</Label>
                      <Input
                        id="business_license"
                        value={companyInfo.business_license}
                        onChange={(e) => handleCompanyInfoChange('business_license', e.target.value)}
                        placeholder="请输入营业执照号"
                      />
                    </div>
                  </div>

                  {/* 公司地址 */}
                  <div className="space-y-2">
                    <Label htmlFor="address">公司地址</Label>
                    <Input
                      id="address"
                      value={companyInfo.address}
                      onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                      placeholder="请输入详细地址"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          保存中...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          保存公司信息
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 偏好设置 */}
          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  偏好设置
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">通知设置</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">邮件通知</div>
                          <div className="text-sm text-gray-600">接收重要信息和更新的邮件通知</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.notification_email}
                          onChange={(e) => handlePreferenceChange('notification_email', e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">短信通知</div>
                          <div className="text-sm text-gray-600">接收验证码和重要提醒的短信</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.notification_sms}
                          onChange={(e) => handlePreferenceChange('notification_sms', e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">订阅邮件</div>
                          <div className="text-sm text-gray-600">接收产品更新和行业资讯</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.newsletter}
                          onChange={(e) => handlePreferenceChange('newsletter', e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSavePreferences}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          保存中...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          保存偏好设置
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 安全设置 */}
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  安全设置
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">手机号验证</div>
                        <div className="text-sm text-gray-600">
                          当前绑定手机号：{user?.phone}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-600">已验证</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">邮箱验证</div>
                        <div className="text-sm text-gray-600">
                          {basicInfo.email ? `当前邮箱：${basicInfo.email}` : '未设置邮箱'}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        {basicInfo.email ? '重新验证' : '绑定邮箱'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">登录密码</div>
                        <div className="text-sm text-gray-600">
                          定期更换密码可以提高账户安全性
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        修改密码
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">账户注销</div>
                        <div className="text-sm text-gray-600">
                          注销后所有数据将被永久删除
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                        注销账户
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}





