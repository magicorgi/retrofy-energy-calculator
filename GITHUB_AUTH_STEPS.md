# 🔐 GitHub认证配置步骤

## 🎯 当前状态
✅ **GitHub仓库已创建**: https://github.com/magicorgi/retrofy-energy-calculator
✅ **代码已准备**: 62个文件，20,315行代码待推送
⚠️ **需要认证**: 配置GitHub访问权限

---

## 📋 认证配置步骤

### 方法1: Personal Access Token (推荐)

#### 1. 创建Personal Access Token
1. 访问 [GitHub](https://github.com)
2. 点击右上角头像 → **Settings**
3. 左侧菜单滚动到底部 → **Developer settings**
4. 点击 **Personal access tokens** → **Tokens (classic)**
5. 点击 **Generate new token** → **Generate new token (classic)**
6. 填写信息：
   - **Note**: `Retrofy Energy Calculator Deploy`
   - **Expiration**: `90 days`
   - **Scopes**: 勾选 ✅ **repo** (完整仓库访问权限)
7. 点击 **Generate token**
8. **复制生成的token**（只显示一次！）

#### 2. 配置本地认证
将生成的token告诉我，我来配置推送命令。

### 方法2: GitHub CLI (更简单)
```bash
# 安装GitHub CLI
brew install gh

# 登录GitHub
gh auth login

# 推送代码
git push -u origin main
```

---

## 🚀 推送代码

### 使用Personal Access Token
```bash
# 配置远程仓库URL（包含token）
git remote set-url origin https://YOUR_TOKEN@github.com/magicorgi/retrofy-energy-calculator.git

# 推送代码
git push -u origin main
```

### 使用GitHub CLI
```bash
gh auth login
git push -u origin main
```

---

## 🎯 推送完成后：立即部署到Vercel

### 1. 访问Vercel
- 打开 [vercel.com](https://vercel.com)
- 使用GitHub账户登录

### 2. 导入项目
- 点击 "New Project"
- 选择 `retrofy-energy-calculator` 仓库
- Vercel自动检测为Next.js项目

### 3. 部署配置
- **Framework**: Next.js ✅ (自动检测)
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅
- **Install Command**: `npm install` ✅

### 4. 开始部署
- 点击 "Deploy"
- 等待2-3分钟构建完成
- 获得访问链接

---

## 📱 部署完成后的访问地址

### 预期链接
- **主链接**: `https://retrofy-energy-calculator.vercel.app`
- **首页**: `https://retrofy-energy-calculator.vercel.app`
- **计算器**: `https://retrofy-energy-calculator.vercel.app/calculator`
- **冷水机组**: `https://retrofy-energy-calculator.vercel.app/calculator/hvac/source/chiller`
- **热泵系统**: `https://retrofy-energy-calculator.vercel.app/calculator/hvac/source/heat-pump`
- **工业高温热泵**: `https://retrofy-energy-calculator.vercel.app/calculator/hvac/source/industrial-heat-pump`

---

## 🎊 下一步

**请选择认证方式：**
1. **Personal Access Token** - 创建token并告诉我
2. **GitHub CLI** - 我帮您安装并配置

**选择后，5分钟内完成整个部署流程！** 🚀








