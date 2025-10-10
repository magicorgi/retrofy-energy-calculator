// 预约洽谈系统数据类型定义

// 服务类型
export type ServiceType = 
  | 'consultation'     // 咨询服务
  | 'design'          // 设计服务
  | 'procurement';    // 产品采购

// 项目用途类型
export type ProjectUsage = 
  | 'office'          // 办公楼
  | 'hotel'           // 酒店
  | 'hospital'        // 医院
  | 'school'          // 学校
  | 'mall'            // 商场
  | 'factory'         // 工厂
  | 'warehouse'       // 仓库
  | 'residence'       // 住宅
  | 'data_center'     // 数据中心
  | 'other';          // 其他

// 预算范围
export type BudgetRange = 
  | 'under_50'        // 50万以下
  | '50_100'          // 50-100万
  | '100_300'         // 100-300万
  | '300_500'         // 300-500万
  | '500_1000'        // 500-1000万
  | 'over_1000';      // 1000万以上

// 服务商类型
export type ProviderType = 
  | 'design_institute' // 设计院
  | 'engineering_company' // 工程公司
  | 'equipment_supplier' // 设备供应商
  | 'service_company' // 节能服务公司
  | 'consultant'      // 咨询公司
  | 'contractor';     // 承包商

// 服务商信息
export interface ServiceProvider {
  id: string;
  name: string;
  type: ProviderType;
  logo?: string;
  description: string;
  specialties: string[]; // 专业领域
  certifications: string[]; // 资质认证
  service_areas: string[]; // 服务地区
  rating: number; // 评分 1-5
  review_count: number; // 评价数量
  completed_projects: number; // 完成项目数
  response_time: number; // 平均响应时间（小时）
  contact_info: {
    phone: string;
    email: string;
    address: string;
    website?: string;
  };
  business_license: string; // 营业执照
  established_year: number; // 成立年份
  team_size: string; // 团队规模
  case_studies: string[]; // 案例研究ID
  is_recommended: boolean; // 平台推荐
  is_verified: boolean; // 已认证
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 预约洽谈请求
export interface AppointmentRequest {
  // 服务信息
  service_type: ServiceType;
  service_description?: string;
  
  // 项目信息
  project_info: {
    name: string; // 项目名称
    area: number; // 建筑面积
    usage: ProjectUsage; // 用途
    location: {
      province: string;
      city: string;
      district?: string;
      address?: string;
    };
    budget_range: BudgetRange;
    urgency: 'low' | 'medium' | 'high' | 'urgent'; // 紧急程度
    current_system?: string; // 现有系统描述
    requirements: string[]; // 具体需求
    timeline?: string; // 项目时间线
  };
  
  // 服务商选择
  provider_selection: {
    type: 'platform_recommend' | 'user_select'; // 选择方式
    selected_provider_ids?: string[]; // 用户选择的服务商
    max_providers?: number; // 最多推荐服务商数量
    preferences?: {
      provider_type?: ProviderType[];
      min_rating?: number;
      max_response_time?: number;
      local_preference?: boolean; // 偏好本地服务商
    };
  };
  
  // 预约信息
  appointment_info: {
    preferred_dates: string[]; // 偏好日期
    preferred_times: string[]; // 偏好时间段
    meeting_type: 'online' | 'offline' | 'both'; // 会议方式
    duration_expected: number; // 预期时长（分钟）
    special_requirements?: string; // 特殊要求
  };
  
  // 联系信息
  contact_info: {
    name: string;
    title?: string; // 职位
    phone: string;
    email?: string;
    company?: string;
    department?: string;
  };
  
  // 留言和备注
  message: string;
  attachments?: string[]; // 附件文件URL
  
