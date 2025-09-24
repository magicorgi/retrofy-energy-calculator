# 📤 GitHub完整设置指南

## 🎯 当前状态
✅ **Git仓库已准备**: 62个文件，20,315行代码已提交
✅ **远程仓库已配置**: 指向 `https://github.com/magicorgi/retrofy-energy-calculator.git`
⚠️ **需要认证**: GitHub认证配置

---

## 📋 完整操作步骤

### 1. 创建GitHub仓库
1. 访问 [GitHub](https://github.com)
2. 登录您的账户 (`magicorgi`)
3. 点击右上角 "+" → "New repository"
4. 填写信息：
   - **Repository name**: `retrofy-energy-calculator`
   - **Description**: `专业的HVAC节能改造计算平台 - 包含冷水机组、热泵系统、工业高温热泵等专业计算器`
   - **Visibility**: **Public** (重要：便于Vercel部署)
5. **不要**勾选任何初始化选项
6. 点击 "Create repository"

### 2. 配置GitHub认证
有两种方式：

#### 方式A: Personal Access Token (推荐)
1. 在GitHub点击头像 → Settings
2. 左侧菜单最下方 → Developer settings
3. Personal access tokens → Tokens (classic)
4. Generate new token (classic)
5. 勾选 `repo` 权限
6. 复制生成的token

#### 方式B: SSH Key
1. 生成SSH密钥：
```bash
ssh-keygen -t ed25519 -C "yzspotlight@gmail.com"
```
2. 添加到GitHub Settings → SSH and GPG keys

### 3. 推送代码
```bash
cd /Users/magicorgi/AppDev/Retrofy/Retrofy/retrofy-web

# 使用Personal Access Token
git remote set-url origin https://YOUR_TOKEN@github.com/magicorgi/retrofy-energy-calculator.git
git push -u origin main

# 或使用SSH (如果配置了SSH key)
git remote set-url origin git@github.com:magicorgi/retrofy-energy-calculator.git
git push -u origin main
```

---

## 🚀 推送完成后：Vercel部署

### 自动部署流程
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账户登录
3. 点击 "New Project"
4. 选择 `retrofy-energy-calculator` 仓库
5. 配置确认：
   - Framework: **Next.js** (自动检测)
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. 点击 "Deploy"

### 部署时间
- **构建时间**: 约2-3分钟
- **全球分发**: 自动完成
- **获得链接**: `https://retrofy-energy-calculator.vercel.app`

---

## 🎊 部署完成后

### 功能验证清单
- [ ] 首页正常显示
- [ ] 导航菜单工作
- [ ] 高效主机选型计算器 Pro
- [ ] 热泵系统计算器
- [ ] 工业高温热泵计算器
- [ ] 移动端适配
- [ ] 计算功能准确

### 分享链接
- **主链接**: `https://retrofy-energy-calculator.vercel.app`
- **计算器**: `https://retrofy-energy-calculator.vercel.app/calculator`
- **冷水机组**: `https://retrofy-energy-calculator.vercel.app/calculator/hvac/source/chiller`

---

## 🎯 下一步

**请您完成GitHub仓库创建，然后告诉我：**
1. 仓库是否创建成功
2. 您选择使用Token还是SSH认证
3. 我来帮您完成代码推送

**创建仓库后，整个部署过程只需要5分钟！** 🚀






