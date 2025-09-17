import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Recycle, 
  ArrowLeft, 
  ChevronRight, 
  Factory,
  Wind,
  Droplets
} from "lucide-react"

export default function WasteHeatCalculatorPage() {
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
              <Link href="/calculator/hvac/source" className="hover:text-blue-600 transition-colors">
                冷热源侧
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">余热回收计算器</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/calculator/hvac/source">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回冷热源
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">余热回收计算器</h1>
              <Badge className="ml-3 bg-green-600">即将上线</Badge>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              工业余热回收系统设计与节能效果计算工具
            </p>
          </div>

          {/* 功能预览 */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Factory className="w-5 h-5 text-orange-600" />
                  工业余热
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 锅炉烟气余热</li>
                  <li>• 工艺废热回收</li>
                  <li>• 压缩空气余热</li>
                  <li>• 冷却水余热利用</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wind className="w-5 h-5 text-blue-600" />
                  排风热回收
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 新风热回收器</li>
                  <li>• 排风能量回收</li>
                  <li>• 热交换器选型</li>
                  <li>• 系统集成设计</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Droplets className="w-5 h-5 text-purple-600" />
                  废水余热
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 生活热水预热</li>
                  <li>• 工艺用水加热</li>
                  <li>• 污水源热泵</li>
                  <li>• 热能梯级利用</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 开发中提示 */}
          <Card className="text-center py-12 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent>
              <Recycle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">余热回收计算器开发中</h3>
              <p className="text-gray-600 mb-6">
                我们正在开发专业的余热回收计算工具，将包含工业余热、排风热回收、废水余热等完整计算功能
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/calculator/hvac/source/chiller">
                    体验主机计算器
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/appointment?service=waste-heat">
                    预约余热专家咨询
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 技术特点 */}
          <Card>
            <CardHeader>
              <CardTitle>余热回收技术优势</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">节能潜力</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 工业余热回收率：60-80%</li>
                    <li>• 排风热回收率：70-90%</li>
                    <li>• 废水余热回收率：50-70%</li>
                    <li>• 综合节能率：20-40%</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">应用行业</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 钢铁、有色金属冶炼</li>
                    <li>• 石化、化工行业</li>
                    <li>• 建材、玻璃制造</li>
                    <li>• 纺织、印染行业</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 经济效益 */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">余热回收经济效益</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">30%</div>
                  <div className="text-sm text-gray-600">平均节能率</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">1.8年</div>
                  <div className="text-sm text-gray-600">平均回收期</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">40%</div>
                  <div className="text-sm text-gray-600">CO₂减排</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">15年</div>
                  <div className="text-sm text-gray-600">系统寿命</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

