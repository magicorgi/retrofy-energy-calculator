import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Fan, 
  ArrowLeft, 
  ChevronRight, 
  Wind,
  Thermometer,
  Settings
} from "lucide-react"

export default function TerminalCalculatorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* 面包屑导航 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/calculator" className="hover:text-blue-600 transition-colors">
                计算器
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/calculator/hvac" className="hover:text-blue-600 transition-colors">
                HVAC节能改造
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">末端使用改造</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/calculator/hvac">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回HVAC
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <Fan className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">末端使用节能改造计算器</h1>
              <Badge className="ml-3 bg-purple-600">规划中</Badge>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              末端设备是HVAC系统与用户直接接触的部分，包含风机盘管、新风系统、温控系统等，
              通过智能控制和设备优化可实现10-20%的节能效果
            </p>
          </div>

          {/* 规划中的计算器 */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wind className="w-5 h-5 text-blue-600" />
                  风机盘管优化
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 风机效率分析</li>
                  <li>• 盘管换热优化</li>
                  <li>• 变频控制改造</li>
                  <li>• 智能温控系统</li>
                </ul>
                <Badge className="mt-3 bg-blue-100 text-blue-700">规划中</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Fan className="w-5 h-5 text-green-600" />
                  新风系统优化
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 新风量需求计算</li>
                  <li>• 热回收器选型</li>
                  <li>• 变风量控制</li>
                  <li>• 空气质量监测</li>
                </ul>
                <Badge className="mt-3 bg-green-100 text-green-700">规划中</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5 text-purple-600" />
                  智能控制系统
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 温湿度精确控制</li>
                  <li>• 人体感应调节</li>
                  <li>• 时间程序控制</li>
                  <li>• 远程监控管理</li>
                </ul>
                <Badge className="mt-3 bg-purple-100 text-purple-700">规划中</Badge>
              </CardContent>
            </Card>
          </div>

          {/* 开发中提示 */}
          <Card className="text-center py-12 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent>
              <Fan className="w-16 h-16 mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">末端使用计算器规划中</h3>
              <p className="text-gray-600 mb-6">
                我们正在规划末端使用节能改造计算工具，将包含风机盘管、新风系统、智能控制等完整功能
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/calculator/hvac/source/chiller">
                    体验主机计算器
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/appointment?service=terminal">
                    预约末端专家咨询
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 技术特点 */}
          <Card>
            <CardHeader>
              <CardTitle>末端使用技术优势</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">节能潜力</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 风机变频控制：15-30%</li>
                    <li>• 智能温控系统：10-20%</li>
                    <li>• 新风热回收：20-40%</li>
                    <li>• 按需供冷供热：15-25%</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">舒适度提升</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 温度控制精度提高</li>
                    <li>• 湿度调节更精确</li>
                    <li>• 空气质量改善</li>
                    <li>• 噪音水平降低</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 发展规划 */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">末端使用计算器发展规划</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">风机盘管优化计算器</h4>
                    <p className="text-sm text-gray-600">预计2024年Q3上线</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">新风系统优化计算器</h4>
                    <p className="text-sm text-gray-600">预计2024年Q4上线</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">智能控制系统计算器</h4>
                    <p className="text-sm text-gray-600">预计2025年Q1上线</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}




