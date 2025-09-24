import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Thermometer, 
  Droplets, 
  Fan, 
  ArrowRight,
  Zap,
  Settings,
  Recycle,
  Clock,
  Wind,
  Factory
} from "lucide-react"

export default function HVACCalculatorPage() {
  const allCalculators = [
    // 冷热源侧计算器
    {
      id: "chiller",
      title: "高效主机选型计算器 Pro",
      description: "不同冷水机组节能改造效果计算",
      icon: Thermometer,
      features: ["分段效率计算", "智能主机推荐", "投资回收分析", "碳减排评估"],
      difficulty: "专业级",
      time: "5-10分钟",
      category: "冷热源侧",
      categoryPath: "source",
      status: "available",
      color: "from-blue-500 to-cyan-500",
      new: true
    },
    {
      id: "heat-pump",
      title: "热泵系统计算器",
      description: "空气源/地源热泵系统节能改造计算与选型",
      icon: Zap,
      features: ["热泵选型", "能效比计算", "运行成本分析", "环境适应性"],
      difficulty: "高级",
      time: "8-12分钟",
      category: "冷热源侧",
      categoryPath: "source",
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
      category: "冷热源侧",
      categoryPath: "source",
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
      category: "冷热源侧",
      categoryPath: "source",
      status: "coming_soon",
      color: "from-green-500 to-emerald-500"
    },
    // 输配系统计算器
    {
      id: "pump",
      title: "水泵变频与匹配计算器",
      description: "水泵变频改造和系统匹配优化计算工具",
      icon: Droplets,
      features: ["变频节能计算", "水泵选型优化", "系统阻力分析", "运行策略优化"],
      difficulty: "中级",
      time: "8-12分钟",
      category: "输配系统",
      categoryPath: "distribution",
      status: "coming_soon",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "hydraulic",
      title: "水力平衡系统优化计算器",
      description: "水系统水力平衡分析与优化设计",
      icon: Settings,
      features: ["水力计算", "平衡阀选型", "系统优化", "能耗分析"],
      difficulty: "高级",
      time: "10-15分钟",
      category: "输配系统",
      categoryPath: "distribution",
      status: "coming_soon",
      color: "from-green-500 to-blue-500"
    },
    // 末端使用计算器
    {
      id: "fan-coil",
      title: "风机盘管优化计算器",
      description: "风机盘管系统节能改造和性能优化",
      icon: Fan,
      features: ["风机效率分析", "盘管换热优化", "变频控制改造", "智能温控系统"],
      difficulty: "中级",
      time: "6-10分钟",
      category: "末端使用",
      categoryPath: "terminal",
      status: "planned",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "fresh-air",
      title: "新风系统优化计算器",
      description: "新风系统节能改造和空气质量优化",
      icon: Wind,
      features: ["新风量需求计算", "热回收器选型", "变风量控制", "空气质量监测"],
      difficulty: "中级",
      time: "8-12分钟",
      category: "末端使用",
      categoryPath: "terminal",
      status: "planned",
      color: "from-green-500 to-teal-500"
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

  const getStatusBadge = (status: string, isNew: boolean = false) => {
    if (isNew) {
      return <Badge className="bg-green-600">NEW</Badge>
    }
    switch (status) {
      case "available":
        return <Badge className="bg-green-600">可用</Badge>
      case "coming_soon":
        return <Badge variant="outline">即将上线</Badge>
      case "planned":
        return <Badge className="bg-gray-500">规划中</Badge>
      default:
        return null
    }
  }

  // 按类别分组计算器
  const groupedCalculators = allCalculators.reduce((groups, calculator) => {
    const category = calculator.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(calculator)
    return groups
  }, {} as Record<string, typeof allCalculators>)

  const CalculatorCard = ({ calculator }: { calculator: typeof allCalculators[0] }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
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
                {getStatusBadge(calculator.status, calculator.new)}
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
          <Badge variant="secondary" className="text-xs">
            {calculator.category}
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
              <Link href={`/calculator/hvac/${calculator.categoryPath}/${calculator.id}`}>
                开始计算
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          ) : calculator.status === "coming_soon" ? (
            <Button className="w-full" variant="outline" disabled>
              即将上线
              <Clock className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button className="w-full" variant="outline" disabled>
              规划中
              <Clock className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">改造计算器</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          专业的暖通空调系统节能改造计算工具，涵盖冷热源、输配系统等各个环节，
          帮助您评估改造效果和投资回报
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">25%</div>
          <div className="text-sm text-gray-600">平均节能率</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600 mb-1">2.8年</div>
          <div className="text-sm text-gray-600">平均回收期</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 mb-1">7个</div>
          <div className="text-sm text-gray-600">计算工具</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 mb-1">1200+</div>
          <div className="text-sm text-gray-600">成功案例</div>
        </div>
      </div>

      {/* All 暖通空调 Calculators */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">所有暖通空调改造计算器</h2>
          <p className="text-gray-600">
            涵盖冷热源、输配系统、末端使用等各个环节的专业计算工具
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCalculators.map((calculator) => (
            <CalculatorCard 
              key={calculator.id} 
              calculator={calculator}
            />
          ))}
        </div>
      </section>

      {/* Category Summary */}
      <section>
        <h3 className="text-xl font-semibold mb-6">按类别统计</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(groupedCalculators).map(([category, calculators]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">{calculators.length}个工具</div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600">
                      可用: {calculators.filter(c => c.status === 'available').length}
                    </div>
                    <div className="text-sm text-gray-600">
                      即将上线: {calculators.filter(c => c.status === 'coming_soon').length}
                    </div>
                    <div className="text-sm text-gray-600">
                      规划中: {calculators.filter(c => c.status === 'planned').length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">需要专业指导？</h3>
          <p className="text-gray-600 mb-6">
            我们的暖通空调专家团队可以为您提供个性化的改造方案咨询
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/cases?category=hvac">
                查看暖通空调案例
              </Link>
            </Button>
            <Button asChild>
              <Link href="/appointment?service=hvac">
                预约暖通空调专家
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
