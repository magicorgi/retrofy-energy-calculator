"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone, 
  Shield, 
  User, 
  Building, 
  MapPin,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { INDUSTRIES, REGIONS, USER_ROLE_LABELS, UserRole } from '@/types/user';

export default function RegisterPage() {
  const router = useRouter();
  const { login, sendVerificationCode, isLoading } = useAuth();
  
  // 注册表单数据
  const [formData, setFormData] = useState({
    phone: '',
    verification_code: '',
    nickname: '',
    email: '', // 新增邮箱字段
    company: '',
    industry: '',
    region: '',
    role: 'individual' as UserRole
  });

  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 验证手机号格式
  const validatePhone = (phone: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // 验证邮箱格式
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.phone) {
      newErrors.phone = '请输入手机号';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = '请输入正确的手机号格式';
    }

    if (!formData.verification_code) {
      newErrors.verification_code = '请输入验证码';
    }

    if (!formData.nickname) {
      newErrors.nickname = '请输入昵称';
    }

    // 邮箱验证（可选）
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = '请输入正确的邮箱格式';
    }

    if (!formData.industry) {
      newErrors.industry = '请选择行业';
    }

    if (!formData.region) {
      newErrors.region = '请选择地区';
    }

    if (!agreed) {
      newErrors.agreement = '请同意服务条款和隐私政策';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 发送验证码
  const handleSendCode = async () => {
    setErrors(prev => ({ ...prev, phone: '' }));
    
    if (!formData.phone) {
      setErrors(prev => ({ ...prev, phone: '请输入手机号' }));
      return;
    }
    
    if (!validatePhone(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: '请输入正确的手机号格式' }));
      return;
    }

    try {
      await sendVerificationCode({
        phone: formData.phone,
        type: 'register'
      });
      
      setCodeSent(true);
      setCountdown(60);
      
      // 开发环境提示
      if (process.env.NODE_ENV === 'development') {
        alert('开发模式：验证码为 123456');
      }
      
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        phone: error instanceof Error ? error.message : '发送验证码失败' 
      }));
    }
  };

  // 注册
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // 在实际应用中，这里会调用注册API
      // 注册成功后自动登录，传递所有用户信息
      await login({
        phone: formData.phone,
        verification_code: formData.verification_code,
        nickname: formData.nickname,
        email: formData.email,
        company: formData.company,
        industry: formData.industry,
        region: formData.region,
        role: formData.role
      });
      
      router.push('/dashboard');
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        verification_code: error instanceof Error ? error.message : '注册失败'
      }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            创建账户
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            加入我们，开启节能之旅
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>注册</CardTitle>
            <CardDescription>
              填写以下信息完成注册
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* 手机号 */}
              <div className="space-y-2">
                <Label htmlFor="phone">手机号 *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="请输入手机号"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                {errors.phone && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </div>
                )}
              </div>

              {/* 验证码 */}
              <div className="space-y-2">
                <Label htmlFor="code">验证码 *</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="code"
                      type="text"
                      placeholder="请输入验证码"
                      className="pl-10"
                      value={formData.verification_code}
                      onChange={(e) => handleInputChange('verification_code', e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendCode}
                    disabled={countdown > 0 || isLoading}
                    className="whitespace-nowrap"
                  >
                    {countdown > 0 ? `${countdown}s` : codeSent ? '重新发送' : '获取验证码'}
                  </Button>
                </div>
                {errors.verification_code && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.verification_code}
                  </div>
                )}
                {codeSent && !errors.verification_code && (
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    验证码已发送，请注意查收
                  </div>
                )}
              </div>

              {/* 昵称 */}
              <div className="space-y-2">
                <Label htmlFor="nickname">昵称 *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="请输入昵称"
                    className="pl-10"
                    value={formData.nickname}
                    onChange={(e) => handleInputChange('nickname', e.target.value)}
                  />
                </div>
                {errors.nickname && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.nickname}
                  </div>
                )}
              </div>

              {/* 邮箱地址 */}
              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="请输入邮箱地址（选填）"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* 用户角色 */}
              <div className="space-y-2">
                <Label>用户类型</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
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

              {/* 公司名称（企业用户显示） */}
              {(formData.role === 'company' || formData.role === 'supplier' || formData.role === 'contractor') && (
                <div className="space-y-2">
                  <Label htmlFor="company">公司名称</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="company"
                      type="text"
                      placeholder="请输入公司名称"
                      className="pl-10"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* 行业 */}
              <div className="space-y-2">
                <Label>所属行业 *</Label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
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
                {errors.industry && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.industry}
                  </div>
                )}
              </div>

              {/* 地区 */}
              <div className="space-y-2">
                <Label>所在地区 *</Label>
                <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
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
                {errors.region && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.region}
                  </div>
                )}
              </div>

              {/* 同意条款 */}
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <input
                    id="agreement"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (errors.agreement) {
                        setErrors(prev => ({ ...prev, agreement: '' }));
                      }
                    }}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="agreement" className="text-sm leading-relaxed">
                    我已阅读并同意{" "}
                    <Link href="/terms" className="text-green-600 hover:text-green-500">
                      服务条款
                    </Link>{" "}
                    和{" "}
                    <Link href="/privacy" className="text-green-600 hover:text-green-500">
                      隐私政策
                    </Link>
                  </Label>
                </div>
                {errors.agreement && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.agreement}
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    注册中...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    立即注册
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-center text-sm text-gray-600 w-full">
              已有账户？{" "}
              <Link href="/auth/login" className="text-green-600 hover:text-green-500 font-medium">
                立即登录
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}