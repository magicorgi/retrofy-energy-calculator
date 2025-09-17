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
  Home
} from "lucide-react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false) // 超级管理员状态

  const navItems = [
    { href: "/calculator", label: "节能计算器", icon: Calculator, public: true },
    { href: "/ecomatch", label: "EcoMatch", icon: Target, superAdminOnly: true },
    { href: "/project-assistant", label: "改造项目助手", icon: Wrench, superAdminOnly: true },
    { href: "/products", label: "产品推荐", icon: Package, public: true },
    { href: "/cases", label: "案例库", icon: BookOpen, public: true },
    { href: "/appointment", label: "预约洽谈", icon: Calendar, public: true },
    { href: "/feedback", label: "用户反馈", icon: MessageSquare, public: true },
  ]

  // 过滤导航项目，只显示公开的或超级管理员可见的
  const visibleNavItems = navItems.filter(item => 
    item.public || (item.superAdminOnly && isSuperAdmin)
  )

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 回到首页 */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-gray-700 hidden sm:block">首页</span>
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
                {item.superAdminOnly && isSuperAdmin && (
                  <Badge variant="secondary" className="text-[9px] ml-1">Admin</Badge>
                )}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-3">
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
                  {item.superAdminOnly && isSuperAdmin && (
                    <Badge variant="secondary" className="text-[9px] ml-1">Admin</Badge>
                  )}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
