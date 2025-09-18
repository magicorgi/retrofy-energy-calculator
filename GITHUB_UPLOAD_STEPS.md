# 📤 GitHub上传步骤

## 🎯 当前状态
✅ **Git仓库已初始化**
✅ **代码已提交** (62个文件，20,315行代码)
✅ **准备推送到GitHub**

---

## 📋 上传步骤

### 1. 创建GitHub仓库
1. 访问 [GitHub](https://github.com)
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - **Repository name**: `retrofy-energy-calculator`
   - **Description**: `专业的HVAC节能改造计算平台`
   - **Visibility**: Public (便于Vercel部署)
4. **不要**勾选 "Add a README file"（我们已有代码）
5. 点击 "Create repository"

### 2. 连接远程仓库
创建仓库后，GitHub会显示推送命令，类似：

```bash
git remote add origin https://github.com/YOUR_USERNAME/retrofy-energy-calculator.git
git branch -M main
git push -u origin main
```

### 3. 执行推送命令
```bash
cd /Users/magicorgi/AppDev/Retrofy/Retrofy/retrofy-web

# 添加远程仓库（替换YOUR_USERNAME为您的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/retrofy-energy-calculator.git

# 推送代码
git branch -M main
git push -u origin main
```

---

## 🚀 推送后的Vercel部署

### 自动部署步骤
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账户登录
3. 点击 "New Project"
4. 选择 `retrofy-energy-calculator` 仓库
5. Vercel自动检测为Next.js项目
6. 点击 "Deploy"

### 部署配置（自动）
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

---

## 📱 部署完成后

### 获得的访问地址
- **主域名**: `https://retrofy-energy-calculator.vercel.app`
- **预览域名**: `https://retrofy-energy-calculator-git-main-username.vercel.app`

### 功能验证
- ✅ 首页展示
- ✅ 高效主机选型计算器 Pro
- ✅ 热泵系统计算器
- ✅ 工业高温热泵计算器
- ✅ 移动端适配

---

## 🎯 准备就绪

**当前代码包含**:
- 62个文件
- 20,315行代码
- 3个专业计算器
- 完整的UI和交互逻辑
- 响应式设计

**请提供您的GitHub用户名，我来帮您执行推送命令！** 🚀



