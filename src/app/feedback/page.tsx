import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">用户反馈</h1>
        <p className="text-gray-600">您的建议是我们前进的动力</p>
      </div>
      
      <Card className="text-center py-12">
        <CardContent>
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">反馈系统开发中</h3>
          <p className="text-gray-500">用户反馈功能即将上线</p>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  )
}
