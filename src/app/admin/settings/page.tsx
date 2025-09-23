"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Settings,
  Save,
  RotateCcw,
  Database,
  Mail,
  Bell,
  Shield,
  Globe,
  Palette,
  Code,
  Server,
  Key,
  AlertTriangle,
  CheckCircle,
  Info,
  Upload
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { ADMIN_PERMISSIONS } from '@/types/admin';

// 系统配置接口
interface SystemConfig {
  // 基本设置
  site_name: string;
  site_description: string;
  site_keywords: string;
  admin_email: string;
  support_phone: string;
  
  // 邮件设置
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_encryption: string;
  
  // 短信设置
  sms_provider: string;
  sms_api_key: string;
  sms_signature: string;
  
  // 微信设置
  wechat_app_id: string;
  wechat_app_secret: string;
  wechat_mch_id: string;
  
  // 系统设置
  user_registration: boolean;
  email_verification: boolean;
  sms_verification: boolean;
  content_review: boolean;
  
  // 缓存设置
  cache_enabled: boolean;
  cache_ttl: number;
  
  // 安全设置
  password_min_length: number;
  login_attempts_limit: number;
  session_timeout: number;
  
  // 文件上传设置
  max_file_size: number;
  allowed_file_types: string[];
  
  // API设置
  api_rate_limit: number;
  api_key_required: boolean;
}

// 模拟系统配置数据
const mockSystemConfig: SystemConfig = {
  site_name: 'Retrofy 节能改造平台',
  site_description: '专业的建筑节能改造计算工具和解决方案平台',
  site_keywords: '节能改造,热泵,冷水机组,建筑节能,暖通空调',
  admin_email: 'admin@retrofy.com',
  support_phone: '400-123-4567',
  
  smtp_host: 'smtp.example.com',
  smtp_port: 587,
  smtp_username: 'noreply@retrofy.com',
  smtp_password: '********',
  smtp_encryption: 'tls',
  
  sms_provider: 'aliyun',
  sms_api_key: '********',
  sms_signature: 'Retrofy',
  
  wechat_app_id: '********',
  wechat_app_secret: '********',
  wechat_mch_id: '********',
  
  user_registration: true,
  email_verification: false,
  sms_verification: true,
  content_review: true,
  
  cache_enabled: true,
  cache_ttl: 3600,
  
  password_min_length: 6,
  login_attempts_limit: 5,
  session_timeout: 7200,
  
  max_file_size: 10,
  allowed_file_types: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
  
  api_rate_limit: 1000,
  api_key_required: false
};

