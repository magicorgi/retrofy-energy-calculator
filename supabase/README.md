# Supabase 后端集成

本目录包含RetroPro 节改专家项目的Supabase后端配置和数据库架构。

## 📁 文件结构

```
supabase/
├── README.md                 # 本文件
├── DEPLOYMENT_GUIDE.md       # 详细部署指南
├── schema.sql               # 完整数据库架构
└── env.example.txt          # 环境变量示例
```

## 🗄️ 数据库架构

### 核心表

1. **users** - 用户表
   - 存储用户账号、角色、权限信息
   - 支持三种角色：user, admin, super-admin
   - 包含状态管理和权限控制

2. **products** - 产品表
   - 存储丹佛斯产品信息
   - 支持按区域、行业、类别筛选
   - 包含产品图片、规格、联系信息

3. **demand_surveys** - 需求收集表
   - 存储工厂、建筑、园区调研数据
   - 包含完整的能源系统和能耗信息
   - 支持草稿和提交状态

4. **customer_visits** - 客户拜访记录表
   - 记录客户拜访的详细信息
   - 涵盖商务关系、采购、设备、供应商、机会信息
   - 计算完成度

5. **appointments** - 预约咨询表
   - 管理咨询预约信息
   - 包含项目详情和能源目标
   - 支持状态跟踪

6. **cases** - 案例库表
   - 存储改造案例
   - 包含节能效果和投资回报数据
   - 支持多媒体资源

7. **calculator_records** - 计算器记录表
   - 保存节能计算结果
   - 支持多种计算器类型
   - 可关联项目

8. **feedback** - 用户反馈表
   - 收集用户反馈和建议
   - 支持优先级和状态管理
   - 管理员可回复

9. **invitations** - 邀请记录表
   - 管理用户邀请流程
   - 生成临时密码和token
   - 支持过期和状态跟踪

10. **system_logs** - 系统日志表
    - 记录所有系统操作
    - 用于审计和监控
    - 包含IP和用户代理信息

### 数据库特性

- ✅ **Row Level Security (RLS)**: 所有表都启用了行级安全策略
- ✅ **自动时间戳**: 使用触发器自动更新`updated_at`
- ✅ **索引优化**: 关键字段添加了索引以提升查询性能
- ✅ **数据验证**: 使用CHECK约束确保数据完整性
- ✅ **JSONB支持**: 灵活存储复杂数据结构
- ✅ **外键关联**: 保证数据引用完整性

## 🔒 安全策略

### Row Level Security (RLS) 策略

1. **用户表**:
   - 用户只能查看和更新自己的数据
   - 管理员可以查看所有用户

2. **产品表**:
   - 所有人可以查看活跃产品
   - 只有管理员可以创建、更新、删除产品

3. **需求收集表**:
   - 用户只能查看和管理自己的调研
   - 管理员可以查看所有调研

4. **客户拜访表**:
   - 用户只能查看和管理自己的拜访记录
   - 管理员可以查看所有记录

5. **案例库**:
   - 所有人可以查看已发布案例
   - 只有管理员可以管理案例

## 📊 统计视图

### user_statistics
提供用户统计信息：
- 总用户数
- 管理员数量
- 活跃用户数
- 待确认用户数
- 最近30天活跃用户

### product_statistics
提供产品统计信息：
- 总产品数
- 活跃产品数
- 产品类别数
- 品牌数量

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install @supabase/supabase-js
```

### 2. 配置环境变量

复制 `env.example.txt` 的内容到项目根目录的 `.env.local` 文件。

### 3. 部署数据库

按照 `DEPLOYMENT_GUIDE.md` 中的步骤操作。

### 4. 使用API

```typescript
import { supabase } from '@/lib/supabase/client'

// 获取产品列表
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('status', 'active')
```

## 📚 API服务层

项目提供了完整的API服务层封装：

### 用户服务 (`src/lib/api/users.ts`)
```typescript
import { getAllUsers, getUserById, createUser, updateUser } from '@/lib/api/users'
```

### 产品服务 (`src/lib/api/products.ts`)
```typescript
import { getAllProducts, getProductById, createProduct, updateProduct } from '@/lib/api/products'
```

## 🔄 数据迁移

### 从localStorage迁移到Supabase

1. 导出现有localStorage数据
2. 使用API批量导入到Supabase
3. 更新前端代码使用Supabase API
4. 测试所有功能
5. 移除localStorage相关代码

## 📈 性能优化

### 索引策略
- 所有常用查询字段都添加了索引
- 使用复合索引优化多条件查询
- JSONB字段使用GIN索引

### 查询优化
- 使用select指定需要的字段
- 合理使用limit和offset进行分页
- 使用count进行总数统计
- 利用视图简化复杂查询

## 🛠️ 维护指南

### 备份策略
- Supabase自动日常备份
- 重要操作前手动创建快照
- 定期导出关键数据

### 监控指标
- 数据库连接数
- 查询响应时间
- 存储空间使用
- API调用频率

### 数据清理
- 定期清理过期的邀请记录
- 归档历史日志数据
- 删除无用的草稿数据

## 📞 支持

如需帮助，请：
1. 查看 `DEPLOYMENT_GUIDE.md`
2. 访问 [Supabase文档](https://supabase.com/docs)
3. 查看项目GitHub Issues
4. 联系技术支持

---

**版本**: 1.0.0  
**最后更新**: 2024-01-15

