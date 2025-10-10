import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { ProductInsert, ProductUpdate, ProductRow } from '@/types/database'

/**
 * 产品API服务层
 */

// 获取所有产品
export async function getAllProducts(filters?: {
  category?: string
  contact_region?: string
  applicable_industry?: string
  status?: string
  search?: string
}) {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
    
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters?.contact_region) {
      query = query.eq('contact_region', filters.contact_region)
    }
    
    if (filters?.applicable_industry) {
      query = query.contains('applicable_industries', [filters.applicable_industry])
    }
    
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%`)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data as ProductRow[]
  } catch (error) {
    console.error('获取产品列表失败:', error)
    return []
  }
}

// 根据ID获取产品
export async function getProductById(id: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    return data as ProductRow
  } catch (error) {
    console.error('获取产品失败:', error)
    return null
  }
}

// 创建产品（管理员）
export async function createProduct(product: ProductInsert) {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(product)
      .select()
      .single()
    
    if (error) throw error
    
    return { success: true, data: data as ProductRow }
  } catch (error) {
    console.error('创建产品失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '创建产品失败' }
  }
}

// 更新产品（管理员）
export async function updateProduct(id: string, updates: ProductUpdate) {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return { success: true, data: data as ProductRow }
  } catch (error) {
    console.error('更新产品失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '更新产品失败' }
  }
}

// 删除产品（管理员）
export async function deleteProduct(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('删除产品失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '删除产品失败' }
  }
}

// 批量导入产品（管理员）
export async function importProducts(products: ProductInsert[]) {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(products)
      .select()
    
    if (error) throw error
    
    return { success: true, data: data as ProductRow[] }
  } catch (error) {
    console.error('批量导入产品失败:', error)
    return { success: false, error: error instanceof Error ? error.message : '批量导入产品失败' }
  }
}

// 搜索产品
export async function searchProducts(searchTerm: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (error) throw error
    
    return data as ProductRow[]
  } catch (error) {
    console.error('搜索产品失败:', error)
    return []
  }
}

// 获取产品统计信息
export async function getProductStatistics() {
  try {
    const { data, error } = await supabase
      .from('product_statistics')
      .select('*')
      .single()
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('获取产品统计失败:', error)
    return null
  }
}

