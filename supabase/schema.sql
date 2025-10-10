-- =====================================================
-- RetroPro 节改专家 - Supabase 数据库架构
-- =====================================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. 用户表 (users)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password_hash TEXT,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super-admin')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive')),
  phone VARCHAR(20),
  company VARCHAR(255),
  permissions JSONB DEFAULT '[]'::jsonb,
  temp_password VARCHAR(100),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户表索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- =====================================================
-- 2. 产品表 (products)
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  power_range VARCHAR(50),
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'compressor', 'frequency_converter', 'heat_exchanger', 
    'hydraulic_valve', 'sensor', 'control_system', 
    'expansion_valve', 'filter_drier', 'other'
  )),
  applicable_industries JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  contact_region VARCHAR(50) NOT NULL CHECK (contact_region IN (
    'north', 'east', 'south', 'central', 
    'southwest', 'northeast', 'northwest'
  )),
  contact_person VARCHAR(100),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  company VARCHAR(255),
  description TEXT,
  specifications JSONB,
  features JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  source VARCHAR(50) DEFAULT 'manual' CHECK (source IN ('manual', 'api', 'import')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 产品表索引
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_contact_region ON products(contact_region);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- =====================================================
-- 3. 需求收集表 (demand_surveys)
-- =====================================================
CREATE TABLE IF NOT EXISTS demand_surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  survey_type VARCHAR(50) NOT NULL CHECK (survey_type IN ('factory', 'building', 'park')),
  
  -- 基本信息
  address TEXT,
  region VARCHAR(100),
  city VARCHAR(100),
  owner_name VARCHAR(255),
  contact_person VARCHAR(100),
  contact_position VARCHAR(100),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  
  -- 工厂/建筑特定信息
  industry VARCHAR(100),
  building_type JSONB,
  energy_systems JSONB,
  building_area NUMERIC,
  air_conditioning_area NUMERIC,
  completion_year INTEGER,
  floors_above INTEGER,
  floors_below INTEGER,
  
  -- 设备信息
  equipment_info JSONB,
  
  -- 能耗信息
  energy_consumption JSONB,
  energy_costs JSONB,
  
  -- 光伏和储能
  has_photovoltaic BOOLEAN DEFAULT false,
  photovoltaic_capacity NUMERIC,
  photovoltaic_roof_area NUMERIC,
  has_energy_storage BOOLEAN DEFAULT false,
  energy_storage_capacity NUMERIC,
  
  -- 其他信息
  additional_notes TEXT,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'completed')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 需求收集表索引
CREATE INDEX idx_demand_surveys_user_id ON demand_surveys(user_id);
CREATE INDEX idx_demand_surveys_survey_type ON demand_surveys(survey_type);
CREATE INDEX idx_demand_surveys_status ON demand_surveys(status);
CREATE INDEX idx_demand_surveys_created_at ON demand_surveys(created_at DESC);

-- =====================================================
-- 4. 客户拜访记录表 (customer_visits)
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  
  -- 客户基本信息
  customer_name VARCHAR(255) NOT NULL,
  customer_company VARCHAR(255),
  customer_industry VARCHAR(100),
  customer_address TEXT,
  customer_phone VARCHAR(20),
  customer_email VARCHAR(255),
  
  -- 商务关系
  decision_maker_name VARCHAR(100),
  decision_maker_position VARCHAR(100),
  business_scope TEXT,
  relationship_level VARCHAR(50),
  
  -- 采购信息
  project_start_date DATE,
  budget_approval_date DATE,
  procurement_method VARCHAR(100),
  
  -- 设备信息
  danfoss_usage TEXT,
  competitor_usage TEXT,
  equipment_environment VARCHAR(100),
  equipment_lifecycle JSONB,
  application_methods TEXT,
  
  -- 重要设备
  key_equipment TEXT,
  equipment_importance TEXT,
  downtime_cost TEXT,
  current_pain_points TEXT,
  current_solutions TEXT,
  
  -- 供应商信息
  maintenance_provider TEXT,
  replacement_provider TEXT,
  
  -- 机会信息
  annual_budget TEXT,
  ongoing_projects TEXT,
  participation_status TEXT,
  competitor_info TEXT,
  next_year_plans TEXT,
  
  -- 拜访完成度
  completion_rate INTEGER DEFAULT 0,
  
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'follow-up')),
  visit_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 客户拜访表索引