  // 系统字段
  user_id?: string;
  source: 'web' | 'mobile' | 'api'; // 来源
  utm_source?: string; // 营销来源
  utm_campaign?: string; // 营销活动
}

// 预约响应
export interface AppointmentResponse {
  id: string;
  request: AppointmentRequest;
  status: 'pending' | 'matched' | 'confirmed' | 'completed' | 'cancelled';
  matched_providers: MatchedProvider[];
  selected_provider?: MatchedProvider;
  confirmed_appointment?: {
    provider_id: string;
    date: string;
    time: string;
    meeting_type: 'online' | 'offline';
    meeting_link?: string; // 在线会议链接
    meeting_address?: string; // 线下会议地址
    agenda?: string; // 会议议程
  };
  created_at: string;
  updated_at: string;
  expires_at?: string; // 过期时间
}

// 匹配的服务商
export interface MatchedProvider {
  provider: ServiceProvider;
  match_score: number; // 匹配分数 0-100
  match_reasons: string[]; // 匹配原因
  estimated_cost?: {
    min: number;
    max: number;
    currency: string;
  };
  availability: {
    available_dates: string[];
    response_time: number;
    earliest_available: string;
  };
  proposal_summary?: string; // 方案概述
  has_responded: boolean;
  response_time?: string; // 实际响应时间
}

// 服务商响应
export interface ProviderResponse {
  id: string;
  appointment_id: string;
  provider_id: string;
  status: 'interested' | 'declined' | 'quoted';
  response_message: string;
  proposed_dates: string[];
  proposed_times: string[];
  estimated_cost?: {
    consultation_fee?: number;
    design_fee?: number;
    implementation_cost?: {
      min: number;
      max: number;
    };
    payment_terms?: string;
  };
  proposal_file?: string; // 方案文件URL
  validity_period?: string; // 报价有效期
  terms_conditions?: string; // 条款说明
  created_at: string;
  updated_at: string;
}

// 预约统计
export interface AppointmentStats {
  total_requests: number;
  pending_requests: number;
  matched_requests: number;
  confirmed_appointments: number;
  completed_appointments: number;
  average_match_time: number; // 平均匹配时间（小时）
  average_response_time: number; // 平均响应时间（小时）
  conversion_rate: number; // 转化率
  satisfaction_rating: number; // 平均满意度
}

// 服务商统计
export interface ProviderStats {
  provider_id: string;
  total_requests: number;
  responded_requests: number;
  confirmed_appointments: number;
  completed_projects: number;
  average_rating: number;
  response_rate: number; // 响应率
  conversion_rate: number; // 转化率
  revenue_generated: number; // 产生收入
  last_active: string;
}

// 常量定义
export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  consultation: '咨询服务',
  design: '设计服务',
  procurement: '产品采购'
};

export const PROJECT_USAGE_LABELS: Record<ProjectUsage, string> = {
  office: '办公楼',
  hotel: '酒店',
  hospital: '医院',
  school: '学校',
  mall: '商场',
  factory: '工厂',
  warehouse: '仓库',
  residence: '住宅',
  data_center: '数据中心',
  other: '其他'
};

export const BUDGET_RANGE_LABELS: Record<BudgetRange, string> = {
  under_50: '50万以下',
  '50_100': '50-100万',
  '100_300': '100-300万',
  '300_500': '300-500万',
  '500_1000': '500-1000万',
  over_1000: '1000万以上'
};

export const PROVIDER_TYPE_LABELS: Record<ProviderType, string> = {
  design_institute: '设计院',
  engineering_company: '工程公司',
  equipment_supplier: '设备供应商',
  service_company: '节能服务公司',
  consultant: '咨询公司',
  contractor: '承包商'
};

export const URGENCY_LABELS = {
  low: '不急',
  medium: '一般',
  high: '较急',
  urgent: '紧急'
};

export const MEETING_TYPE_LABELS = {
  online: '线上会议',
  offline: '线下会议',
  both: '线上或线下均可'
};

// 服务类型对应的专业领域
export const SERVICE_SPECIALTIES: Record<ServiceType, string[]> = {
  consultation: [
    '节能诊断',
    '改造方案设计',
    '投资回报分析',
    '政策咨询',
    '技术选型',
    '项目可行性研究'
  ],
  design: [
    '方案设计',
    '施工图设计',
    '系统优化',
    '设备选型',
    '控制系统设计',
    '节能计算'
  ],
  procurement: [
    '设备选型',
    '价格比较',
    '供应商推荐',
    '采购咨询',
    '技术支持',
    '售后服务'
  ]
};

// 预约时间段
export const TIME_SLOTS = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
  '17:00-18:00'
];

// 会议时长选项
export const DURATION_OPTIONS = [
  { value: 30, label: '30分钟' },
  { value: 60, label: '1小时' },
  { value: 90, label: '1.5小时' },
  { value: 120, label: '2小时' },
  { value: 180, label: '3小时' },
  { value: 240, label: '4小时' }
];






