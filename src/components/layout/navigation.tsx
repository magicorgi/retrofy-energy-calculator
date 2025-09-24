"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calculator, 
  Package, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  User,
  Menu,
  X,
  Zap,
  Target,
  Wrench,
  Home,
  LogOut,
  Settings,
  ClipboardList,
  Users
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useAdmin } from "@/contexts/AdminContext"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false) // 超级管理员状态
  const { user, isAuthenticated, logout } = useAuth()
  const { isAdmin, switchToAdmin } = useAdmin()

  const navItems = [
    { href: "/calculator", label: "节能计算器", icon: Calculator, public: true },
    { href: "/demand-collection", label: "需求收集", icon: ClipboardList, adminOnly: true },
    { href: "/customer-visit", label: "客户拜访工具", icon: Users, adminOnly: true },
    { href: "/ecomatch", label: "EcoMatch", icon: Target, superAdminOnly: true },
    { href: "/project-assistant", label: "改造项目助手", icon: Wrench, superAdminOnly: true },
    { href: "/products", label: "产品推荐", icon: Package, public: true },
    { href: "/cases", label: "案例库", icon: BookOpen, public: true },
    { href: "/appointment", label: "预约洽谈", icon: Calendar, public: true },
    { href: "/feedback", label: "用户反馈", icon: MessageSquare, public: true },
  ]

  // 过滤导航项目，只显示公开的、管理员可见的或超级管理员可见的
  const visibleNavItems = navItems.filter(item => 
    item.public || (item.adminOnly && isAdmin) || (item.superAdminOnly && isSuperAdmin)
  )

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* RetroPro Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg text-gray-900">RetroPro</span>
              <span className="text-xs text-gray-600 -mt-1 hidden sm:block">节改专家</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {visibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.adminOnly && isAdmin && (
                  <Badge variant="secondary" className="text-[9px] ml-1">Admin</Badge>
                )}
                {item.superAdminOnly && isSuperAdmin && (
                  <Badge variant="secondary" className="text-[9px] ml-1">Admin</Badge>
                )}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.nickname || user?.phone}
                  </span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <Settings className="w-4 h-4 mr-2" />
                    用户中心
                  </Link>
                </Button>
                {!isAdmin && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={async () => {
                      try {
                        await switchToAdmin();
                        window.location.href = '/admin';
                      } catch (error) {
                        // 权限检查失败，不显示错误
                      }
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    管理后台
                  </Button>
                )}
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin">
                      <Settings className="w-4 h-4 mr-2" />
                      管理后台
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  退出
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">
                    <User className="w-4 h-4 mr-2" />
                    登录
                  </Link>
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
                  <Link href="/auth/register">
                    免费注册
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 py-2 px-3 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.adminOnly && isAdmin && (
                    <Badge variant="secondary" className="text-[9px] ml-1">Admin</Badge>
                  )}
                  {item.superAdminOnly && isSuperAdmin && (
                    <Badge variant="secondary" className="text-[9px] ml-1">Admin</Badge>
                  )}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-2 py-2 px-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user?.nickname || user?.phone}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="justify-start" asChild>
                      <Link href="/dashboard">
                        <Settings className="w-4 h-4 mr-2" />
                        用户中心
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start" onClick={logout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      退出登录
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="justify-start" asChild>
                      <Link href="/auth/login">
                        <User className="w-4 h-4 mr-2" />
                        登录
                      </Link>
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 justify-start" asChild>
                      <Link href="/auth/register">
                        免费注册
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