CREATE INDEX idx_customer_visits_user_id ON customer_visits(user_id);
CREATE INDEX idx_customer_visits_customer_company ON customer_visits(customer_company);
CREATE INDEX idx_customer_visits_status ON customer_visits(status);
CREATE INDEX idx_customer_visits_visit_date ON customer_visits(visit_date DESC);
CREATE INDEX idx_customer_visits_created_at ON customer_visits(created_at DESC);

-- =====================================================
-- 5. 预约咨询表 (appointments)
-- =====================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  
  -- 预约信息
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  
  -- 项目信息
  project_type VARCHAR(100),
  project_location TEXT,
  building_type VARCHAR(100),
  building_area NUMERIC,
  
  -- 能源系统
  energy_systems JSONB,
  annual_energy_cost NUMERIC,
  
  -- 预期目标
  energy_saving_target NUMERIC,
  investment_budget NUMERIC,
  
  -- 首选时间
  preferred_date DATE,
  preferred_time VARCHAR(50),
  
  additional_requirements TEXT,
  
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 预约表索引
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_preferred_date ON appointments(preferred_date);
CREATE INDEX idx_appointments_created_at ON appointments(created_at DESC);

-- =====================================================
-- 6. 案例库表 (cases)
-- =====================================================
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- 项目信息
  location VARCHAR(255),
  industry VARCHAR(100),
  building_type VARCHAR(100),
  project_scale TEXT,
  
  -- 改造详情
  original_system TEXT,
  retrofit_solution TEXT,
  products_used JSONB,
  
  -- 效果数据
  energy_savings NUMERIC,
  cost_savings NUMERIC,
  investment_amount NUMERIC,
  payback_period NUMERIC,
  co2_reduction NUMERIC,
  
  -- 媒体资源
  images JSONB DEFAULT '[]'::jsonb,
  videos JSONB DEFAULT '[]'::jsonb,
  documents JSONB DEFAULT '[]'::jsonb,
  
  -- 元数据
  featured BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  views INTEGER DEFAULT 0,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 案例库表索引
CREATE INDEX idx_cases_industry ON cases(industry);
CREATE INDEX idx_cases_building_type ON cases(building_type);
CREATE INDEX idx_cases_featured ON cases(featured);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_created_at ON cases(created_at DESC);

-- =====================================================
-- 7. 计算器记录表 (calculator_records)
-- =====================================================
CREATE TABLE IF NOT EXISTS calculator_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  calculator_type VARCHAR(100) NOT NULL,
  
  -- 输入参数
  input_data JSONB NOT NULL,
  
  -- 计算结果
  output_data JSONB,
  
  -- 元数据
  project_name VARCHAR(255),
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 计算器记录表索引
CREATE INDEX idx_calculator_records_user_id ON calculator_records(user_id);
CREATE INDEX idx_calculator_records_calculator_type ON calculator_records(calculator_type);
CREATE INDEX idx_calculator_records_created_at ON calculator_records(created_at DESC);

-- =====================================================
-- 8. 用户反馈表 (feedback)
-- =====================================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  
  type VARCHAR(50) CHECK (type IN ('bug', 'feature', 'improvement', 'other')),
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  admin_response TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 反馈表索引
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_type ON feedback(type);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_priority ON feedback(priority);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);

-- =====================================================
-- 9. 邀请记录表 (invitations)
-- =====================================================
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invited_by UUID REFERENCES users(id),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  permissions JSONB DEFAULT '[]'::jsonb,
  temp_password VARCHAR(100) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  message TEXT,
  
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 邀请表索引
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_status ON invitations(status);
CREATE INDEX idx_invitations_expires_at ON invitations(expires_at);

