// Supabase数据库类型定义

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow
        Insert: UserInsert
        Update: UserUpdate
      }
      products: {
        Row: ProductRow
        Insert: ProductInsert
        Update: ProductUpdate
      }
      demand_surveys: {
        Row: DemandSurveyRow
        Insert: DemandSurveyInsert
        Update: DemandSurveyUpdate
      }
      customer_visits: {
        Row: CustomerVisitRow
        Insert: CustomerVisitInsert
        Update: CustomerVisitUpdate
      }
      appointments: {
        Row: AppointmentRow
        Insert: AppointmentInsert
        Update: AppointmentUpdate
      }
      cases: {
        Row: CaseRow
        Insert: CaseInsert
        Update: CaseUpdate
      }
      calculator_records: {
        Row: CalculatorRecordRow
        Insert: CalculatorRecordInsert
        Update: CalculatorRecordUpdate
      }
      feedback: {
        Row: FeedbackRow
        Insert: FeedbackInsert
        Update: FeedbackUpdate
      }
      invitations: {
        Row: InvitationRow
        Insert: InvitationInsert
        Update: InvitationUpdate
      }
      system_logs: {
        Row: SystemLogRow
        Insert: SystemLogInsert
        Update: SystemLogUpdate
      }
    }
  }
}

// 用户表类型
export interface UserRow {
  id: string
  email: string
  name: string
  password_hash?: string | null
  role: 'user' | 'admin' | 'super-admin'
  status: 'active' | 'pending' | 'inactive'
  phone?: string | null
  company?: string | null
  permissions: string[]
  temp_password?: string | null
  last_login?: string | null
  created_at: string
  updated_at: string
}

export type UserInsert = Omit<UserRow, 'id' | 'created_at' | 'updated_at'>
export type UserUpdate = Partial<UserInsert>

// 产品表类型
export interface ProductRow {
  id: string
  name: string
  brand: string
  model: string
  power_range?: string | null
  category: 'compressor' | 'frequency_converter' | 'heat_exchanger' | 'hydraulic_valve' | 'sensor' | 'control_system' | 'expansion_valve' | 'filter_drier' | 'other'
  applicable_industries: string[]
  images: string[]
  contact_region: 'north' | 'east' | 'south' | 'central' | 'southwest' | 'northeast' | 'northwest'
  contact_person?: string | null
  contact_phone?: string | null
  contact_email?: string | null
  company?: string | null
  description?: string | null
  specifications?: Record<string, any> | null
  features?: string[]
  status: 'active' | 'inactive' | 'draft'
  source: 'manual' | 'api' | 'import'
  created_by?: string | null
  created_at: string
  updated_at: string
}

export type ProductInsert = Omit<ProductRow, 'id' | 'created_at' | 'updated_at'>
export type ProductUpdate = Partial<ProductInsert>

// 需求收集表类型
export interface DemandSurveyRow {
  id: string
  user_id?: string | null
  survey_type: 'factory' | 'building' | 'park'
  address?: string | null
  region?: string | null
  city?: string | null
  owner_name?: string | null
  contact_person?: string | null
  contact_position?: string | null
  contact_phone?: string | null
  contact_email?: string | null
  industry?: string | null
  building_type?: Record<string, any> | null
  energy_systems?: Record<string, any> | null
  building_area?: number | null
  air_conditioning_area?: number | null
  completion_year?: number | null
  floors_above?: number | null
  floors_below?: number | null
  equipment_info?: Record<string, any> | null
  energy_consumption?: Record<string, any> | null
  energy_costs?: Record<string, any> | null
  has_photovoltaic?: boolean
  photovoltaic_capacity?: number | null
  photovoltaic_roof_area?: number | null
  has_energy_storage?: boolean
  energy_storage_capacity?: number | null
  additional_notes?: string | null
  status: 'draft' | 'submitted' | 'reviewed' | 'completed'
  created_at: string
  updated_at: string
}

export type DemandSurveyInsert = Omit<DemandSurveyRow, 'id' | 'created_at' | 'updated_at'>
export type DemandSurveyUpdate = Partial<DemandSurveyInsert>

