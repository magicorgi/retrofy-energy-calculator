# Supabase 部署指南

本指南将帮助您在Supabase上部署RetroPro 节改专家的后端数据库。

## 📋 前置要求

1. 一个Supabase账号（免费或付费）
2. Node.js和npm已安装
3. Git已安装

## 🚀 步骤1：创建Supabase项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 登录或注册账号
3. 点击"New Project"创建新项目
4. 填写项目信息：
   - **Name**: retrofy-energy-calculator
   - **Database Password**: 设置一个强密码（请妥善保存）
   - **Region**: 选择离您最近的区域（建议选择新加坡或东京）
   - **Pricing Plan**: 选择Free tier（或根据需要选择付费方案）
5. 点击"Create new project"，等待项目创建完成（约2-3分钟）

## 📊 步骤2：执行数据库架构

1. 在Supabase项目页面，点击左侧菜单的"SQL Editor"
2. 点击"New query"创建新查询
3. 复制 `supabase/schema.sql` 文件的全部内容
4. 粘贴到SQL编辑器中
5. 点击"Run"执行SQL脚本
6. 等待执行完成，确认没有错误

### 验证数据库架构

执行以下SQL验证表是否创建成功：

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

您应该看到以下表：
- users
- products
- demand_surveys
- customer_visits
- appointments
- cases
- calculator_records
- feedback
- invitations
- system_logs

## 🔑 步骤3：获取API密钥

1. 在Supabase项目页面，点击左侧菜单的"Settings"
2. 点击"API"
3. 复制以下信息：
   - **Project URL**: 您的Supabase项目URL
   - **anon public**: 匿名公钥（用于客户端）
   - **service_role**: 服务角色密钥（用于服务端，请妥善保管）

## ⚙️ 步骤4：配置环境变量

1. 在项目根目录创建 `.env.local` 文件
2. 添加以下内容（替换为您的实际密钥）：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=RetroPro 节改专家

# Email Configuration (可选，用于生产环境)
EMAIL_FROM=noreply@retrofy.com
EMAIL_SERVICE_API_KEY=your-email-service-api-key
```

3. 保存文件
4. **重要**: 确保 `.env.local` 已添加到 `.gitignore` 中

## 🔒 步骤5：配置Row Level Security (RLS)

RLS策略已在`schema.sql`中定义，但需要确认已启用：

1. 在SQL Editor中执行以下查询，检查RLS是否启用：

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

2. 所有表的`rowsecurity`应该为`true`

## 👤 步骤6：创建管理员账户

### 方法1：通过Supabase Auth

1. 在Supabase项目页面，点击"Authentication" > "Users"
2. 点击"Add user" > "Create new user"
3. 填写管理员邮箱和密码
4. 点击"Create user"
5. 在SQL Editor中执行以下SQL，将该用户设置为管理员：

```sql
INSERT INTO users (email, name, role, status, permissions)
VALUES ('admin@danfoss.com.cn', '系统管理员', 'admin', 'active', 
        '["demand-collection", "customer-visit", "user-management"]'::jsonb)
ON CONFLICT (email) 
DO UPDATE SET role = 'admin', status = 'active';
```

### 方法2：通过应用注册

1. 启动应用：`npm run dev`
2. 访问注册页面
3. 注册管理员账号
4. 在Supabase SQL Editor中将该账号升级为管理员（使用上面的SQL）

## 📱 步骤7：测试连接

1. 启动开发服务器：

```bash
npm run dev
```

2. 访问 `http://localhost:3000`
3. 尝试以下操作：
   - 注册新账号
   - 登录
   - 浏览产品列表
   - 测试管理员功能（如果已创建管理员账号）

## 🌐 步骤8：部署到Vercel

1. 在Vercel项目设置中添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. 重新部署：

```bash
git push origin main
```

3. Vercel将自动触发部署

## 🔍 步骤9：监控和维护

### 查看数据库使用情况

1. 在Supabase项目页面，点击"Database"
2. 查看"Database health"和"Usage"

### 备份数据库

1. 在Supabase项目页面，点击"Database" > "Backups"
2. Supabase会自动进行日常备份（免费计划保留7天）
3. 可以手动创建备份快照

### 查看日志

1. 在Supabase项目页面，点击"Logs"
2. 可以查看：
   - API logs
   - Database logs
   - Auth logs

## 🛠️ 常见问题

### Q: 连接数据库失败

**A**: 检查以下内容：
1. 环境变量是否正确配置
2. Supabase项目是否处于活跃状态
3. API密钥是否有效
4. 网络连接是否正常

### Q: RLS策略阻止了操作

**A**: 
1. 确认用户已登录
2. 检查用户角色和权限
3. 在SQL Editor中临时禁用RLS进行测试：`ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;`

### Q: 数据库容量不足

**A**: 
1. 免费计划提供500MB存储
2. 可以升级到付费计划获取更多空间
3. 定期清理不需要的日志和数据

## 📚 更多资源

- [Supabase官方文档](https://supabase.com/docs)
- [Next.js + Supabase指南](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security指南](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 获取帮助

如果遇到问题：
1. 查看Supabase项目的日志
2. 检查浏览器控制台错误
3. 访问Supabase Discord社区
4. 查看GitHub Issues

---

**完成！** 您的RetroPro 节改专家后端现已部署在Supabase上。🎉

