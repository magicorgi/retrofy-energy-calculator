import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Droplets, 
  Settings,
  ArrowRight,
  Clock,
  ChevronRight,
  ArrowLeft,
  Activity,
  Gauge
} from "lucide-react"

export default function DistributionCalculatorsPage() {
  const calculators = [
    {
      id: "pump",
      title: "水泵变频与匹配计算器",
      description: "水泵变频改造和系统匹配优化计算工具",
      icon: Droplets,
      features: ["变频节能计算", "水泵选型优化", "系统阻力分析", "运行策略优化"],
      difficulty: "中级",
      time: "8-12分钟",
      status: "coming_soon",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "hydraulic",
      title: "水力平衡系统优化计算器",
      description: "暖通空调水系统水力平衡分析与优化设计",
      icon: Settings,
      features: ["水力计算", "平衡阀选型", "系统优化", "能耗分析"],
      difficulty: "高级",
      time: "10-15分钟",
      status: "coming_soon",
      color: "from-green-500 to-blue-500"
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
                暖通空调节能改造
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">输配系统改造</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/calculator/hvac">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回暖通空调
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">输配系统节能改造计算器</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              输配系统是暖通空调系统的&quot;血管&quot;，负责冷热量的传输分配，
              通过水泵变频、水力平衡等技术手段，可实现15-25%的节能效果
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">20%</div>
              <div className="text-sm text-gray-600">平均节能率</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">2.5年</div>
              <div className="text-sm text-gray-600">平均回收期</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">2个</div>
              <div className="text-sm text-gray-600">计划工具</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">500+</div>
              <div className="text-sm text-gray-600">成功案例</div>
            </div>
          </div>

          {/* Calculators Grid */}
          <div className="grid md:grid-cols-2 gap-6">
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
                          <Badge variant="outline">即将上线</Badge>
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
                    
                    <Button className="w-full" variant="outline" disabled>
                      即将上线
                      <Clock className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Technology Overview */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6 text-center">输配系统技术对比</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <Activity className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <h4 className="font-medium mb-2">水泵变频技术</h4>
                  <p className="text-sm text-gray-600">根据负荷变化调节水泵转速，节能20-50%</p>
                </div>
                <div className="text-center">
                  <Gauge className="w-8 h-8 mx-auto mb-3 text-green-600" />
                  <h4 className="font-medium mb-2">水力平衡技术</h4>
                  <p className="text-sm text-gray-600">优化系统流量分配，提高换热效率</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Development Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>开发计划</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">水泵变频计算器</h4>
                    <p className="text-sm text-gray-600">预计2024年Q2上线，包含变频节能分析、水泵选型等功能</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">水力平衡计算器</h4>
                    <p className="text-sm text-gray-600">预计2024年Q3上线，包含水力计算、平衡阀选型等功能</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">需要专业指导？</h3>
              <p className="text-gray-600 mb-6">
                我们的输配系统专家团队可以为您提供个性化的改造方案咨询
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/cases?category=distribution">
                    查看输配案例
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/appointment?service=distribution">
                    预约输配专家
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

