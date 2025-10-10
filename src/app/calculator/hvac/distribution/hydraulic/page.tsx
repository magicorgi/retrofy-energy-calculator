import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Settings, 
  ArrowLeft, 
  ChevronRight, 
  Activity,
  Gauge,
  BarChart3
} from "lucide-react"

export default function HydraulicCalculatorPage() {
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
                暖通空调节能改造
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/calculator/hvac/distribution" className="hover:text-blue-600 transition-colors">
                输配系统
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">水力平衡计算器</span>
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
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">水力平衡系统优化计算器</h1>
              <Badge className="ml-3 bg-green-600">即将上线</Badge>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              暖通空调水系统水力平衡分析与优化设计工具
            </p>
          </div>

          {/* 功能预览 */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  水力计算
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 管网阻力计算</li>
                  <li>• 流量分配分析</li>
                  <li>• 压力损失评估</li>
                  <li>• 系统特性曲线</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gauge className="w-5 h-5 text-green-600" />
                  平衡阀选型
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 静态平衡阀</li>
                  <li>• 动态平衡阀</li>
                  <li>• 压差控制阀</li>
                  <li>• 温控平衡阀</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-purple-600" />
                  系统优化
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 管径优化设计</li>
                  <li>• 分区控制策略</li>
                  <li>• 能耗分析优化</li>
                  <li>• 调试方案制定</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 开发中提示 */}
          <Card className="text-center py-12 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent>
              <Settings className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">水力平衡计算器开发中</h3>
              <p className="text-gray-600 mb-6">
                我们正在开发专业的水力平衡计算工具，将包含完整的水力计算和平衡阀选型功能
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/calculator/hvac/source/chiller">
                    体验主机计算器
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/appointment?service=hydraulic">
                    预约水力专家咨询
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 技术特点 */}
          <Card>
            <CardHeader>
              <CardTitle>水力平衡技术优势</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">系统效果</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 流量分配均匀</li>
                    <li>• 温度控制精确</li>
                    <li>• 消除水力失调</li>
                    <li>• 提高换热效率</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">节能效益</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 水泵能耗降低10-20%</li>
                    <li>• 主机效率提升5-15%</li>
                    <li>• 减少过量供给</li>
                    <li>• 延长设备寿命</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 应用场景 */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">水力平衡应用场景</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">大型建筑</div>
                  <div className="text-sm text-gray-600">办公楼、商场</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">工业厂房</div>
                  <div className="text-sm text-gray-600">生产车间</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">医院学校</div>
                  <div className="text-sm text-gray-600">公共建筑</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">住宅小区</div>
                  <div className="text-sm text-gray-600">集中供暖</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 技术原理 */}
          <Card>
            <CardHeader>
              <CardTitle>水力平衡基本原理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">静态水力平衡</h4>
                  <p className="text-sm text-gray-600">
                    通过调节各支路阻力，使设计流量下各支路压力损失相等，确保流量按设计分配
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">动态水力平衡</h4>
                  <p className="text-sm text-gray-600">
                    在系统运行过程中自动调节，保持各支路压差稳定，适应负荷变化
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">智能控制平衡</h4>
                  <p className="text-sm text-gray-600">
                    结合温度、流量传感器，实现精确的自动调节和优化控制
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









