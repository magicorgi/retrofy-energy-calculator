import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { UserInsert, UserUpdate, UserRow } from '@/types/database'

/**
 * 用户API服务层
 */

// 获取当前登录用户
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error
    if (!user) return null
    
    // 从users表获取完整用户信息
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single()
    
    if (userError) throw userError
    
    return userData as UserRow
  } catch (error) {
    console.error('获取当前用户失败:', error)
    return null
  }
}

// 获取所有用户（管理员）
export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data as UserRow[]
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return []
  }
}

// 根据ID获取用户
export async function getUserById(id: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    return data as UserRow
  } catch (error) {
    console.error('获取用户失败:', error)
    return null
  }
}

// 创建用户（管理员）
export async function createUser(user: UserInsert) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(user)
      .select()
      .single()
    
    if (error) throw error
    
    return { success: true, data: data as UserRow }
  } catch (error) {
    console.error('创建用户失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '创建用户失败' }
  }
}

// 更新用户
export async function updateUser(id: string, updates: UserUpdate) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return { success: true, data: data as UserRow }
  } catch (error) {
    console.error('更新用户失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '更新用户失败' }
  }
}

// 删除用户（管理员）
export async function deleteUser(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('删除用户失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '删除用户失败' }
  }
}

// 更新用户状态
export async function updateUserStatus(id: string, status: 'active' | 'pending' | 'inactive') {
  return updateUser(id, { status })
}

// 更新用户权限
export async function updateUserPermissions(id: string, permissions: string[]) {
  return updateUser(id, { permissions })
}

// 注册新用户
export async function registerUser(email: string, password: string, name: string) {
  try {
    // 1. 使用Supabase Auth创建账号
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    })
    
    if (authError) throw authError
    if (!authData.user) throw new Error('创建用户失败')
    
    // 2. 在users表中创建用户记录
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        name,
        role: 'user',
        status: 'pending',
        permissions: []
      })
      .select()
      .single()
    
    if (userError) throw userError
    
    return { success: true, data: userData as UserRow }
  } catch (error) {
    console.error('注册用户失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '注册失败' }
  }
}

// 登录用户
export async function loginUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    // 更新最后登录时间
    if (data.user) {
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('email', email)
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('登录失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '登录失败' }
  }
}

// 登出用户
export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('登出失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '登出失败' }
  }
}

// 检查用户是否为管理员
export async function isAdmin(userId?: string) {
  try {
    let targetUserId = userId
    
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false
      targetUserId = user.id
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', targetUserId)
      .single()
    
    if (error) throw error
    
    return data?.role === 'admin' || data?.role === 'super-admin'
  } catch (error) {
    console.error('检查管理员权限失败:', error)
    return false
  }
}

