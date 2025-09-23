import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Zap, 
  ArrowLeft, 
  ChevronRight, 
  Lightbulb,
  Sun,
  Smartphone
} from "lucide-react"

export default function LightingCalculatorsPage() {
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
              <span className="text-gray-900 font-medium">照明系统改造</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/calculator">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回计算器
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">照明系统节能改造计算器</h1>
              <Badge className="ml-3 bg-yellow-600">规划中</Badge>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              照明系统通常占建筑总能耗的20-30%，通过LED改造和智能控制系统，
              可实现50-80%的照明节能效果
            </p>
          </div>

          {/* 规划中的计算器 */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  LED改造计算器
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 传统灯具替换分析</li>
                  <li>• LED灯具选型</li>
                  <li>• 照度计算验证</li>
                  <li>• 投资回收分析</li>
                </ul>
                <Badge className="mt-3 bg-yellow-100 text-yellow-700">规划中</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sun className="w-5 h-5 text-orange-600" />
                  自然采光优化
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 采光系数计算</li>
                  <li>• 导光管系统设计</li>
                  <li>• 光伏一体化方案</li>
                  <li>• 眩光控制分析</li>
                </ul>
                <Badge className="mt-3 bg-orange-100 text-orange-700">规划中</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  智能照明控制
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 人体感应控制</li>
                  <li>• 光照度自动调节</li>
                  <li>• 时间程序控制</li>
                  <li>• 远程监控管理</li>
                </ul>
                <Badge className="mt-3 bg-blue-100 text-blue-700">规划中</Badge>
              </CardContent>
            </Card>
          </div>

          {/* 开发中提示 */}
          <Card className="text-center py-12 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent>
              <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">照明系统计算器规划中</h3>
              <p className="text-gray-600 mb-6">
                我们正在规划照明系统节能改造计算工具，将包含LED改造、自然采光、智能控制等完整功能
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/calculator/hvac/source/chiller">
                    体验暖通空调计算器
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/appointment?service=lighting">
                    预约照明专家咨询
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 技术特点 */}
          <Card>
            <CardHeader>
              <CardTitle>照明系统节能技术</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">LED技术优势</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 能效比传统灯具高5-8倍</li>
                    <li>• 使用寿命长达50000小时</li>
                    <li>• 无频闪，光质量好</li>
                    <li>• 可调光调色温</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">智能控制效果</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 人体感应节能：30-50%</li>
                    <li>• 光照度调节：20-40%</li>
                    <li>• 时间程序控制：15-30%</li>
                    <li>• 分区域控制：25-45%</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 应用场景 */}
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">照明改造应用场景</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">办公楼</div>
                  <div className="text-sm text-gray-600">智能办公照明</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">工厂</div>
                  <div className="text-sm text-gray-600">工业照明改造</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">商场</div>
                  <div className="text-sm text-gray-600">商业照明优化</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">学校</div>
                  <div className="text-sm text-gray-600">教育照明升级</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}