export default function SystemSettingsPage() {
  const { hasPermission } = useAdmin();
  const [config, setConfig] = useState<SystemConfig>(mockSystemConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('basic');

  // 加载系统配置
  const loadConfig = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConfig(mockSystemConfig);
    } catch (error) {
      console.error('Load config error:', error);
      setMessage({ type: 'error', text: '加载配置失败' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // 保存配置
  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage({ type: 'success', text: '配置保存成功！' });
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败，请重试' });
    } finally {
      setIsSaving(false);
    }
  };

  // 重置配置
  const handleReset = () => {
    if (confirm('确定要重置所有配置吗？此操作不可撤销。')) {
      setConfig(mockSystemConfig);
      setMessage({ type: 'info', text: '配置已重置，请记得保存' });
    }
  };

  // 测试邮件配置
  const testEmailConfig = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage({ type: 'success', text: '邮件配置测试成功！' });
    } catch (error) {
      setMessage({ type: 'error', text: '邮件配置测试失败' });
    }
  };

  // 测试短信配置
  const testSmsConfig = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage({ type: 'success', text: '短信配置测试成功！' });
    } catch (error) {
      setMessage({ type: 'error', text: '短信配置测试失败' });
    }
  };

  const handleInputChange = (field: keyof SystemConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: keyof SystemConfig, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setConfig(prev => ({ ...prev, [field]: array }));
  };

  if (!hasPermission(ADMIN_PERMISSIONS.SYSTEM_CONFIG)) {
    return (
      <div className="text-center py-12">
        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">无访问权限</h3>
        <p className="text-gray-600">您没有查看系统设置的权限</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">加载配置中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">系统设置</h1>
          <p className="text-gray-600 mt-1">管理系统配置和参数</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            重置配置
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                保存配置
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 消息提示 */}
      {message.text && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : message.type === 'error'
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : message.type === 'error' ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <Info className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* 配置标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">基本设置</TabsTrigger>
          <TabsTrigger value="email">邮件配置</TabsTrigger>
          <TabsTrigger value="sms">短信配置</TabsTrigger>
          <TabsTrigger value="wechat">微信配置</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
          <TabsTrigger value="system">系统参数</TabsTrigger>
        </TabsList>

        {/* 基本设置 */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                网站基本信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>网站名称</Label>
                  <Input
                    value={config.site_name}
                    onChange={(e) => handleInputChange('site_name', e.target.value)}
                    placeholder="请输入网站名称"
                  />
                </div>
                <div>
                  <Label>管理员邮箱</Label>
                  <Input
                    type="email"
                    value={config.admin_email}
                    onChange={(e) => handleInputChange('admin_email', e.target.value)}
                    placeholder="admin@example.com"
                  />
                </div>
              </div>
              <div>
                <Label>网站描述</Label>
                <Textarea
                  value={config.site_description}
                  onChange={(e) => handleInputChange('site_description', e.target.value)}
                  placeholder="请输入网站描述"
                  rows={3}
                />
              </div>
              <div>
                <Label>关键词</Label>
                <Input
                  value={config.site_keywords}
                  onChange={(e) => handleInputChange('site_keywords', e.target.value)}
                  placeholder="用逗号分隔关键词"
                />
              </div>
              <div>
                <Label>客服电话</Label>
                <Input
                  value={config.support_phone}
                  onChange={(e) => handleInputChange('support_phone', e.target.value)}
                  placeholder="400-123-4567"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                功能开关
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">用户注册</div>
                    <div className="text-sm text-gray-600">允许新用户注册</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.user_registration}
                    onChange={(e) => handleInputChange('user_registration', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">邮箱验证</div>
                    <div className="text-sm text-gray-600">注册时验证邮箱</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.email_verification}
                    onChange={(e) => handleInputChange('email_verification', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">短信验证</div>
                    <div className="text-sm text-gray-600">登录时发送短信验证码</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.sms_verification}
                    onChange={(e) => handleInputChange('sms_verification', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">内容审核</div>
                    <div className="text-sm text-gray-600">发布内容需要审核</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.content_review}
                    onChange={(e) => handleInputChange('content_review', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 邮件配置 */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                SMTP 邮件配置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>SMTP 服务器</Label>
                  <Input
                    value={config.smtp_host}
                    onChange={(e) => handleInputChange('smtp_host', e.target.value)}
                    placeholder="smtp.example.com"
                  />
                </div>
                <div>
                  <Label>端口</Label>
                  <Input
                    type="number"
                    value={config.smtp_port}
                    onChange={(e) => handleInputChange('smtp_port', parseInt(e.target.value))}
                    placeholder="587"
                  />
                </div>
                <div>
                  <Label>用户名</Label>
                  <Input
                    value={config.smtp_username}
                    onChange={(e) => handleInputChange('smtp_username', e.target.value)}
                    placeholder="用户名或邮箱"
                  />
                </div>
                <div>
                  <Label>密码</Label>
                  <Input
                    type="password"
                    value={config.smtp_password}
                    onChange={(e) => handleInputChange('smtp_password', e.target.value)}
                    placeholder="SMTP 密码"
                  />
                </div>
                <div>
                  <Label>加密方式</Label>
                  <Select value={config.smtp_encryption} onValueChange={(value) => handleInputChange('smtp_encryption', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">无</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={testEmailConfig}>
                  <Mail className="w-4 h-4 mr-2" />
                  测试邮件配置
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 短信配置 */}
        <TabsContent value="sms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                短信服务配置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>短信服务商</Label>
                  <Select value={config.sms_provider} onValueChange={(value) => handleInputChange('sms_provider', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aliyun">阿里云</SelectItem>
                      <SelectItem value="tencent">腾讯云</SelectItem>
                      <SelectItem value="huawei">华为云</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={config.sms_api_key}
                    onChange={(e) => handleInputChange('sms_api_key', e.target.value)}
                    placeholder="短信服务 API Key"
                  />
                </div>
                <div>
                  <Label>短信签名</Label>
                  <Input
                    value={config.sms_signature}
                    onChange={(e) => handleInputChange('sms_signature', e.target.value)}
                    placeholder="短信签名"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={testSmsConfig}>
                  <Bell className="w-4 h-4 mr-2" />
                  测试短信配置
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 微信配置 */}
        <TabsContent value="wechat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                微信小程序/公众号配置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>App ID</Label>
                  <Input
                    value={config.wechat_app_id}
                    onChange={(e) => handleInputChange('wechat_app_id', e.target.value)}
                    placeholder="微信 App ID"
                  />
                </div>
                <div>
                  <Label>App Secret</Label>
                  <Input
                    type="password"
                    value={config.wechat_app_secret}
                    onChange={(e) => handleInputChange('wechat_app_secret', e.target.value)}
                    placeholder="微信 App Secret"
                  />
                </div>
                <div>
                  <Label>商户号</Label>
                  <Input
                    value={config.wechat_mch_id}
                    onChange={(e) => handleInputChange('wechat_mch_id', e.target.value)}
                    placeholder="微信支付商户号"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 安全设置 */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                安全参数
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>密码最小长度</Label>
                  <Input
                    type="number"
                    value={config.password_min_length}
                    onChange={(e) => handleInputChange('password_min_length', parseInt(e.target.value))}
                    min="4"
                    max="20"
                  />
                </div>
                <div>
                  <Label>登录失败次数限制</Label>
                  <Input
                    type="number"
                    value={config.login_attempts_limit}
                    onChange={(e) => handleInputChange('login_attempts_limit', parseInt(e.target.value))}
                    min="3"
                    max="10"
                  />
                </div>
                <div>
                  <Label>会话超时时间 (秒)</Label>
                  <Input
                    type="number"
                    value={config.session_timeout}
                    onChange={(e) => handleInputChange('session_timeout', parseInt(e.target.value))}
                    min="1800"
                    max="86400"
                  />
                </div>
                <div>
                  <Label>API 请求限制 (次/小时)</Label>
                  <Input
                    type="number"
                    value={config.api_rate_limit}
                    onChange={(e) => handleInputChange('api_rate_limit', parseInt(e.target.value))}
                    min="100"
                    max="10000"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">API 密钥验证</div>
                  <div className="text-sm text-gray-600">API 调用需要密钥验证</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.api_key_required}
                  onChange={(e) => handleInputChange('api_key_required', e.target.checked)}
                  className="rounded border-gray-300"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                文件上传设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>最大文件大小 (MB)</Label>
                  <Input
                    type="number"
                    value={config.max_file_size}
                    onChange={(e) => handleInputChange('max_file_size', parseInt(e.target.value))}
                    min="1"
                    max="100"
                  />
                </div>
                <div>
                  <Label>允许的文件类型</Label>
                  <Input
                    value={config.allowed_file_types.join(', ')}
                    onChange={(e) => handleArrayChange('allowed_file_types', e.target.value)}
                    placeholder="jpg, png, pdf, doc"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 系统参数 */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                缓存设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">启用缓存</div>
                  <div className="text-sm text-gray-600">启用系统缓存以提高性能</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.cache_enabled}
                  onChange={(e) => handleInputChange('cache_enabled', e.target.checked)}
                  className="rounded border-gray-300"
                />
              </div>
              {config.cache_enabled && (
                <div>
                  <Label>缓存过期时间 (秒)</Label>
                  <Input
                    type="number"
                    value={config.cache_ttl}
                    onChange={(e) => handleInputChange('cache_ttl', parseInt(e.target.value))}
                    min="60"
                    max="86400"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                系统信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">系统版本:</span>
                  <span className="ml-2 font-medium">v2.1.0</span>
                </div>
                <div>
                  <span className="text-gray-600">数据库版本:</span>
                  <span className="ml-2 font-medium">MySQL 8.0</span>
                </div>
                <div>
                  <span className="text-gray-600">PHP 版本:</span>
                  <span className="ml-2 font-medium">8.1.0</span>
                </div>
                <div>
                  <span className="text-gray-600">服务器:</span>
                  <span className="ml-2 font-medium">Nginx 1.20</span>
                </div>
                <div>
                  <span className="text-gray-600">运行时间:</span>
                  <span className="ml-2 font-medium">15天 8小时</span>
                </div>
                <div>
                  <span className="text-gray-600">磁盘使用:</span>
                  <span className="ml-2 font-medium">2.5GB / 20GB</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                危险操作
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">清空系统缓存</h4>
                <p className="text-red-700 text-sm mb-3">
                  清空所有系统缓存，可能会暂时影响系统性能
                </p>
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                  清空缓存
                </Button>
              </div>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">重启系统服务</h4>
                <p className="text-red-700 text-sm mb-3">
                  重启系统服务，所有用户将被断开连接
                </p>
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                  重启服务
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}



