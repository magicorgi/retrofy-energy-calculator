// 后台管理系统数据类型定义

import { User, CalculationRecord, UserContactRecord, AppointmentRecord } from './user';
import { Product } from './product';

// 管理员角色和权限
export type AdminRole = 
  | 'super_admin'    // 超级管理员
  | 'admin'          // 普通管理员
  | 'content_admin'  // 内容管理员
  | 'service_admin'  // 客服管理员
  | 'data_analyst';  // 数据分析师

export interface AdminPermission {
  id: string;
  name: string;
  code: string;
  description: string;
  module: string; // user, content, calculator, appointment, dashboard
}

export interface AdminUser extends User {
  admin_role: AdminRole;
  permissions: string[]; // 权限代码数组
  last_login_ip?: string;
  login_count: number;
  is_active: boolean;
  created_by?: string;
  department?: string;
}

// 用户行为分析
export interface UserBehavior {
  id: string;
  user_id: string;
  action: string; // login, calculate, view_product, contact, etc.
  module: string; // calculator, product, case, etc.
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface UserAnalytics {
  user_id: string;
  total_logins: number;
  total_calculations: number;
  total_contacts: number;
  total_appointments: number;
  last_active: string;
  preferred_calculators: string[];
  conversion_rate: number; // 转化率
  engagement_score: number; // 参与度评分
}

// 内容管理
export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  cover_image?: string;
  category: string;
  tags: string[];
  author_id: string;
  author_name: string;
  status: 'draft' | 'published' | 'archived';
  view_count: number;
  like_count: number;
  publish_at?: string;
  created_at: string;
  updated_at: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
}

export interface Case {
  id: string;
  title: string;
  description: string;
  content: string;
  cover_image: string;
  images: string[];
  category: string;
  tags: string[];
  client_name?: string;
  project_scale: string;
  energy_savings: number; // 节能效果百分比
  cost_savings: number; // 成本节省金额
  implementation_time: string; // 实施周期
  location: {
    province: string;
    city: string;
    address?: string;
  };
  products_used: string[]; // 使用的产品ID
  status: 'draft' | 'published' | 'featured' | 'archived';
  view_count: number;
  like_count: number;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}

// 计算器参数管理
export interface CalculatorConfig {
  id: string;
  calculator_type: string; // heat_pump, chiller, etc.
  version: string;
  name: string;
  description: string;
  parameters: CalculatorParameter[];
  formulas: CalculatorFormula[];
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CalculatorParameter {
  id: string;
  name: string;
  key: string;
  type: 'number' | 'select' | 'range';
  default_value: any;
  min_value?: number;
  max_value?: number;
  options?: { label: string; value: any }[];
  unit?: string;
  description: string;
  category: string; // basic, advanced, regional
  is_required: boolean;
  display_order: number;
}

export interface CalculatorFormula {
  id: string;
  name: string;
  expression: string; // 数学表达式
  description: string;
  variables: string[]; // 依赖的变量
  category: string;
  is_active: boolean;
}

// 预约管理
export interface AppointmentManagement extends AppointmentRecord {
  assigned_admin_id?: string;
  assigned_admin_name?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  follow_up_records: FollowUpRecord[];
  estimated_duration: number; // 预计服务时长（分钟）
  actual_duration?: number; // 实际服务时长
  satisfaction_rating?: number; // 满意度评分 1-5
  service_fee?: number; // 服务费用
}

export interface FollowUpRecord {
  id: string;
  appointment_id: string;
  admin_id: string;
  admin_name: string;
  action: string; // called, emailed, visited, etc.
  content: string;
  result: string;
  next_action?: string;
  next_follow_up_at?: string;
  created_at: string;
}

// 数据看板
export interface DashboardStats {
  // 用户统计
  total_users: number;
  new_users_today: number;
  new_users_this_month: number;
  active_users_today: number;
  active_users_this_month: number;
  user_retention_rate: number;
  
  // 计算统计
  total_calculations: number;
  calculations_today: number;
  calculations_this_month: number;
  popular_calculators: { name: string; count: number }[];
  
  // 转化统计
  total_contacts: number;
  contacts_today: number;
  contact_conversion_rate: number;
  total_appointments: number;
  appointments_today: number;
  appointment_conversion_rate: number;
  
  // 内容统计
  total_articles: number;
  total_cases: number;
  total_products: number;
  popular_content: { title: string; views: number; type: string }[];
  
