import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export default function AppointmentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">预约洽谈</h1>
        <p className="text-gray-600">专业的节能改造专家咨询服务</p>
      </div>
      
      <Card className="text-center py-12">
        <CardContent>
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">预约系统开发中</h3>
          <p className="text-gray-500">专家预约功能即将上线</p>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  )
}
