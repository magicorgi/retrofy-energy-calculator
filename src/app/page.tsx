import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  Calculator, 
  TrendingDown, 
  Zap, 
  Shield, 
  Users, 
  Award,
  ArrowRight,
  CheckCircle,
  Building,
  Factory,
  Home,
  Store,
  Calendar
} from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Calculator,
      title: "专业计算器",
      description: "精确的改造计算，包含冷热源、输配系统等多个模块",
      color: "text-blue-600"
    },
    {
      icon: TrendingDown,
      title: "节能分析",
      description: "详细的能耗分析报告，准确计算节能率和投资回收期",
      color: "text-green-600"
    },
    {
      icon: Shield,
      title: "方案推荐",
      description: "基于计算结果智能推荐最适合的产品和改造方案",
      color: "text-purple-600"
    },
    {
      icon: Users,
      title: "专家服务",
      description: "连接行业专家，提供专业的咨询和设计服务",
      color: "text-orange-600"
    }
  ]

  const industries = [
    { icon: Building, name: "办公楼宇", count: "1200+" },
    { icon: Factory, name: "工业厂房", count: "800+" },
    { icon: Store, name: "商业综合体", count: "600+" },
    { icon: Home, name: "住宅社区", count: "400+" }
  ]

  const stats = [
    { value: "3000+", label: "服务项目", color: "text-blue-600" },
    { value: "25%", label: "平均节能率", color: "text-green-600" },
    { value: "2.5年", label: "平均回收期", color: "text-purple-600" },
    { value: "98%", label: "客户满意度", color: "text-orange-600" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="space-y-16">
          {/* Hero Section */}
          <section className="text-center py-12">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            专业节能改造平台
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            让建筑更
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              节能高效
            </span>
          </h1>
          <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
            专业的建筑改造平台，帮助您计算改造效果，选择最优方案
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
              <Link href="/calculator">
                <Calculator className="w-5 h-5 mr-2" />
                开始计算
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/cases">
                查看案例
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 -mx-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">核心功能</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            集成专业计算工具、智能推荐系统和专家服务，为您提供一站式节能改造解决方案
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gray-100 flex items-center justify-center`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">服务行业</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            覆盖多个建筑类型，积累丰富的行业经验和成功案例
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {industries.map((industry, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow duration-300">
              <CardContent className="pt-6">
                <industry.icon className="w-8 h-8 mx-auto mb-3 text-gray-600" />
                <h3 className="font-semibold mb-1">{industry.name}</h3>
                <p className="text-sm text-green-600 font-medium">{industry.count} 项目</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 -mx-4 px-4 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            开始您的节能改造之旅
          </h2>
          <p className="text-xl mb-8 opacity-90">
            专业团队为您提供从计算分析到方案实施的全程服务
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/calculator">
                <Calculator className="w-5 h-5 mr-2" />
                免费计算
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" asChild>
              <Link href="/appointment">
                <Calendar className="w-5 h-5 mr-2" />
                预约咨询
              </Link>
            </Button>
          </div>
        </div>
      </section>
        </div>
      </div>
    </div>
  )
}