-- =====================================================
-- 10. 系统日志表 (system_logs)
-- =====================================================
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 系统日志表索引
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX idx_system_logs_action ON system_logs(action);
CREATE INDEX idx_system_logs_entity_type ON system_logs(entity_type);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at DESC);

-- =====================================================
-- 触发器：自动更新 updated_at 时间戳
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为所有需要的表添加触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_demand_surveys_updated_at BEFORE UPDATE ON demand_surveys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_visits_updated_at BEFORE UPDATE ON customer_visits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calculator_records_updated_at BEFORE UPDATE ON calculator_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Row Level Security (RLS) 策略
-- =====================================================

-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- 用户表策略
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super-admin')
    )
  );

-- 产品表策略（公开读取，管理员可写）
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super-admin')
    )
  );

-- 需求收集表策略
CREATE POLICY "Users can view their own surveys" ON demand_surveys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create surveys" ON demand_surveys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own surveys" ON demand_surveys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all surveys" ON demand_surveys
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super-admin')
    )
  );

-- 客户拜访表策略
CREATE POLICY "Users can view their own visits" ON customer_visits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create visits" ON customer_visits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visits" ON customer_visits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all visits" ON customer_visits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super-admin')
    )
  );

-- 预约表策略
CREATE POLICY "Users can view their own appointments" ON appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all appointments" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super-admin')
    )
  );

-- 案例库策略（公开读取）
CREATE POLICY "Anyone can view published cases" ON cases
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage cases" ON cases
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super-admin')
    )
  );

-- 计算器记录表策略
CREATE POLICY "Users can view their own calculator records" ON calculator_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create calculator records" ON calculator_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 反馈表策略
CREATE POLICY "Users can view their own feedback" ON feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create feedback" ON feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback" ON feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super-admin')
    )
  );

-- =====================================================
-- 初始化数据
-- =====================================================

-- 插入默认管理员账户（密码需要在应用层哈希）
INSERT INTO users (email, name, role, status, permissions) VALUES
  ('admin@danfoss.com.cn', '系统管理员', 'admin', 'active', '["demand-collection", "customer-visit", "user-management"]'::jsonb)
ON CONFLICT (email) DO NOTHING;

-- 插入示例产品数据
INSERT INTO products (name, brand, model, power_range, category, applicable_industries, contact_region, contact_person, contact_phone, contact_email, company, status) VALUES
  ('VLT® Flow Drive FC 111 变频器', '丹佛斯', 'FC 111', '0.75-630kW', 'frequency_converter', 
   '["food_beverage", "electronics", "commercial_building"]'::jsonb, 'east', 
   '李经理', '021-12345678', 'east@danfoss.com.cn', '丹佛斯（中国）有限公司', 'active'),
  ('Performer® HHP 涡旋压缩机', '丹佛斯', 'HHP', '5-240kW', 'compressor',
   '["residential", "commercial_building", "hospital"]'::jsonb, 'north',
   '张经理', '010-12345678', 'north@danfoss.com.cn', '丹佛斯（中国）有限公司', 'active')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 视图：用户统计
-- =====================================================
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
  COUNT(*) FILTER (WHERE role = 'user') as total_users,
  COUNT(*) FILTER (WHERE role = 'admin') as total_admins,
  COUNT(*) FILTER (WHERE status = 'active') as active_users,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_users,
  COUNT(*) FILTER (WHERE last_login > NOW() - INTERVAL '30 days') as active_last_month
FROM users;

-- =====================================================
-- 视图：产品统计
-- =====================================================
CREATE OR REPLACE VIEW product_statistics AS
SELECT 
  COUNT(*) as total_products,
  COUNT(*) FILTER (WHERE status = 'active') as active_products,
  COUNT(DISTINCT category) as total_categories,
  COUNT(DISTINCT brand) as total_brands
FROM products;

-- =====================================================
-- 完成
-- =====================================================

