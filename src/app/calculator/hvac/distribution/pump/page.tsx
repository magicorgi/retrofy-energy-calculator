import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Droplets, 
  ArrowLeft, 
  ChevronRight, 
  Activity,
  Gauge,
  Settings
} from "lucide-react"

export default function PumpCalculatorPage() {
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
              <Link href="/calculator/hvac/distribution" className="hover:text-blue-600 transition-colors">
                输配系统
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">水泵变频计算器</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/calculator/hvac/distribution">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回输配系统
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">水泵变频与匹配计算器</h1>
              <Badge className="ml-3 bg-blue-600">即将上线</Badge>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              水泵变频改造和系统匹配优化计算工具
            </p>
          </div>

          {/* 功能预览 */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                  变频节能分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 负荷特性分析</li>
                  <li>• 变频器选型</li>
                  <li>• 节能效果计算</li>
                  <li>• 投资回收分析</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gauge className="w-5 h-5 text-green-600" />
                  水泵选型优化
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 工况点分析</li>
                  <li>• 效率曲线匹配</li>
                  <li>• 并联运行优化</li>
                  <li>• 备用策略设计</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5 text-purple-600" />
                  系统集成
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 控制策略优化</li>
                  <li>• 监控系统集成</li>
                  <li>• 故障诊断</li>
                  <li>• 维护计划制定</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 开发中提示 */}
          <Card className="text-center py-12 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent>
              <Droplets className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">水泵变频计算器开发中</h3>
              <p className="text-gray-600 mb-6">
                我们正在开发专业的水泵变频改造计算工具，将包含完整的变频节能分析和水泵选型功能
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/calculator/hvac/source/chiller">
                    体验主机计算器
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/appointment?service=pump">
                    预约水泵专家咨询
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 技术特点 */}
          <Card>
            <CardHeader>
              <CardTitle>水泵变频技术优势</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">节能效果</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 变频调速节能：20-50%</li>
                    <li>• 软启动减少冲击</li>
                    <li>• 精确流量控制</li>
                    <li>• 延长设备寿命</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">适用场景</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 负荷变化较大的系统</li>
                    <li>• 多台水泵并联运行</li>
                    <li>• 24小时连续运行系统</li>
                    <li>• 精确控制要求高的场合</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 计算原理 */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">水泵变频节能原理</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-blue-600 mb-2">立方关系定律</div>
                  <div className="text-sm text-gray-600">功率与转速三次方成正比</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600 mb-2">流量调节</div>
                  <div className="text-sm text-gray-600">根据需求精确调节流量</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-600 mb-2">系统优化</div>
                  <div className="text-sm text-gray-600">整体系统效率提升</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}




