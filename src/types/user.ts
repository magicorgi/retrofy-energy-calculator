// 用户系统数据类型定义

export interface User {
  id: string;
  phone: string; // 手机号
  wechat_openid?: string; // 微信OpenID
  nickname: string; // 昵称
  avatar?: string; // 头像URL
  email?: string; // 邮箱
  company?: string; // 公司名称
  industry: string; // 行业
  region: string; // 地区
  role: UserRole; // 用户角色
  position?: string; // 职位
  real_name?: string; // 真实姓名
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  status: 'active' | 'inactive' | 'suspended'; // 用户状态
  verified: boolean; // 是否已验证
}

export type UserRole = 
  | 'individual' // 个人用户
  | 'company' // 企业用户
  | 'designer' // 设计师
  | 'contractor' // 承包商
  | 'supplier' // 供应商
  | 'consultant' // 顾问
  | 'admin'; // 管理员

export interface UserProfile {
  user_id: string;
  company_info?: {
    name: string;
    size: string; // 公司规模
    business_license?: string; // 营业执照
    website?: string;
    address?: string;
  };
  preferences: {
    notification_email: boolean;
    notification_sms: boolean;
    newsletter: boolean;
  };
  certification?: {
    type: string; // 认证类型
    number: string; // 证书编号
    expires_at?: string; // 过期时间
  };
}

// 登录相关
export interface LoginRequest {
  phone: string;
  verification_code: string;
}

export interface WeChatLoginRequest {
  code: string; // 微信授权码
  state?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token: string;
  expires_in: number;
}

export interface VerificationCodeRequest {
  phone: string;
  type: 'login' | 'register'; // 验证码类型
}

// 用户收藏
export interface UserFavorite {
  id: string;
  user_id: string;
  item_type: 'product' | 'case' | 'calculator'; // 收藏类型
  item_id: string;
  created_at: string;
}

// 用户计算记录
export interface CalculationRecord {
  id: string;
  user_id: string;
  calculator_type: string; // 计算器类型
  input_data: Record<string, any>; // 输入数据
  result_data: Record<string, any>; // 计算结果
  title?: string; // 记录标题
  notes?: string; // 备注
  created_at: string;
  updated_at: string;
}

// 用户联系记录
export interface UserContactRecord {
  id: string;
  user_id: string;
  product_id?: string;
  supplier_id?: string;
  message: string;
  contact_info: {
    name: string;
    phone: string;
    email?: string;
    company?: string;
  };
  status: 'pending' | 'contacted' | 'quoted' | 'closed';
  created_at: string;
  updated_at: string;
  response?: string; // 回复内容
  responded_at?: string; // 回复时间
}

// 用户预约记录
export interface AppointmentRecord {
  id: string;
  user_id: string;
  type: 'consultation' | 'site_visit' | 'technical_support' | 'other';
  title: string;
  description: string;
  preferred_date: string;
  preferred_time: string;
  contact_info: {
    name: string;
    phone: string;
    email?: string;
    company?: string;
  };
  location?: {
    address: string;
    city: string;
    province: string;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  completed_at?: string;
  notes?: string;
  assigned_to?: string; // 分配给的服务人员
}

// 用户统计信息
export interface UserStats {
  favorites_count: number;
  calculations_count: number;
  contacts_count: number;
  appointments_count: number;
  last_activity: string;
}

// 行业选项
export const INDUSTRIES = [
  '建筑设计',
  '暖通空调',
  '节能服务',
  '房地产开发',
  '工程承包',
  '设备制造',
  '能源管理',
  '政府机构',
  '教育机构',
  '医疗机构',
  '商业零售',
  '酒店餐饮',
  '工业制造',
  '数据中心',
  '其他'
];

// 地区选项
export const REGIONS = [
  '北京市', '上海市', '天津市', '重庆市',
  '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省',
  '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省',
  '河南省', '湖北省', '湖南省', '广东省', '海南省',
  '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省',
  '内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区',
  '香港特别行政区', '澳门特别行政区', '台湾省'
];

// 公司规模选项
export const COMPANY_SIZES = [
  '1-10人',
  '11-50人',
  '51-200人',
  '201-500人',
  '501-1000人',
  '1000人以上'
];

// 用户角色标签
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  individual: '个人用户',
  company: '企业用户',
  designer: '设计师',
  contractor: '承包商',
  supplier: '供应商',
  consultant: '顾问',
  admin: '管理员'
};

// API 响应类型
export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserDashboardData {
  user: User;
  profile: UserProfile;
  stats: UserStats;
  recent_calculations: CalculationRecord[];
  recent_contacts: UserContactRecord[];
  recent_appointments: AppointmentRecord[];
  favorites: UserFavorite[];
}


