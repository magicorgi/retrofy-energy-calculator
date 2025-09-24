"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  ClipboardList, 
  Users, 
  ArrowRight,
  Settings,
  Shield,
  Clock,
  FileText,
  UserCheck
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useAdmin } from "@/contexts/AdminContext"

export default function ToolsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const { isAdmin } = useAdmin()

  useEffect(() => {
    // 等待认证状态初始化
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // 如果正在加载，显示加载状态
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

  // 如果未登录，显示登录提示
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">需要登录</CardTitle>
            <CardDescription>
              请先登录您的账号以访问小工具
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  立即登录
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/register">
                  免费注册
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 如果不是管理员，显示权限不足提示
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">权限不足</CardTitle>
            <CardDescription>
              您没有权限访问小工具，请联系管理员
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                返回首页
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 小工具列表
  const tools = [
    {
      id: "demand-collection",
      title: "需求收集工具",
      description: "收集节能改造需求，包括工厂调研、建筑调研等不同类型的调研表单",
      icon: ClipboardList,
      href: "/demand-collection",
      features: [
        "工厂基本情况调研",
        "建筑基本情况调研", 
        "能耗设备信息收集",
        "能耗数据分析"
      ],
      difficulty: "简单",
      time: "10-15分钟",
      color: "from-blue-500 to-cyan-500",
      badge: "调研工具"
    },
    {
      id: "customer-visit",
      title: "客户拜访工具",
      description: "记录客户拜访中的关键信息，包括商务关系、采购信息、设备信息等",
      icon: Users,
      href: "/customer-visit",
      features: [
        "商务关系记录",
        "采购信息管理",
        "设备基本信息",
        "供应商信息跟踪",
        "机会信息收集"
      ],
      difficulty: "中等",
      time: "15-20分钟",
      color: "from-green-500 to-emerald-500",
      badge: "拜访工具"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">小工具</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            专业的管理工具集合，帮助您高效完成调研、拜访等管理工作
          </p>
        </div>

        {/* 工具列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {tools.map((tool) => (
            <Card key={tool.id} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${tool.color} opacity-10 rounded-bl-full`} />
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center`}>
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {tool.badge}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-3">
                  {tool.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* 功能特点 */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">主要功能</h4>
                  <div className="flex flex-wrap gap-1">
                    {tool.features.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 工具信息 */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{tool.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{tool.difficulty}</span>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href={tool.href}>
                    <tool.icon className="w-4 h-4 mr-2" />
                    开始使用
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 使用说明 */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5" />
                <span>使用说明</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">需求收集工具</h4>
                  <p>用于收集客户节能改造需求，支持工厂和建筑两种调研类型。包含基本信息收集、能耗设备调研、能耗数据分析等模块。</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">客户拜访工具</h4>
                  <p>用于记录客户拜访过程中的关键信息，包括商务关系、采购流程、设备信息、供应商信息、机会信息等六个方面。</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-blue-800">
                    <strong>提示：</strong>所有工具数据都会安全保存，只有管理员可以访问和查看。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
