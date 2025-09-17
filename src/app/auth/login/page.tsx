import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">用户登录</h1>
            <p className="text-gray-600">登录您的账户</p>
          </div>
          
          <Card className="text-center py-12 max-w-md mx-auto">
            <CardContent>
              <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">登录功能开发中</h3>
              <p className="text-gray-500">用户登录系统即将上线</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

