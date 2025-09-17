import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">产品推荐</h1>
        <p className="text-gray-600">基于计算结果的智能产品推荐</p>
      </div>
      
      <Card className="text-center py-12">
        <CardContent>
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">产品库开发中</h3>
          <p className="text-gray-500">更多产品推荐即将上线</p>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  )
}
