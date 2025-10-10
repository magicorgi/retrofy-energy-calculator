import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Target, 
  ArrowLeft, 
  Lightbulb,
  Zap,
  TrendingUp,
  Users
} from "lucide-react"

export default function EcoMatchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">EcoMatch</h1>
              <Badge className="ml-3 bg-green-600">即将上线</Badge>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              智能节能方案匹配平台，基于AI技术为您精准匹配最适合的节能改造方案
            </p>
          </div>

          {/* 功能预览 */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  智能匹配
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• AI驱动的方案推荐</li>
                  <li>• 多维度匹配算法</li>
                  <li>• 个性化定制方案</li>
                  <li>• 实时方案优化</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  效果预测
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 节能效果预测</li>
                  <li>• 投资回收分析</li>
                  <li>• 风险评估</li>
                  <li>• 收益模拟</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                  专家协作
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 专家团队支持</li>
                  <li>• 在线咨询服务</li>
                  <li>• 方案评审</li>
                  <li>• 实施指导</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 开发中提示 */}
          <Card className="text-center py-12 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent>
              <Target className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">EcoMatch 开发中</h3>
              <p className="text-gray-600 mb-6">
                我们正在开发基于AI的智能节能方案匹配平台，将为您提供最精准的节能改造建议
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/calculator">
                    体验节能计算器
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/appointment?service=ecomatch">
                    预约产品演示
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 技术特点 */}
          <Card>
            <CardHeader>
              <CardTitle>EcoMatch 技术优势</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">AI智能算法</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 机器学习驱动的推荐引擎</li>
                    <li>• 大数据分析支持</li>
                    <li>• 持续学习优化</li>
                    <li>• 多因子综合评估</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">精准匹配</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 建筑特征识别</li>
                    <li>• 能耗模式分析</li>
                    <li>• 成本效益优化</li>
                    <li>• 实施可行性评估</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 应用场景 */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">EcoMatch 应用场景</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">办公楼</div>
                  <div className="text-sm text-gray-600">智能办公节能</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">工厂</div>
                  <div className="text-sm text-gray-600">工业节能改造</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">医院</div>
                  <div className="text-sm text-gray-600">医疗建筑节能</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">学校</div>
                  <div className="text-sm text-gray-600">教育建筑优化</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}









