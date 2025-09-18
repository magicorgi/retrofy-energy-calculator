// 产品推荐模块数据类型定义

export interface Product {
  id: string;
  brand: string; // 品牌
  model: string; // 型号
  cooling_capacity: number; // 制冷量(kW)
  heating_capacity?: number; // 制热量(kW)
  cop: number; // COP
  iplv: number; // IPLV
  price_min: number; // 价格区间最小值
  price_max: number; // 价格区间最大值
  price_unit: string; // 价格单位 (元/kW, 万元/台)
  images: string[]; // 产品图片URL数组
  manual_url?: string; // 技术手册URL
  contact_person: string; // 联系人
  contact_phone: string; // 联系电话
  contact_email?: string; // 联系邮箱
  company: string; // 厂商公司
  description?: string; // 产品描述
  features?: string[]; // 产品特点
  specifications?: Record<string, any>; // 技术规格
  applicable_cities?: string[]; // 适用城市
  category: ProductCategory; // 产品类别
  energy_efficiency_grade?: string; // 能效等级
  refrigerant_type?: string; // 制冷剂类型
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'pending'; // 状态
  source: 'manual' | 'api' | 'excel'; // 数据来源
}

export type ProductCategory = 
  | 'chiller' // 冷水机组
  | 'heat_pump' // 热泵
  | 'industrial_hp' // 工业高温热泵
  | 'air_conditioning' // 空调
  | 'refrigeration' // 制冷设备
  | 'other'; // 其他

export interface ProductFilter {
  city?: string; // 城市筛选
  brand?: string; // 品牌筛选
  category?: ProductCategory; // 类别筛选
  cooling_capacity_min?: number; // 制冷量最小值
  cooling_capacity_max?: number; // 制冷量最大值
  price_min?: number; // 价格最小值
  price_max?: number; // 价格最大值
  cop_min?: number; // COP最小值
  iplv_min?: number; // IPLV最小值
  energy_grade?: string; // 能效等级
}

export interface ProductSort {
  field: 'energy_savings' | 'price' | 'cop' | 'iplv' | 'cooling_capacity' | 'created_at';
  order: 'asc' | 'desc';
}

export interface ProductComparison {
  id: string;
  products: string[]; // 产品ID数组
  created_at: string;
  updated_at: string;
}

export interface ContactRecord {
  id: string;
  product_id: string;
  company_name?: string;
  contact_name: string;
  phone: string;
  email?: string;
  message: string;
  status: 'pending' | 'contacted' | 'quoted' | 'closed';
  created_at: string;
  updated_at: string;
  assigned_to?: string; // 分配给哪个销售
}

export interface ProductCase {
  id: string;
  product_id: string;
  title: string;
  description: string;
  location: string;
  project_scale: string; // 项目规模
  energy_savings: number; // 节能效果
  investment_return: number; // 投资回报期
  images: string[];
  created_at: string;
}

// API 响应类型
export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  filters: ProductFilter;
  sort: ProductSort;
}

export interface ProductStats {
  total_products: number;
  brands_count: number;
  categories_count: number;
  avg_cop: number;
  avg_price: number;
}


