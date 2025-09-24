import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Thermometer, 
  Droplets, 
  Fan, 
  Zap, 
  TrendingUp,
  Calculator,
  ArrowRight,
  Clock,
  Target,
  CheckCircle
} from "lucide-react"

export default function CalculatorPage() {
  const calculators = [
    {
      id: "hvac",
      title: "暖通空调改造",
      description: "暖通空调系统节能优化计算器",
      icon: Thermometer,
      color: "from-blue-500 to-cyan-500",
      modules: [
        { name: "冷热源侧", count: 3, href: "/calculator/hvac/source" },
        { name: "输配系统", count: 2, href: "/calculator/hvac/distribution" },
        { name: "末端使用", count: 3, href: "/calculator/hvac/terminal", disabled: false }
      ],
      popular: true
    },
    {
      id: "lighting",
      title: "照明系统",
      description: "智能照明节能改造计算",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      modules: [
        { name: "LED改造", count: 0, href: "/calculator/lighting", disabled: true },
        { name: "智能控制", count: 0, href: "/calculator/lighting", disabled: true }
      ],
      comingSoon: true
    },
    {
      id: "envelope",
      title: "围护结构",
      description: "建筑围护结构节能计算",
      icon: Fan,
      color: "from-green-500 to-emerald-500",
      modules: [
        { name: "保温改造", count: 0, href: "#", disabled: true },
        { name: "门窗改造", count: 0, href: "#", disabled: true }
      ],
      comingSoon: true
    },
    {
      id: "control",
      title: "智能控制系统",
      description: "楼宇自控节能优化计算",
      icon: Droplets,
      color: "from-purple-500 to-pink-500",
      modules: [
        { name: "BMS系统", count: 0, href: "#", disabled: true },
        { name: "能耗监测", count: 0, href: "#", disabled: true }
      ],
      comingSoon: true
    }
  ]

  const features = [
    {
      icon: Calculator,
      title: "精确计算",
      description: "基于行业标准和实际数据的精确计算模型"
    },
    {
      icon: TrendingUp,
      title: "效果分析",
      description: "详细的节能效果分析和投资回收期计算"
    },
    {
      icon: Target,
      title: "方案对比",
      description: "多种改造方案的对比分析和优化建议"
    },
    {
      icon: Clock,
      title: "快速出结果",
      description: "几分钟内获得专业的计算报告"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">改造计算器</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          专业的建筑节能改造计算工具，帮助您精确评估改造效果，制定最优节能方案
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-green-100 flex items-center justify-center">
              <feature.icon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Calculator Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {calculators.map((calculator) => (
          <Card key={calculator.id} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${calculator.color} opacity-10 rounded-bl-full`} />
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${calculator.color} flex items-center justify-center`}>
                    <calculator.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {calculator.title}
                      {calculator.popular && (
                        <Badge variant="secondary" className="text-xs">
                          热门
                        </Badge>
                      )}
                      {calculator.comingSoon && (
                        <Badge variant="outline" className="text-xs">
                          即将上线
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{calculator.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700">可用模块：</h4>
                <div className="space-y-2">
                  {calculator.modules.map((module, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className={`w-4 h-4 ${module.disabled ? 'text-gray-300' : 'text-green-500'}`} />
                        <span className={`text-sm ${module.disabled ? 'text-gray-400' : 'text-gray-700'}`}>
                          {module.name}
                        </span>
                        {module.count > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {module.count}个工具
                          </Badge>
                        )}
                      </div>
                      {!module.disabled ? (
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={module.href}>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400">敬请期待</span>
                      )}
                    </div>
                  ))}
                </div>
                
                {!calculator.comingSoon && (
                  <div className="pt-4">
                    <Button className="w-full" asChild>
                      <Link href={`/calculator/${calculator.id}`}>
                        开始计算
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">需要帮助？</h3>
          <p className="text-gray-600 mb-6">
            我们的专业团队可以为您提供计算指导和方案咨询服务
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/cases">
                查看案例
              </Link>
            </Button>
            <Button asChild>
              <Link href="/appointment">
                预约专家咨询
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
