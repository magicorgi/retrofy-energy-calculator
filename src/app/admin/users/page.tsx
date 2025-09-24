"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock,
  Settings,
  ClipboardList,
  User,
  Trash2,
  Edit
} from "lucide-react"
import { sendInvitationEmail } from "@/lib/email"

interface User {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
  status: 'active' | 'pending' | 'inactive'
  createdAt: string
  lastLogin?: string
}

interface InviteUser {
  email: string
  name: string
  role: string
  permissions: string[]
  message: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [inviteForm, setInviteForm] = useState<InviteUser>({
    email: '',
    name: '',
    role: 'user',
    permissions: [],
    message: ''
  })
  const [isInviting, setIsInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [inviteError, setInviteError] = useState('')

  // 加载用户数据
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    try {
      const storedUsers = localStorage.getItem('adminUsers')
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers))
      } else {
        // 初始化默认用户数据
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'admin@danfoss.com.cn',
            name: '系统管理员',
            role: 'admin',
            permissions: ['demand-collection', 'customer-visit', 'user-management'],
            status: 'active',
            createdAt: '2024-01-01',
            lastLogin: '2024-01-15'
          },
          {
            id: '2',
            email: 'user1@company.com',
            name: '张三',
            role: 'user',
            permissions: ['demand-collection'],
            status: 'active',
            createdAt: '2024-01-10',
            lastLogin: '2024-01-14'
          },
          {
            id: '3',
            email: 'user2@company.com',
            name: '李四',
            role: 'user',
            permissions: ['customer-visit'],
            status: 'pending',
            createdAt: '2024-01-12'
          }
        ]
        setUsers(mockUsers)
        localStorage.setItem('adminUsers', JSON.stringify(mockUsers))
      }
    } catch (error) {
      console.error('加载用户数据失败:', error)
    }
  }

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers)
    localStorage.setItem('adminUsers', JSON.stringify(newUsers))
  }

  const availablePermissions = [
    { id: 'demand-collection', name: '需求收集工具', description: '访问工厂和建筑调研工具' },
    { id: 'customer-visit', name: '客户拜访工具', description: '访问客户拜访记录工具' },
    { id: 'user-management', name: '用户管理', description: '管理用户账号和权限' }
  ]

  const roleOptions = [
    { value: 'user', label: '普通用户', description: '基础功能访问' },
    { value: 'admin', label: '管理员', description: '完整功能访问' },
    { value: 'super-admin', label: '超级管理员', description: '系统管理权限' }
  ]

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsInviting(true)
    setInviteError('')
    setInviteSuccess(false)

    try {
      // 生成临时密码
      const tempPassword = Math.random().toString(36).slice(-8)
      
      // 发送邀请邮件
      const emailResult = await sendInvitationEmail({
        email: inviteForm.email,
        name: inviteForm.name,
        tempPassword,
        permissions: inviteForm.permissions,
        message: inviteForm.message
      })

      if (!emailResult.success) {
        setInviteError(emailResult.message)
        return
      }

      // 添加到用户列表
      const newUser: User = {
        id: Date.now().toString(),
        email: inviteForm.email,
        name: inviteForm.name,
        role: inviteForm.role,
        permissions: inviteForm.permissions,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      const updatedUsers = [...users, newUser]
      saveUsers(updatedUsers)
      
      // 重置表单
      setInviteForm({
        email: '',
        name: '',
        role: 'user',
        permissions: [],
        message: ''
      })
      
      setInviteSuccess(true)
      
      // 显示成功消息
      alert(`邀请邮件已发送到 ${inviteForm.email}\n临时密码: ${tempPassword}`)
      
    } catch (error) {
      console.error('邀请用户错误:', error)
      setInviteError('发送邀请失败，请重试')
    } finally {
      setIsInviting(false)
    }
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setInviteForm(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }))
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('确定要删除这个用户吗？')) {
      const updatedUsers = users.filter(user => user.id !== userId)
      saveUsers(updatedUsers)
    }
  }

  const handleUpdateUserStatus = (userId: string, newStatus: 'active' | 'pending' | 'inactive') => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    )
    saveUsers(updatedUsers)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />活跃</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />待确认</Badge>
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />未激活</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-blue-100 text-blue-800"><Shield className="w-3 h-3 mr-1" />管理员</Badge>
      case 'super-admin':
        return <Badge className="bg-purple-100 text-purple-800"><Settings className="w-3 h-3 mr-1" />超级管理员</Badge>
      default:
        return <Badge variant="secondary"><User className="w-3 h-3 mr-1" />普通用户</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* 页面标题 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
              <p className="text-gray-600 mt-2">管理用户账号、权限和邀请新用户</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 邀请用户表单 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5" />
                  <span>邀请新用户</span>
                </CardTitle>
                <CardDescription>
                  通过邮件邀请新用户加入系统
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInviteUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">邮箱地址 *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={inviteForm.email}
                        onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="user@company.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">姓名 *</Label>
                      <Input
                        id="name"
                        value={inviteForm.name}
                        onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="张三"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="role">用户角色</Label>
                    <Select
                      value={inviteForm.role}
                      onValueChange={(value) => setInviteForm(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <div>
                              <div className="font-medium">{role.label}</div>
                              <div className="text-sm text-gray-500">{role.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>权限设置</Label>
                    <div className="space-y-2 mt-2">
                      {availablePermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={permission.id}
                            checked={inviteForm.permissions.includes(permission.id)}
                            onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={permission.id} className="text-sm">
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-gray-500">{permission.description}</div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">邀请消息（可选）</Label>
                    <Textarea
                      id="message"
                      value={inviteForm.message}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="欢迎加入我们的团队！"
                      rows={3}
                    />
                  </div>

                  {inviteSuccess && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        邀请邮件已发送成功！用户将收到包含登录信息的邮件。
                      </AlertDescription>
                    </Alert>
                  )}

                  {inviteError && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>{inviteError}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isInviting}
                  >
                    {isInviting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        发送中...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        发送邀请邮件
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* 用户列表 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>用户列表</span>
                </CardTitle>
                <CardDescription>
                  当前系统中的所有用户
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{user.name}</h4>
                            {getRoleBadge(user.role)}
                            {getStatusBadge(user.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                          <div className="flex flex-wrap gap-1">
                            {user.permissions.map((permission) => {
                              const perm = availablePermissions.find(p => p.id === permission)
                              return perm ? (
                                <Badge key={permission} variant="outline" className="text-xs">
                                  {perm.name}
                                </Badge>
                              ) : null
                            })}
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            创建时间: {user.createdAt}
                            {user.lastLogin && ` | 最后登录: ${user.lastLogin}`}
                          </div>
                        </div>
                        
                        {/* 操作按钮 */}
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateUserStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}