// 产品推荐模块数据类型定义

export interface Product {
  id: string;
  name: string; // 产品名称
  brand: string; // 品牌
  model: string; // 型号
  power_range: string; // 功率范围 (如: "10-50kW", "50-100kW")
  applicable_industries: string[]; // 适用行业或应用
  images: string[]; // 产品图片URL数组
  contact_region: string; // 联系区域
  contact_person: string; // 联系人
  contact_phone: string; // 联系电话
  contact_email?: string; // 联系邮箱
  company: string; // 厂商公司
  category: ProductCategory; // 产品类别
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'pending'; // 状态
  source: 'manual' | 'api' | 'excel'; // 数据来源
}

export type ProductCategory = 
  | 'compressor' // 压缩机
  | 'frequency_converter' // 变频器
  | 'heat_exchanger' // 换热器
  | 'hydraulic_valve' // 水力平衡阀
  | 'sensor' // 传感器
  | 'control_system' // 控制系统
  | 'expansion_valve' // 膨胀阀
  | 'filter_drier' // 过滤器干燥器
  | 'other'; // 其他

export type ContactRegion = 
  | 'north' // 华北
  | 'east' // 华东
  | 'south' // 华南
  | 'central' // 华中
  | 'southwest' // 西南
  | 'northeast' // 东北
  | 'northwest'; // 西北

export type ApplicableIndustry = 
  | 'food_beverage' // 食品饮料
  | 'electronics' // 电子半导体
  | 'pharmaceutical' // 制药生物制品
  | 'tobacco' // 烟草
  | 'metallurgy' // 金属冶炼/金属加工
  | 'chemical' // 化工
  | 'automotive' // 汽车工业
  | 'machinery' // 机械加工
  | 'commercial_building' // 商业建筑
  | 'residential' // 住宅
  | 'hospital' // 医院
  | 'school' // 学校
  | 'other'; // 其他

export interface ProductFilter {
  brand?: string; // 品牌筛选
  category?: ProductCategory; // 类别筛选
  power_range?: string; // 功率范围筛选
  applicable_industry?: string; // 适用行业筛选
  contact_region?: string; // 联系区域筛选
}

export interface ProductSort {
  field: 'name' | 'brand' | 'power_range' | 'created_at';
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


