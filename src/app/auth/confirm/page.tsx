"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle, 
  XCircle, 
  Mail, 
  Shield, 
  User,
  Lock,
  Eye,
  EyeOff
} from "lucide-react"
import Link from "next/link"

interface InviteData {
  email: string
  name: string
  role: string
  permissions: string[]
  tempPassword: string
  isValid: boolean
}

export default function ConfirmRegistrationPage() {
  const [inviteData, setInviteData] = useState<InviteData | null>(null)
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // 模拟从URL参数或localStorage获取邀请数据
    const mockInviteData: InviteData = {
      email: 'user@company.com',
      name: '张三',
      role: 'user',
      permissions: ['demand-collection'],
      tempPassword: 'temp123456',
      isValid: true
    }
    
    setInviteData(mockInviteData)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // 验证密码
    if (formData.newPassword !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      setIsLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setError('密码长度至少6位')
      setIsLoading(false)
      return
    }

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('确认注册:', {
        email: inviteData?.email,
        newPassword: formData.newPassword,
        tempPassword: inviteData?.tempPassword
      })

      setIsSuccess(true)
    } catch (error) {
      setError('注册确认失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return '管理员'
      case 'super-admin':
        return '超级管理员'
      default:
        return '普通用户'
    }
  }

  const getPermissionLabel = (permission: string) => {
    switch (permission) {
      case 'demand-collection':
        return '需求收集工具'
      case 'customer-visit':
        return '客户拜访工具'
      case 'user-management':
        return '用户管理'
      default:
        return permission
    }
  }

  if (!inviteData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">邀请链接无效</CardTitle>
            <CardDescription>
              邀请链接已过期或无效，请联系管理员重新发送邀请
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/auth/login">
                返回登录页面
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!inviteData.isValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">邀请已失效</CardTitle>
            <CardDescription>
              邀请链接已过期或已被使用，请联系管理员
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/auth/login">
                返回登录页面
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl">注册成功！</CardTitle>
            <CardDescription>
              您的账号已成功激活，现在可以使用新密码登录系统
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  立即登录
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  返回首页
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl">确认注册</CardTitle>
          <CardDescription>
            欢迎加入我们的系统！请设置您的新密码
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 邀请信息展示 */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="font-medium text-blue-900 mb-2">邀请信息</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{inviteData.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{inviteData.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>{getRoleLabel(inviteData.role)}</span>
              </div>
              <div className="mt-2">
                <span className="text-xs text-blue-600">可用功能：</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {inviteData.permissions.map((permission) => (
                    <span key={permission} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {getPermissionLabel(permission)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="tempPassword">临时密码</Label>
              <Input
                id="tempPassword"
                value={inviteData.tempPassword}
                readOnly
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                请使用此临时密码完成注册
              </p>
            </div>

            <div>
              <Label htmlFor="newPassword">新密码</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="请输入新密码（至少6位）"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">确认新密码</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="请再次输入新密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  处理中...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  确认注册
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              已有账号？
              <Link href="/auth/login" className="text-green-600 hover:underline ml-1">
                立即登录
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


