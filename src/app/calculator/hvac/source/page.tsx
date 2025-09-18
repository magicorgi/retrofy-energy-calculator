import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Thermometer, 
  Zap, 
  Recycle,
  ArrowRight,
  Calculator,
  TrendingDown,
  Clock,
  ChevronRight,
  ArrowLeft,
  Factory
} from "lucide-react"

export default function SourceCalculatorsPage() {
  const calculators = [
    {
      id: "chiller",
      title: "高效主机选型计算器 Pro",
      description: "不同冷水机组节能改造效果计算",
      icon: Thermometer,
      features: ["分段效率计算", "智能主机推荐", "投资回收分析", "碳减排评估"],
      difficulty: "专业级",
      time: "5-10分钟",
      status: "available",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "heat-pump",
      title: "热泵系统计算器",
      description: "空气源/地源热泵系统节能改造计算与选型",
      icon: Zap,
      features: ["热泵选型", "能效比计算", "运行成本分析", "环境适应性"],
      difficulty: "高级",
      time: "8-12分钟",
      status: "available",
      color: "from-orange-500 to-red-500"
    },
    {
      id: "industrial-heat-pump",
      title: "工业高温热泵计算器",
      description: "85-150℃工业高温热泵系统节能改造计算",
      icon: Factory,
      features: ["高温工艺适配", "COP修正计算", "NPV/IRR分析", "碳交易收益"],
      difficulty: "专家级",
      time: "10-15分钟",
      status: "available",
      color: "from-purple-500 to-pink-500",
      new: true
    },
    {
      id: "waste-heat",
      title: "余热回收计算器",
      description: "工业余热回收系统设计与节能效果计算",
      icon: Recycle,
      features: ["余热量计算", "回收设备选型", "系统集成设计", "经济性分析"],
      difficulty: "专业级",
      time: "10-15分钟",
      status: "coming_soon",
      color: "from-green-500 to-emerald-500"
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "初级": return "bg-green-100 text-green-700"
      case "中级": return "bg-yellow-100 text-yellow-700"
      case "高级": return "bg-red-100 text-red-700"
      case "专业级": return "bg-purple-100 text-purple-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-600">可用</Badge>
      case "coming_soon":
        return <Badge variant="outline">即将上线</Badge>
      case "beta":
        return <Badge className="bg-blue-600">测试版</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-8">
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
              <span className="text-gray-900 font-medium">冷热源侧改造</span>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">冷热源侧节能改造计算器</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              冷热源设备是HVAC系统的核心，通常占整个系统能耗的60-70%，
              是节能改造的重点环节，平均可实现25-40%的节能效果
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">35%</div>
              <div className="text-sm text-gray-600">平均节能率</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">2.2年</div>
              <div className="text-sm text-gray-600">平均回收期</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">4个</div>
              <div className="text-sm text-gray-600">计算工具</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">800+</div>
              <div className="text-sm text-gray-600">成功案例</div>
            </div>
          </div>

          {/* Calculators Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.map((calculator) => (
              <Card key={calculator.id} className="hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${calculator.color} opacity-10 rounded-bl-full`} />
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${calculator.color} flex items-center justify-center`}>
                        <calculator.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {calculator.title}
                          {getStatusBadge(calculator.status)}
                        </CardTitle>
                        <CardDescription>{calculator.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Badge className={getDifficultyColor(calculator.difficulty)}>
                      {calculator.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {calculator.time}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">核心功能：</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {calculator.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {calculator.status === "available" ? (
                      <Button className="w-full" asChild>
                        <Link href={`/calculator/hvac/source/${calculator.id}`}>
                          开始计算
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    ) : (
                      <Button className="w-full" variant="outline" disabled>
                        即将上线
                        <Clock className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Technology Overview */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6 text-center">冷热源技术对比</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Thermometer className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <h4 className="font-medium mb-2">高效主机</h4>
                  <p className="text-sm text-gray-600">磁悬浮、变频离心机组，COP提升30-50%</p>
                </div>
                <div className="text-center">
                  <Zap className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                  <h4 className="font-medium mb-2">热泵系统</h4>
                  <p className="text-sm text-gray-600">空气源、地源热泵，可再生能源利用</p>
                </div>
                <div className="text-center">
                  <Recycle className="w-8 h-8 mx-auto mb-3 text-green-600" />
                  <h4 className="font-medium mb-2">余热回收</h4>
                  <p className="text-sm text-gray-600">工业余热、排风热回收，能源循环利用</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">需要专业指导？</h3>
              <p className="text-gray-600 mb-6">
                我们的冷热源专家团队可以为您提供个性化的改造方案咨询
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/cases?category=source">
                    查看冷热源案例
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/appointment?service=source">
                    预约冷热源专家
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