  // 系统统计
  system_health: 'healthy' | 'warning' | 'critical';
  response_time: number; // 平均响应时间
  error_rate: number; // 错误率
  uptime: number; // 系统正常运行时间百分比
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface UserGrowthData {
  date: string;
  new_users: number;
  total_users: number;
  active_users: number;
}

export interface CalculationHeatData {
  calculator_type: string;
  count: number;
  growth_rate: number; // 增长率
  avg_duration: number; // 平均使用时长
}

export interface ConversionFunnelData {
  stage: string;
  count: number;
  conversion_rate: number;
}

// API 响应类型
export interface AdminResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 表格列配置
export interface TableColumn {
  key: string;
  title: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: any) => React.ReactNode;
}

// 筛选器配置
export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'date' | 'dateRange' | 'text' | 'number';
  options?: { label: string; value: any }[];
  placeholder?: string;
}

// 批量操作
export interface BulkAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  confirm?: {
    title: string;
    content: string;
  };
}

// 导出配置
export interface ExportConfig {
  filename: string;
  format: 'csv' | 'excel' | 'pdf';
  columns: string[];
  filters?: Record<string, any>;
}

// 权限常量
export const ADMIN_PERMISSIONS = {
  // 用户管理
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_EXPORT: 'user:export',
  
  // 内容管理
  CONTENT_VIEW: 'content:view',
  CONTENT_CREATE: 'content:create',
  CONTENT_UPDATE: 'content:update',
  CONTENT_DELETE: 'content:delete',
  CONTENT_PUBLISH: 'content:publish',
  
  // 计算器管理
  CALCULATOR_VIEW: 'calculator:view',
  CALCULATOR_UPDATE: 'calculator:update',
  CALCULATOR_VERSION: 'calculator:version',
  
  // 预约管理
  APPOINTMENT_VIEW: 'appointment:view',
  APPOINTMENT_ASSIGN: 'appointment:assign',
  APPOINTMENT_UPDATE: 'appointment:update',
  APPOINTMENT_DELETE: 'appointment:delete',
  
  // 数据看板
  DASHBOARD_VIEW: 'dashboard:view',
  ANALYTICS_VIEW: 'analytics:view',
  REPORT_EXPORT: 'report:export',
  
  // 系统管理
  ADMIN_MANAGE: 'admin:manage',
  SYSTEM_CONFIG: 'system:config',
} as const;

// 角色权限映射
export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: Object.values(ADMIN_PERMISSIONS),
  admin: [
    ADMIN_PERMISSIONS.USER_VIEW,
    ADMIN_PERMISSIONS.USER_UPDATE,
    ADMIN_PERMISSIONS.CONTENT_VIEW,
    ADMIN_PERMISSIONS.CONTENT_CREATE,
    ADMIN_PERMISSIONS.CONTENT_UPDATE,
    ADMIN_PERMISSIONS.CONTENT_PUBLISH,
    ADMIN_PERMISSIONS.CALCULATOR_VIEW,
    ADMIN_PERMISSIONS.CALCULATOR_UPDATE,
    ADMIN_PERMISSIONS.APPOINTMENT_VIEW,
    ADMIN_PERMISSIONS.APPOINTMENT_ASSIGN,
    ADMIN_PERMISSIONS.APPOINTMENT_UPDATE,
    ADMIN_PERMISSIONS.DASHBOARD_VIEW,
    ADMIN_PERMISSIONS.ANALYTICS_VIEW,
  ],
  content_admin: [
    ADMIN_PERMISSIONS.CONTENT_VIEW,
    ADMIN_PERMISSIONS.CONTENT_CREATE,
    ADMIN_PERMISSIONS.CONTENT_UPDATE,
    ADMIN_PERMISSIONS.CONTENT_PUBLISH,
    ADMIN_PERMISSIONS.USER_VIEW,
  ],
  service_admin: [
    ADMIN_PERMISSIONS.APPOINTMENT_VIEW,
    ADMIN_PERMISSIONS.APPOINTMENT_ASSIGN,
    ADMIN_PERMISSIONS.APPOINTMENT_UPDATE,
    ADMIN_PERMISSIONS.USER_VIEW,
  ],
  data_analyst: [
    ADMIN_PERMISSIONS.DASHBOARD_VIEW,
    ADMIN_PERMISSIONS.ANALYTICS_VIEW,
    ADMIN_PERMISSIONS.REPORT_EXPORT,
    ADMIN_PERMISSIONS.USER_VIEW,
  ],
};

// 角色标签
export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: '超级管理员',
  admin: '管理员',
  content_admin: '内容管理员',
  service_admin: '客服管理员',
  data_analyst: '数据分析师',
};