// 客户拜访表类型
export interface CustomerVisitRow {
  id: string
  user_id?: string | null
  customer_name: string
  customer_company?: string | null
  customer_industry?: string | null
  customer_address?: string | null
  customer_phone?: string | null
  customer_email?: string | null
  decision_maker_name?: string | null
  decision_maker_position?: string | null
  business_scope?: string | null
  relationship_level?: string | null
  project_start_date?: string | null
  budget_approval_date?: string | null
  procurement_method?: string | null
  danfoss_usage?: string | null
  competitor_usage?: string | null
  equipment_environment?: string | null
  equipment_lifecycle?: Record<string, any> | null
  application_methods?: string | null
  key_equipment?: string | null
  equipment_importance?: string | null
  downtime_cost?: string | null
  current_pain_points?: string | null
  current_solutions?: string | null
  maintenance_provider?: string | null
  replacement_provider?: string | null
  annual_budget?: string | null
  ongoing_projects?: string | null
  participation_status?: string | null
  competitor_info?: string | null
  next_year_plans?: string | null
  completion_rate?: number
  status: 'draft' | 'completed' | 'follow-up'
  visit_date?: string | null
  created_at: string
  updated_at: string
}

export type CustomerVisitInsert = Omit<CustomerVisitRow, 'id' | 'created_at' | 'updated_at'>
export type CustomerVisitUpdate = Partial<CustomerVisitInsert>

// 预约表类型
export interface AppointmentRow {
  id: string
  user_id?: string | null
  company_name: string
  contact_name: string
  phone: string
  email?: string | null
  project_type?: string | null
  project_location?: string | null
  building_type?: string | null
  building_area?: number | null
  energy_systems?: Record<string, any> | null
  annual_energy_cost?: number | null
  energy_saving_target?: number | null
  investment_budget?: number | null
  preferred_date?: string | null
  preferred_time?: string | null
  additional_requirements?: string | null
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export type AppointmentInsert = Omit<AppointmentRow, 'id' | 'created_at' | 'updated_at'>
export type AppointmentUpdate = Partial<AppointmentInsert>

// 案例库表类型
export interface CaseRow {
  id: string
  title: string
  description?: string | null
  location?: string | null
  industry?: string | null
  building_type?: string | null
  project_scale?: string | null
  original_system?: string | null
  retrofit_solution?: string | null
  products_used?: Record<string, any> | null
  energy_savings?: number | null
  cost_savings?: number | null
  investment_amount?: number | null
  payback_period?: number | null
  co2_reduction?: number | null
  images?: string[]
  videos?: string[]
  documents?: string[]
  featured?: boolean
  status: 'draft' | 'published' | 'archived'
  views?: number
  created_by?: string | null
  created_at: string
  updated_at: string
}

export type CaseInsert = Omit<CaseRow, 'id' | 'created_at' | 'updated_at'>
export type CaseUpdate = Partial<CaseInsert>

// 计算器记录表类型
export interface CalculatorRecordRow {
  id: string
  user_id?: string | null
  calculator_type: string
  input_data: Record<string, any>
  output_data?: Record<string, any> | null
  project_name?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
}

export type CalculatorRecordInsert = Omit<CalculatorRecordRow, 'id' | 'created_at' | 'updated_at'>
export type CalculatorRecordUpdate = Partial<CalculatorRecordInsert>

// 反馈表类型
export interface FeedbackRow {
  id: string
  user_id?: string | null
  type?: 'bug' | 'feature' | 'improvement' | 'other' | null
  subject: string
  content: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  admin_response?: string | null
  created_at: string
  updated_at: string
}

export type FeedbackInsert = Omit<FeedbackRow, 'id' | 'created_at' | 'updated_at'>
export type FeedbackUpdate = Partial<FeedbackInsert>

// 邀请表类型
export interface InvitationRow {
  id: string
  invited_by?: string | null
  email: string
  name?: string | null
  role: string
  permissions: string[]
  temp_password: string
  token: string
  message?: string | null
  status: 'pending' | 'accepted' | 'expired'
  expires_at?: string | null
  accepted_at?: string | null
  created_at: string
}

export type InvitationInsert = Omit<InvitationRow, 'id' | 'created_at'>
export type InvitationUpdate = Partial<InvitationInsert>

// 系统日志表类型
export interface SystemLogRow {
  id: string
  user_id?: string | null
  action: string
  entity_type?: string | null
  entity_id?: string | null
  details?: Record<string, any> | null
  ip_address?: string | null
  user_agent?: string | null
  created_at: string
}

export type SystemLogInsert = Omit<SystemLogRow, 'id' | 'created_at'>
export type SystemLogUpdate = Partial<SystemLogInsert>

