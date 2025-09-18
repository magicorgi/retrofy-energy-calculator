"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  MessageSquare,
  Home,
  User,
  ArrowRight,
  Briefcase
} from 'lucide-react';

export default function AppointmentSuccessPage() {
  // 模拟预约信息
  const appointmentInfo = {
    id: 'APT' + Date.now().toString().slice(-6),
    service_type: '咨询服务',
    project_name: '某商业综合体节能改造',
    estimated_match_time: '24小时内',
    next_steps: [
      '我们的专家团队正在为您匹配最合适的服务商',
      '匹配完成后，将通过短信和邮件通知您',
      '服务商将在48小时内主动联系您',
      '您可以在用户中心查看预约进度'
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* 成功提示 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">预约提交成功！</h1>
          <p className="text-gray-600">
            您的预约请求已成功提交，我们将尽快为您匹配合适的服务商
          </p>
        </div>

        {/* 预约信息卡片 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              预约信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">预约编号: </span>
                <span className="font-medium font-mono">{appointmentInfo.id}</span>
              </div>
              <div>
                <span className="text-gray-600">服务类型: </span>
                <span className="font-medium">{appointmentInfo.service_type}</span>
              </div>
              <div>
                <span className="text-gray-600">项目名称: </span>
                <span className="font-medium">{appointmentInfo.project_name}</span>
              </div>
              <div>
                <span className="text-gray-600">预计匹配时间: </span>
                <span className="font-medium text-green-600">{appointmentInfo.estimated_match_time}</span>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">接下来会发生什么？</span>
              </div>
              <div className="space-y-2">
                {appointmentInfo.next_steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-blue-800">
                    <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 联系方式卡片 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              需要帮助？
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">客服热线</div>
                  <div className="text-sm text-gray-600">400-123-4567</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">邮件咨询</div>
                  <div className="text-sm text-gray-600">service@retrofy.com</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <MessageSquare className="w-4 h-4" />
                <span className="font-medium text-sm">
                  工作时间：周一至周五 9:00-18:00，我们会在工作时间内优先处理您的预约
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <User className="w-4 h-4 mr-2" />
              查看预约状态
            </Link>
          </Button>
          
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              返回首页
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/appointment">
              <Calendar className="w-4 h-4 mr-2" />
              再次预约
            </Link>
          </Button>
        </div>

        {/* 相关推荐 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">您可能还感兴趣</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/calculator" className="group">
                <div className="p-4 border rounded-lg hover:border-green-500 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium group-hover:text-green-600">节能计算器</span>
                  </div>
                  <p className="text-sm text-gray-600">预先计算改造效果</p>
                </div>
              </Link>
              
              <Link href="/cases" className="group">
                <div className="p-4 border rounded-lg hover:border-green-500 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium group-hover:text-green-600">成功案例</span>
                  </div>
                  <p className="text-sm text-gray-600">查看相似项目案例</p>
                </div>
              </Link>
              
              <Link href="/products" className="group">
                <div className="p-4 border rounded-lg hover:border-green-500 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium group-hover:text-green-600">产品推荐</span>
                  </div>
                  <p className="text-sm text-gray-600">浏览节能设备产品</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 底部提示 */}
        <div className="text-center mt-8 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800 text-sm">
            🎉 感谢您选择我们的服务！我们承诺为您提供专业、高效的节能改造解决方案
          </p>
        </div>
      </div>
    </div>
  );
}
