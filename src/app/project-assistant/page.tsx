import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Wrench, 
  ArrowLeft, 
  CheckCircle,
  FileText,
  Users,
  Calendar
} from "lucide-react"

export default function ProjectAssistantPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">改造项目助手</h1>
              <Badge className="ml-3 bg-orange-600">即将上线</Badge>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              全流程项目管理助手，从方案设计到施工监督，全程陪伴您的节能改造项目
            </p>
          </div>

          {/* 功能预览 */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  项目规划
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 项目需求分析</li>
                  <li>• 改造方案制定</li>
                  <li>• 预算成本估算</li>
                  <li>• 时间进度规划</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-green-600" />
                  团队协作
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 专家团队匹配</li>
                  <li>• 施工队伍推荐</li>
                  <li>• 协作平台管理</li>
                  <li>• 实时沟通协调</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  质量监督
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 施工质量检查</li>
                  <li>• 进度跟踪监控</li>
                  <li>• 验收标准执行</li>
                  <li>• 问题及时反馈</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 开发中提示 */}
          <Card className="text-center py-12 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent>
              <Wrench className="w-16 h-16 mx-auto mb-4 text-orange-500" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">改造项目助手开发中</h3>
              <p className="text-gray-600 mb-6">
                我们正在开发专业的项目管理助手，将为您的节能改造项目提供全流程支持
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/calculator">
                    开始项目评估
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/appointment?service=project">
                    预约项目咨询
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 项目流程 */}
          <Card>
            <CardHeader>
              <CardTitle>项目管理流程</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">需求调研</h4>
                    <p className="text-sm text-gray-600">深入了解建筑现状和改造需求，制定初步方案</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">方案设计</h4>
                    <p className="text-sm text-gray-600">详细的技术方案设计和成本预算分析</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">团队组建</h4>
                    <p className="text-sm text-gray-600">匹配专业团队，建立项目协作机制</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-orange-600">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium">施工执行</h4>
                    <p className="text-sm text-gray-600">全程监督施工质量，确保按期完成</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-red-600">5</span>
                  </div>
                  <div>
                    <h4 className="font-medium">验收交付</h4>
                    <p className="text-sm text-gray-600">项目验收和效果评估，持续跟踪服务</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 服务优势 */}
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">服务优势</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">专业保障</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 经验丰富的专家团队</li>
                    <li>• 标准化作业流程</li>
                    <li>• 质量保证体系</li>
                    <li>• 完善的售后服务</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">效率提升</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 数字化项目管理</li>
                    <li>• 智能进度跟踪</li>
                    <li>• 实时协作沟通</li>
                    <li>• 快速问题响应</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}






