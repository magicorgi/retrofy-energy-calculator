"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  MessageSquare, 
  Shield, 
  User, 
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithEmail, loginWithWeChat, sendVerificationCode, isLoading } = useAuth();
  
  // 手机号登录状态
  const [phoneData, setPhoneData] = useState({
    phone: '',
    verification_code: ''
  });
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [phoneError, setPhoneError] = useState('');
  const [codeError, setCodeError] = useState('');

  // 邮箱登录状态
  const [emailData, setEmailData] = useState({
    email: '',
    password: ''
  });
  const [emailError, setEmailError] = useState('');

  // 微信登录状态
  const [wechatLoading, setWechatLoading] = useState(false);

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

  // 发送验证码
  const handleSendCode = async () => {
    setPhoneError('');
    
    if (!phoneData.phone) {
      setPhoneError('请输入手机号');
      return;
    }
    
    if (!validatePhone(phoneData.phone)) {
      setPhoneError('请输入正确的手机号格式');
      return;
    }

    try {
      await sendVerificationCode({
        phone: phoneData.phone,
        type: 'login'
      });
      
      setCodeSent(true);
      setCountdown(60);
      
      // 开发环境提示
      if (process.env.NODE_ENV === 'development') {
        alert('开发模式：验证码为 123456');
      }
      
    } catch (error) {
      setPhoneError(error instanceof Error ? error.message : '发送验证码失败');
    }
  };

  // 手机号登录
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    setCodeError('');

    if (!phoneData.phone) {
      setPhoneError('请输入手机号');
      return;
    }

    if (!phoneData.verification_code) {
      setCodeError('请输入验证码');
      return;
    }

    try {
      await login(phoneData);
      router.push('/dashboard');
    } catch (error) {
      setCodeError(error instanceof Error ? error.message : '登录失败');
    }
  };

  // 邮箱登录处理
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    
    try {
      await loginWithEmail(emailData.email, emailData.password);
      router.push('/dashboard');
    } catch (error: any) {
      setEmailError(error.message || '登录失败，请重试');
    }
  };

  // 微信登录
  const handleWeChatLogin = async () => {
    setWechatLoading(true);
    
    try {
      // 在实际应用中，这里会跳转到微信授权页面
      // window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WECHAT_APPID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      
      // 模拟微信登录流程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await loginWithWeChat({
        code: 'mock_wechat_code_' + Date.now()
      });
      
      router.push('/dashboard');
      
    } catch (error) {
      alert(error instanceof Error ? error.message : '微信登录失败');
    } finally {
      setWechatLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            欢迎回来
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            登录您的账户
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>登录</CardTitle>
            <CardDescription>
              选择您偏好的登录方式
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="phone" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  手机登录
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  邮箱登录
                </TabsTrigger>
                <TabsTrigger value="wechat" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  微信登录
                </TabsTrigger>
              </TabsList>

              {/* 手机号登录 */}
              <TabsContent value="phone" className="space-y-4 mt-6">
                <form onSubmit={handlePhoneLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">手机号</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="请输入手机号"
                        className="pl-10"
                        value={phoneData.phone}
                        onChange={(e) => setPhoneData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    {phoneError && (
                      <div className="flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {phoneError}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code">验证码</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="code"
                          type="text"
                          placeholder="请输入验证码"
                          className="pl-10"
                          value={phoneData.verification_code}
                          onChange={(e) => setPhoneData(prev => ({ ...prev, verification_code: e.target.value }))}
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
                    {codeError && (
                      <div className="flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {codeError}
                      </div>
                    )}
                    {codeSent && !codeError && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        验证码已发送，请注意查收
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
                        登录中...
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4 mr-2" />
                        登录
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* 邮箱登录 */}
              <TabsContent value="email" className="space-y-4 mt-6">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱地址</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="请输入邮箱地址"
                        value={emailData.email}
                        onChange={(e) => setEmailData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-password">密码</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email-password"
                        type="password"
                        placeholder="请输入密码"
                        value={emailData.password}
                        onChange={(e) => setEmailData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {emailError && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{emailError}</span>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        登录中...
                      </div>
                    ) : (
                      '邮箱登录'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* 微信登录 */}
              <TabsContent value="wechat" className="space-y-4 mt-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">微信快捷登录</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    使用微信账号快速登录，享受便捷服务
                  </p>
                  
                  <Button
                    onClick={handleWeChatLogin}
                    disabled={wechatLoading}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    {wechatLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        微信登录中...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        微信登录
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Separator className="w-full" />
            
            <p className="text-center text-sm text-gray-600 w-full">
              还没有账户？{" "}
              <Link href="/auth/register" className="text-green-600 hover:text-green-500 font-medium">
                立即注册
              </Link>
            </p>
            
            <p className="text-center text-xs text-gray-500 w-full leading-relaxed">
              登录即表示您同意我们的{" "}
              <Link href="/terms" className="text-green-600 hover:text-green-500">
                服务条款
              </Link>{" "}
              和{" "}
              <Link href="/privacy" className="text-green-600 hover:text-green-500">
                隐私政策
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}